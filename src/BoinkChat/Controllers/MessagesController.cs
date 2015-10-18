using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using BoinkChat.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace BoinkChat.Controllers
{
    [Route("api/messages")]
    public class MessagesController : Controller
    {
        private ApplicationDbContext _db;

        public MessagesController(ApplicationDbContext context)
        {
            _db = context;
            context.Messages.Add(new Message()
            {
                MessageId = Guid.NewGuid(),
                AuthorName = "Test Author",
                Body = "Hello Ag!",
                TimeSent = DateTimeOffset.Now
            });
            context.SaveChanges();
        }

        // GET: api/messages
        [HttpGet]
        public IEnumerable<Message> Get()
        {
            //return "Woo!";
            return _db.Messages.OrderBy(m => m.TimeSent);
        }

        // GET api/Messages/5
        [HttpGet("{id}")]
        public Message Get(Guid id)
        {
            return _db.Messages.SingleOrDefault(m => m.MessageId == id);
        }
    }
}
