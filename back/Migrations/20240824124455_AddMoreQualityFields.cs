using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreQualityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "codeExpectedUsageDecision",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "codeReason",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "scrapRequestNo",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "codeExpectedUsageDecision",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "codeReason",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "scrapRequestNo",
                table: "BlockedStocks");
        }
    }
}
