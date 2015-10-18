using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BoinkChat.Models
{
    public class Message
    {
        public Guid MessageId { get; set; }
        public string AuthorName { get; set; }
        public string Body { get; set; }
        public DateTimeOffset TimeSent { get; set; }
    }
}
