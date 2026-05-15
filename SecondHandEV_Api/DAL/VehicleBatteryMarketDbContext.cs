using System;
using System.Collections.Generic;
using DAL.Enums;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DAL;

public partial class VehicleBatteryMarketDbContext : DbContext
{
    public VehicleBatteryMarketDbContext()
    {
    }

    public VehicleBatteryMarketDbContext(DbContextOptions<VehicleBatteryMarketDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Auction> Auctions { get; set; }

    public virtual DbSet<BatteryDetail> BatteryDetails { get; set; }

    public virtual DbSet<Bid> Bids { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Contract> Contracts { get; set; }

    public virtual DbSet<EbikeDetail> EbikeDetails { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<Listing> Listings { get; set; }

    public virtual DbSet<ListingImage> ListingImages { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<MemberAuth> MemberAuths { get; set; }

    public virtual DbSet<MemberProfile> MemberProfiles { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<PayOSPayment> PayOSPayments { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<TransactionsLog> TransactionsLogs { get; set; }

    private string GetConnectionString()
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true, true)
            .Build();
        return configuration.GetConnectionString("DefaultConnection");
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)

            optionsBuilder.UseSqlServer(GetConnectionString());
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auction>(entity =>
        {
            entity.HasKey(e => e.AuctionId).HasName("PK__Auctions__51004A4CE23C27D6");

            entity.HasIndex(e => e.CurrentWinnerId, "IX_Auctions_CurrentWinnerId");

            entity.HasIndex(e => e.ListingId, "UQ__Auctions__BF3EBED14F781AB9").IsUnique();

            entity.Property(e => e.BuyNowPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.CurrentPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.StartPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue(AuctionStatus.Upcoming);

            entity.HasOne(d => d.CurrentWinner).WithMany(p => p.Auctions)
                .HasForeignKey(d => d.CurrentWinnerId)
                .HasConstraintName("FK__Auctions__Curren__656C112C");

            entity.HasOne(d => d.Listing).WithOne(p => p.Auction)
                .HasForeignKey<Auction>(d => d.ListingId)
                .HasConstraintName("FK__Auctions__Listin__6477ECF3");
        });

        modelBuilder.Entity<BatteryDetail>(entity =>
        {
            entity.HasKey(e => e.ListingId).HasName("PK__BatteryD__BF3EBED00E27DE04");

            entity.Property(e => e.ListingId).ValueGeneratedNever();
            entity.Property(e => e.Brand).HasMaxLength(100);
            entity.Property(e => e.Condition).HasMaxLength(50);
            entity.Property(e => e.Model).HasMaxLength(100);
            entity.Property(e => e.Voltage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.WeightKg).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Listing).WithOne(p => p.BatteryDetail)
                .HasForeignKey<BatteryDetail>(d => d.ListingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BatteryDe__Listi__04E4BC85");
        });

        modelBuilder.Entity<Bid>(entity =>
        {
            entity.HasKey(e => e.BidId).HasName("PK__Bids__4A733D92BE64A057");

            entity.HasIndex(e => e.AuctionId, "IX_Bids_AuctionId");

            entity.HasIndex(e => e.BidderId, "IX_Bids_BidderId");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Auction).WithMany(p => p.Bids)
                .HasForeignKey(d => d.AuctionId)
                .HasConstraintName("FK__Bids__AuctionId__6A30C649");

            entity.HasOne(d => d.Bidder).WithMany(p => p.Bids)
                .HasForeignKey(d => d.BidderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Bids__BidderId__6B24EA82");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A0B72B95DD5");

            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D346951CCB53F");

            entity.HasIndex(e => e.OrderId, "UQ__Contract__C3905BCEA8E37823").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.SignedByBuyer).HasDefaultValue(false);
            entity.Property(e => e.SignedBySeller).HasDefaultValue(false);

            entity.HasOne(d => d.Order).WithOne(p => p.Contract)
                .HasForeignKey<Contract>(d => d.OrderId)
                .HasConstraintName("FK__Contracts__Order__5DCAEF64");
        });

        modelBuilder.Entity<EbikeDetail>(entity =>
        {
            entity.HasKey(e => e.ListingId).HasName("PK__EBikeDet__BF3EBED023E3ECCF");

            entity.ToTable("EBikeDetails");

            entity.Property(e => e.ListingId).ValueGeneratedNever();
            entity.Property(e => e.BatteryVoltage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Brand).HasMaxLength(100);
            entity.Property(e => e.Condition).HasMaxLength(50);
            entity.Property(e => e.FrameSize).HasMaxLength(50);
            entity.Property(e => e.Model).HasMaxLength(100);
            entity.Property(e => e.WeightKg).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Listing).WithOne(p => p.EbikeDetail)
                .HasForeignKey<EbikeDetail>(d => d.ListingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EBikeDeta__Listi__05D8E0BE");
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteId).HasName("PK__Favorite__CE74FAD53EB30588");

            entity.HasIndex(e => e.ListingId, "IX_Favorites_ListingId");

            entity.HasIndex(e => new { e.MemberId, e.ListingId }, "UQ_Fav").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Listing).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.ListingId)
                .HasConstraintName("FK_Fav_Listing");

            entity.HasOne(d => d.Member).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Fav_Member");
        });

