using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class newClmTbs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OptionImgPath",
                table: "QuestionOptions",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TopicImgPath",
                table: "CertificationTopics",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AnsDescription",
                table: "CertificationQuestions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OptionType",
                table: "CertificationQuestions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionImgPath",
                table: "CertificationQuestions",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OptionImgPath",
                table: "QuestionOptions");

            migrationBuilder.DropColumn(
                name: "TopicImgPath",
                table: "CertificationTopics");

            migrationBuilder.DropColumn(
                name: "AnsDescription",
                table: "CertificationQuestions");

            migrationBuilder.DropColumn(
                name: "OptionType",
                table: "CertificationQuestions");

            migrationBuilder.DropColumn(
                name: "QuestionImgPath",
                table: "CertificationQuestions");
        }
    }
}
