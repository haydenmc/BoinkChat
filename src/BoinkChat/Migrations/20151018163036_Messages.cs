using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace BoinkChat.Migrations
{
    public partial class Messages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Message",
                columns: table => new
                {
                    MessageId = table.Column<Guid>(nullable: false),
                    AuthorName = table.Column<string>(nullable: true),
                    Body = table.Column<string>(nullable: true),
                    TimeSent = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.MessageId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Message");
        }
    }
}