        modelBuilder.Entity<Listing>(entity =>
        {
            entity.HasKey(e => e.ListingId).HasName("PK__Listings__BF3EBED077549B47");

            entity.HasIndex(e => e.MemberId, "IX_Listings_MemberId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.ListingStatus)
                .HasMaxLength(50)
                .HasDefaultValue("draft");
            entity.Property(e => e.ListingType)
                .HasMaxLength(20)
                .HasDefaultValue("buy_now");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Title).HasMaxLength(300);

            entity.HasOne(d => d.Category).WithMany(p => p.Listings)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Listings_Categories");

            entity.HasOne(d => d.Member).WithMany(p => p.Listings)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Listings__Member__47DBAE45");
        });

        modelBuilder.Entity<ListingImage>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PK__ListingI__7516F70CA5400FBD");

            entity.HasIndex(e => e.ListingId, "IX_ListingImages_ListingId");

            entity.Property(e => e.IsPrimary).HasDefaultValue(false);
            entity.Property(e => e.Url).HasMaxLength(1000);

            entity.HasOne(d => d.Listing).WithMany(p => p.ListingImages)
                .HasForeignKey(d => d.ListingId)
                .HasConstraintName("FK__ListingIm__Listi__4D94879B");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.MemberId).HasName("PK__Members__0CF04B18D8AC7003");

            entity.HasIndex(e => e.Phone, "UQ__Members__5C7E359E65C61BDC")
                .IsUnique()
                .HasFilter("([Phone] IS NOT NULL)");

            entity.HasIndex(e => e.Email, "UQ__Members__A9D10534F235FD87")
                .IsUnique()
                .HasFilter("([Email] IS NOT NULL)");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DisplayName).HasMaxLength(150);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValue("User");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(sysutcdatetime())");
        });

        modelBuilder.Entity<MemberAuth>(entity =>
        {
            entity.HasKey(e => e.MemberAuthId).HasName("PK__MemberAu__0B93795FA7668681");

            entity.HasIndex(e => e.MemberId, "UQ__MemberAu__0CF04B199F7340A5").IsUnique();

            entity.Property(e => e.AuthType).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Provider).HasMaxLength(100);
            entity.Property(e => e.ProviderUserId).HasMaxLength(255);

            entity.HasOne(d => d.Member).WithOne(p => p.MemberAuth)
                .HasForeignKey<MemberAuth>(d => d.MemberId)
                .HasConstraintName("FK__MemberAut__Membe__3F466844");
        });

        modelBuilder.Entity<MemberProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__MemberPr__290C88E46386368A");

            entity.HasIndex(e => e.MemberId, "UQ__MemberPr__0CF04B1949A28C36").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Bio).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.FullName).HasMaxLength(200);

            entity.HasOne(d => d.Member).WithOne(p => p.MemberProfile)
                .HasForeignKey<MemberProfile>(d => d.MemberId)
                .HasConstraintName("FK__MemberPro__Membe__440B1D61");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF6516D58F");

            entity.HasIndex(e => e.BuyerId, "IX_Orders_BuyerId");

            entity.HasIndex(e => e.ListingId, "IX_Orders_ListingId");

            entity.HasIndex(e => e.SellerId, "IX_Orders_SellerId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.OrderAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue(OrderStatus.Pending);

            entity.HasOne(d => d.Buyer).WithMany(p => p.OrderBuyers)
                .HasForeignKey(d => d.BuyerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__BuyerId__52593CB8");

            entity.HasOne(d => d.Listing).WithMany(p => p.Orders)
                .HasForeignKey(d => d.ListingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__ListingI__5165187F");

            entity.HasOne(d => d.Seller).WithMany(p => p.OrderSellers)
                .HasForeignKey(d => d.SellerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__SellerId__534D60F1");
        });

        modelBuilder.Entity<PayOSPayment>(entity =>
        {
            entity.HasKey(e => e.PayOspaymentId).HasName("PK__PayOSPayments__89738AA7D4F7456E");

            entity.ToTable("PayOSPayments");

            entity.HasIndex(e => e.CreatedAt, "IX_PayOSPayments_CreatedAt");

            entity.HasIndex(e => e.PaymentId, "IX_PayOSPayments_PaymentId");

            entity.Property(e => e.PayOspaymentId).HasColumnName("PayOSPaymentId");
            entity.Property(e => e.AccountName).HasMaxLength(255);
            entity.Property(e => e.AccountNumber).HasMaxLength(255);
            entity.Property(e => e.CancelReason).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Qrcode).HasColumnName("QRCode");
            entity.Property(e => e.Reference).HasMaxLength(255);

            entity.HasOne(d => d.Payment).WithMany(p => p.PayOspayments)
                .HasForeignKey(d => d.PaymentId)
                .HasConstraintName("FK_PayOSPayments_Payment");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A388666DF25");

            entity.HasIndex(e => e.OrderId, "IX_Payments_OrderId");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Provider).HasMaxLength(100);
            entity.Property(e => e.ProviderRef).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue(PaymentStatus.Pending);

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__Payments__OrderI__5812160E");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79CEBA33A37E");

            entity.HasIndex(e => e.OrderId, "IX_Reviews_OrderId");

            entity.HasIndex(e => e.RevieweeId, "IX_Reviews_RevieweeId");

            entity.HasIndex(e => e.ReviewerId, "IX_Reviews_ReviewerId");

            entity.Property(e => e.Comment).HasMaxLength(2000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Order).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__Reviews__OrderId__76969D2E");

            entity.HasOne(d => d.Reviewee).WithMany(p => p.ReviewReviewees)
                .HasForeignKey(d => d.RevieweeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__RevieweeId__75A278F5");

            entity.HasOne(d => d.Reviewer).WithMany(p => p.ReviewReviewers)
                .HasForeignKey(d => d.ReviewerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__ReviewerId__74AE54BC");
        });

        modelBuilder.Entity<TransactionsLog>(entity =>
        {
            entity.HasKey(e => e.TxnId).HasName("PK__Transact__C196085431C8A18C");

            entity.ToTable("TransactionsLog");

            entity.HasIndex(e => e.ListingId, "IX_TransactionsLog_ListingId");

            entity.HasIndex(e => e.MemberId, "IX_TransactionsLog_MemberId");

            entity.HasIndex(e => e.OrderId, "IX_TransactionsLog_OrderId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.EventType).HasMaxLength(100);

            entity.HasOne(d => d.Listing).WithMany(p => p.TransactionsLogs)
                .HasForeignKey(d => d.ListingId)
                .HasConstraintName("FK__Transacti__Listi__7C4F7684");

            entity.HasOne(d => d.Member).WithMany(p => p.TransactionsLogs)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK__Transacti__Membe__7B5B524B");

            entity.HasOne(d => d.Order).WithMany(p => p.TransactionsLogs)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__Transacti__Order__7D439ABD");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
