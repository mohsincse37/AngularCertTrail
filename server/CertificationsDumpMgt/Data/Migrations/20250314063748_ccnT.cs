using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class ccnT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TopicImg",
                table: "CertificationTopics");

            migrationBuilder.AddColumn<string>(
                name: "TopicImgPath",
                table: "CertificationTopics",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TopicImgPath",
                table: "CertificationTopics");

            migrationBuilder.AddColumn<byte[]>(
                name: "TopicImg",
                table: "CertificationTopics",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
