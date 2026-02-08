using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class userTblColCng : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentCompleted",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "UserTopicMappings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EntryDate",
                table: "UserTopicMappings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "UserTopicMappings");

            migrationBuilder.DropColumn(
                name: "EntryDate",
                table: "UserTopicMappings");

            migrationBuilder.AddColumn<int>(
                name: "PaymentCompleted",
                table: "Users",
                type: "int",
                nullable: true);
        }
    }
}
