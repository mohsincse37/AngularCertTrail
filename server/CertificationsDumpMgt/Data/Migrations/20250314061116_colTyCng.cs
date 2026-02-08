using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class colTyCng : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TopicImgPath",
                table: "CertificationTopics");

            migrationBuilder.AddColumn<byte[]>(
                name: "TopicImg",
                table: "CertificationTopics",
                type: "varbinary(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TopicImg",
                table: "CertificationTopics");

            migrationBuilder.AddColumn<string>(
                name: "TopicImgPath",
                table: "CertificationTopics",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);
        }
    }
}
