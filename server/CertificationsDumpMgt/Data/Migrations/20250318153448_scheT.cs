using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class scheT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CertificationSchemes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TopicID = table.Column<int>(type: "int", nullable: false),
                    AccessType = table.Column<int>(type: "int", nullable: true),
                    AccessDuration = table.Column<int>(type: "int", nullable: false),
                    DurationUnit = table.Column<int>(type: "int", maxLength: 50, nullable: true),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    AmountUnit = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificationSchemes", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CertificationSchemes");
        }
    }
}
