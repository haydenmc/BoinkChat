using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using BoinkChat.Models;

namespace BoinkChat.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20151018163036_Messages")]
    partial class Messages
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Annotation("ProductVersion", "7.0.0-beta8-15964")
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("BoinkChat.Models.Message", b =>
                {
                    b.Property<Guid>("MessageId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AuthorName");

                    b.Property<string>("Body");

                    b.Property<DateTimeOffset>("TimeSent");

                    b.HasKey("MessageId");
                });
        }
    }
}
