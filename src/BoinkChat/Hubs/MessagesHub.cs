using BoinkChat.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BoinkChat.Hubs
{
    public class MessagesHub : Hub
    {
        private ApplicationDbContext _db;

        public MessagesHub(ApplicationDbContext db)
        {
            _db = db;
        }

        public void SendMessage(string author, string body)
        {
            var message = new Message()
            {
                MessageId = Guid.NewGuid(),
                AuthorName = author,
                Body = body,
                TimeSent = DateTimeOffset.Now
            };
            _db.Messages.Add(message);
            Clients.All.messageReceived(message);
            _db.SaveChanges();
        }
    }
}
