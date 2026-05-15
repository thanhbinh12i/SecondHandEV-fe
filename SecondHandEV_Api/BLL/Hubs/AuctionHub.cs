using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BLL.Hubs
{
    public class AuctionHub : Hub
    {
        /// <summary>
        /// Join an auction room to receive real-time updates
        /// </summary>
        public async Task JoinAuction(int auctionId)
        {
            var groupName = $"auction_{auctionId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Notify the client they've joined
            await Clients.Caller.SendAsync("JoinedAuction", new
            {
                auctionId,
                message = $"Successfully joined auction {auctionId}"
            });
        }

        /// <summary>
        /// Leave an auction room
        /// </summary>
        public async Task LeaveAuction(int auctionId)
        {
            var groupName = $"auction_{auctionId}";
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.SendAsync("LeftAuction", new
            {
                auctionId,
                message = $"Left auction {auctionId}"
            });
        }

        /// <summary>
        /// Called when a client connects
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("Connected", new
            {
                connectionId = Context.ConnectionId,
                message = "Connected to Auction Hub"
            });

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Called when a client disconnects
        /// </summary>
        public override async Task OnDisconnectedAsync(System.Exception? exception)
        {
            // Clean up any groups the user was in
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Broadcast auction status change (e.g., ending soon, ended)
        /// </summary>
        public async Task NotifyAuctionStatusChange(int auctionId, string status)
        {
            await Clients.Group($"auction_{auctionId}")
                .SendAsync("AuctionStatusChanged", new
                {
                    auctionId,
                    status,
                    timestamp = System.DateTime.UtcNow
                });
        }
    }
}