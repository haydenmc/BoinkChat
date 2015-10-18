using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BoinkChat.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }
    }
}
