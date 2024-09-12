using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class AddCodeFunctionBlock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TradeInterco",
                table: "BlockedStocks",
                newName: "WarehouseNumber");

            migrationBuilder.RenameColumn(
                name: "BlockedStockID",
                table: "BlockedStocks",
                newName: "User");

            migrationBuilder.AddColumn<string>(
                name: "BaseUnitOfMeasure",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Batch",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "BlockedQIStock",
                table: "BlockedStocks",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "BlockedSinceMonths",
                table: "BlockedStocks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BlockingPeriodCluster",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CodeFunctionBlocking",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "BlockedStocks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustBU",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustProfitCenter",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomID",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndOfLifeDate",
                table: "BlockedStocks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "GPLCode",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GlobalPortfolioStatus",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ItemText",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastChange",
                table: "BlockedStocks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "MRPController",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MatDocNumber",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Material",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MaterialDescription",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MaterialDocYear",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MovementType",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrderReason",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Plant",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProcurementType",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProdBU",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfitCenter",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfitCenterName",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RMANumber",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReturnSalesOrder",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpecialStock",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SpecialStockNumber",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StockCategory",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StorageBin",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StorageLocation",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StorageType",
                table: "BlockedStocks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Value",
                table: "BlockedStocks",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaseUnitOfMeasure",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "Batch",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "BlockedQIStock",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "BlockedSinceMonths",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "BlockingPeriodCluster",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "CodeFunctionBlocking",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "CustBU",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "CustProfitCenter",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "CustomID",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "EndOfLifeDate",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "GPLCode",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "GlobalPortfolioStatus",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ItemText",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "LastChange",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "MRPController",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "MatDocNumber",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "Material",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "MaterialDescription",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "MaterialDocYear",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "MovementType",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "OrderReason",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "Plant",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ProcurementType",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ProdBU",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ProfitCenter",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ProfitCenterName",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "RMANumber",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "ReturnSalesOrder",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "SpecialStock",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "SpecialStockNumber",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "StockCategory",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "StorageBin",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "StorageLocation",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "StorageType",
                table: "BlockedStocks");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "BlockedStocks");

            migrationBuilder.RenameColumn(
                name: "WarehouseNumber",
                table: "BlockedStocks",
                newName: "TradeInterco");

            migrationBuilder.RenameColumn(
                name: "User",
                table: "BlockedStocks",
                newName: "BlockedStockID");
        }
    }
}
