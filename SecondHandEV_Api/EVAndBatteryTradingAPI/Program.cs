using BLL.Interfaces;
using BLL.Services;
using DAL;
using BLL.Hubs;
using DAL.Interfaces;
using DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Net.payOS;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<VehicleBatteryMarketDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add SignalR
builder.Services.AddSignalR();
// Register Generic Repository
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Register Specific Repositories
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();  // ← Admin Service
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IListingService, ListingService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
builder.Services.AddScoped<IAuctionService, AuctionService>();
builder.Services.AddScoped<IBidRepository, BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();
builder.Services.AddScoped<IPayOSPaymentRepository, PayOSPaymentRepository>();
builder.Services.AddScoped<IPayOSPaymentService, PayOSPaymentService>();
// Configure PayOS
var payOSClientId = builder.Configuration["PayOS:ClientId"]
    ?? throw new InvalidOperationException("PayOS ClientId not configured");
var payOSApiKey = builder.Configuration["PayOS:ApiKey"]
    ?? throw new InvalidOperationException("PayOS ApiKey not configured");
var payOSChecksumKey = builder.Configuration["PayOS:ChecksumKey"]
    ?? throw new InvalidOperationException("PayOS ChecksumKey not configured");
builder.Services.AddSingleton(new PayOS(payOSClientId, payOSApiKey, payOSChecksumKey));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",  // Vite default port
            "https://yourdomain.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };

    // Support JWT from headers
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Support token from query string (useful for SignalR, etc.)
            var accessToken = context.Request.Query["access_token"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Add Controllers with JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Vehicle Battery Market API",
        Version = "v1",
        Description = "API for Vehicle Battery Market Management System - Second-hand EV & Battery Trading Platform",
        Contact = new OpenApiContact
        {
            Name = "Development Team",
            Email = "dev@vehiclebatterymarket.com"
        }
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Chỉ cần paste JWT token vào ô bên dưới (KHÔNG cần thêm 'Bearer' ở đầu)\n\n" +
                      "Ví dụ: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add HTTP Context Accessor
builder.Services.AddHttpContextAccessor();

// Add Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// Add Response Caching
builder.Services.AddResponseCaching();

// Background services
builder.Services.AddHostedService<EVAndBatteryTradingAPI.Services.AuctionStatusUpdater>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vehicle Battery Market API V1");
        c.RoutePrefix = "swagger"; // Swagger ở /swagger
        c.DocumentTitle = "Vehicle Battery Market API Documentation";
        c.DefaultModelsExpandDepth(-1); // Ẩn schemas section
        c.DisplayRequestDuration(); // Hiển thị thời gian request
    });

    // Redirect root to Swagger in Development (chỉ map 1 lần)
    app.MapGet("/", () => Results.Redirect("/swagger"))
        .ExcludeFromDescription();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Enable CORS - must be before Authentication/Authorization
app.UseCors("AllowFrontend");

// Force HTTPS redirection
app.UseHttpsRedirection();

// Enable response compression
app.UseResponseCompression();

// Enable response caching
app.UseResponseCaching();

// Authentication & Authorization - order matters!
app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

// Map SignalR hubs
app.MapHub<AuctionHub>("/hubs/auction");

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "Vehicle Battery Market API"
}))
.WithName("HealthCheck")
.WithOpenApi()
.WithTags("Health");

// API Info endpoint
app.MapGet("/api/info", () => Results.Ok(new
{
    name = "Vehicle Battery Market API",
    version = "v1.0",
    description = "Second-hand EV & Battery Trading Platform",
    timestamp = DateTime.UtcNow,
    endpoints = new
    {
        auth = "/api/auth",
        admin = "/api/admin",
        auction = "/api/auction",
        listing = "/api/listing",
        order = "/api/order",
        payment = "/api/payment",
        payos = "/api/payos",
        swagger = "/swagger"
    }
}))
.WithName("APIInfo")
.WithOpenApi()
.WithTags("Info");

app.Run();