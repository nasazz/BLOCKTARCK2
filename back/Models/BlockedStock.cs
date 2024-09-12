using System;
using System.ComponentModel.DataAnnotations;

namespace back.Models
{
    public class BlockedStock
    {
        [Key]
        public Guid Id { get; set; } // Guid for database ID
        
        public string Plant { get; set; } = string.Empty;
        public string Material { get; set; } = string.Empty;
        public string MaterialDescription { get; set; } = string.Empty;
        public string Batch { get; set; } = string.Empty;
        public decimal BlockedQIStock { get; set; }
        public string BaseUnitOfMeasure { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public DateTime LastChange { get; set; }
        public string StockCategory { get; set; } = string.Empty;
        public string MRPController { get; set; } = string.Empty;
        public string ItemText { get; set; } = string.Empty;
        public string MatDocNumber { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
        public string ProcurementType { get; set; } = string.Empty;
        public string MovementType { get; set; } = string.Empty;
        public string StorageLocation { get; set; } = string.Empty;
        public string StorageType { get; set; } = string.Empty;
        public string StorageBin { get; set; } = string.Empty;
        public string RMANumber { get; set; } = string.Empty;
        public string OrderReason { get; set; } = string.Empty;
        public string SpecialStock { get; set; } = string.Empty;
        public string CustBU { get; set; } = string.Empty;
        public string ProdBU { get; set; } = string.Empty;
        public string SpecialStockNumber { get; set; } = string.Empty;
        public string WarehouseNumber { get; set; } = string.Empty;
        public string ProfitCenterName { get; set; } = string.Empty;
        public string ProfitCenter { get; set; } = string.Empty;
        public string MaterialDocYear { get; set; } = string.Empty;
        public string ReturnSalesOrder { get; set; } = string.Empty;
        public string GPLCode { get; set; } = string.Empty;
        public string CustProfitCenter { get; set; } = string.Empty;
        public string GlobalPortfolioStatus { get; set; } = string.Empty;
        public DateTime EndOfLifeDate { get; set; }

        // New calculated attributes
        public string PnPlant { get; set; } = string.Empty; // Combination of Material + Plant
        public string Team { get; set; } = string.Empty; // Based on MRP Controller mapping
        public string CustomID { get; set; } = string.Empty; // Combination of specific fields
        public int BlockedSinceDays { get; set; } // CreatedOn - Current Date in Days
        public int BlockedSinceMonths { get; set; } // BlockedSinceDays / 30
        public string BlockingPeriodCluster { get; set; } = string.Empty; // Logic based on BlockedSinceMonths                                                                  
        public string ComponentOrFG { get; set; } = string.Empty; // Finish Goods, Purchased Component, or Produced Component
        public string CodeFunctionBlocking { get; set; } = string.Empty;
        public string codeReason { get; set; } = string.Empty;
        public string codeExpectedUsageDecision { get; set; } = string.Empty;
        public string scrapRequestNo { get; set; } = string.Empty;
    }
}
