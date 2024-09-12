using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using back.Models;
using back.Services;
using OfficeOpenXml;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlockedStockController : ControllerBase
    {
        private readonly IBlockedStockService _blockedStockService;

        public BlockedStockController(IBlockedStockService blockedStockService)
        {
            _blockedStockService = blockedStockService;
        }

        // Endpoint to get all blocked stock data
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlockedStock>>> GetBlockedStockData()
        {
            try
            {
                var data = await _blockedStockService.GetBlockedStockDataAsync();
                return Ok(data);
            }
            catch (Exception ex)
            {
                // Log exception (not shown here)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving blocked stock data");
            }
        }

        // Endpoint to import data from an Excel file
        // Endpoint to import data from an Excel file
        [HttpPost("import")]
        public async Task<IActionResult> ImportBlockedStockData(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet1 = package.Workbook.Worksheets[0];                                // First sheet for Blocked Stock data
                        var worksheet2 = package.Workbook.Worksheets[1];                               // Second sheet for PnPlant-ComponentOrFG mapping

                        var pnPlantComponentMapping = new Dictionary<string, string>();

                        // Read the second sheet to populate the mapping dictionary
                        var rowCountSheet2 = worksheet2.Dimension?.Rows ?? 0;
                        for (int row = 2; row <= rowCountSheet2; row++)
                        {
                            var pnPlant = worksheet2.Cells[row, 1].Text.Trim();
                            var componentOrFG = worksheet2.Cells[row, 2].Text.Trim();
                            if (!string.IsNullOrEmpty(pnPlant) && !string.IsNullOrEmpty(componentOrFG))
                            {
                                pnPlantComponentMapping[pnPlant] = componentOrFG;
                            }
                        }

                        var rowCount = worksheet1.Dimension?.Rows ?? 0;
                        if (rowCount <= 2)
                        {
                            return BadRequest("No data found in the Excel file.");
                        }

                        var blockedStockDateText = worksheet1.Cells[2, 36].Text.Trim();
                        if (!DateTime.TryParse(blockedStockDateText, out DateTime blockedStockDate))
                        {
                            return BadRequest("Invalid date format in the 36th cell of the second row.");
                        }

                        var blockedStockList = new List<BlockedStock>();

                        for (int row = 2; row <= rowCount; row++)
                        {
                            try
                            {
                                var plant = worksheet1.Cells[row, 1].Text.Trim();
                                var material = worksheet1.Cells[row, 2].Text.Trim();
                                var materialDescription = worksheet1.Cells[row, 3].Text.Trim();
                                var batch = worksheet1.Cells[row, 4].Text.Trim();
                                var blockedQIStockText = worksheet1.Cells[row, 5].Text.Trim();
                                var baseUnitOfMeasure = worksheet1.Cells[row, 6].Text.Trim();
                                var valueText = worksheet1.Cells[row, 7].Text.Trim();
                                var currency = worksheet1.Cells[row, 8].Text.Trim();
                                var createdOnText = worksheet1.Cells[row, 9].Text.Trim();
                                var lastChangeText = worksheet1.Cells[row, 10].Text.Trim();
                                var stockCategory = worksheet1.Cells[row, 11].Text.Trim();
                                var mrpController = worksheet1.Cells[row, 12].Text.Trim();
                                var itemText = worksheet1.Cells[row, 13].Text.Trim();
                                var matDocNumber = worksheet1.Cells[row, 14].Text.Trim();
                                var user = worksheet1.Cells[row, 15].Text.Trim();
                                var procurementType = worksheet1.Cells[row, 16].Text.Trim();
                                var movementType = worksheet1.Cells[row, 17].Text.Trim();
                                var storageLocation = worksheet1.Cells[row, 18].Text.Trim();
                                var storageType = worksheet1.Cells[row, 19].Text.Trim();
                                var storageBin = worksheet1.Cells[row, 20].Text.Trim();
                                var rmaNumber = worksheet1.Cells[row, 21].Text.Trim();
                                var orderReason = worksheet1.Cells[row, 22].Text.Trim();
                                var specialStock = worksheet1.Cells[row, 23].Text.Trim();
                                var custBU = worksheet1.Cells[row, 24].Text.Trim();
                                var prodBU = worksheet1.Cells[row, 25].Text.Trim();
                                var specialStockNumber = worksheet1.Cells[row, 26].Text.Trim();
                                var warehouseNumber = worksheet1.Cells[row, 27].Text.Trim();
                                var profitCenterName = worksheet1.Cells[row, 28].Text.Trim();
                                var profitCenter = worksheet1.Cells[row, 29].Text.Trim();
                                var materialDocYear = worksheet1.Cells[row, 30].Text.Trim();
                                var returnSalesOrder = worksheet1.Cells[row, 31].Text.Trim();
                                var gplCode = worksheet1.Cells[row, 32].Text.Trim();
                                var custProfitCenter = worksheet1.Cells[row, 33].Text.Trim();
                                var globalPortfolioStatus = worksheet1.Cells[row, 34].Text.Trim();
                                var endOfLifeDateText = worksheet1.Cells[row, 35].Text.Trim();

                                if (string.IsNullOrEmpty(plant) ||
                                    string.IsNullOrEmpty(material) ||
                                    string.IsNullOrEmpty(batch) ||
                                    string.IsNullOrEmpty(blockedQIStockText) ||
                                    string.IsNullOrEmpty(baseUnitOfMeasure) ||
                                    string.IsNullOrEmpty(valueText) ||
                                    string.IsNullOrEmpty(createdOnText) ||
                                    string.IsNullOrEmpty(lastChangeText) ||
                                    string.IsNullOrEmpty(mrpController))
                                {
                                    continue;
                                }

                                if (!decimal.TryParse(blockedQIStockText, out decimal blockedQIStock))
                                {
                                    blockedQIStock = 0m;
                                }

                                if (!decimal.TryParse(valueText, out decimal value))
                                {
                                    value = 0m;
                                }

                                if (!DateTime.TryParse(createdOnText, out DateTime createdOn))
                                {
                                    createdOn = DateTime.MinValue;
                                }

                                if (!DateTime.TryParse(lastChangeText, out DateTime lastChange))
                                {
                                    lastChange = DateTime.MinValue;
                                }

                                if (!DateTime.TryParse(endOfLifeDateText, out DateTime endOfLifeDate))
                                {
                                    endOfLifeDate = DateTime.MinValue;
                                }



                                var pnPlant = $"{material}{plant}";
                                var team = GetTeamByMRPController(mrpController);
                                var customID = $"{plant}{pnPlant}{matDocNumber}{blockedQIStock}{storageBin}";



                                var blockedSinceDays = (blockedStockDate - createdOn).Days;
                                var blockedSinceMonths = blockedSinceDays / 30;
                                var blockingPeriodCluster = GetBlockingPeriodCluster(blockedSinceMonths);


                                // Fetch existing data by CustomID
                                var existingBlockedStock = await _blockedStockService.GetBlockedStockByCustomIDAsync(customID);


                                // Fetch the ComponentOrFG value based on pnPlant from the mapping
                                var componentOrFG = pnPlantComponentMapping.ContainsKey(pnPlant)
                                    ? pnPlantComponentMapping[pnPlant]
                                    : "Unknown";


                                var blockedStock = new BlockedStock
                                {
                                    Plant = plant,
                                    Material = material,
                                    MaterialDescription = materialDescription,
                                    Batch = batch,
                                    BlockedQIStock = blockedQIStock,
                                    BaseUnitOfMeasure = baseUnitOfMeasure,
                                    Value = value,
                                    Currency = currency,
                                    CreatedOn = createdOn,
                                    LastChange = lastChange,
                                    StockCategory = stockCategory,
                                    MRPController = mrpController,
                                    ItemText = itemText,
                                    MatDocNumber = matDocNumber,
                                    User = user,
                                    ProcurementType = procurementType,
                                    MovementType = movementType,
                                    StorageLocation = storageLocation,
                                    StorageType = storageType,
                                    StorageBin = storageBin,
                                    RMANumber = rmaNumber,
                                    OrderReason = orderReason,
                                    SpecialStock = specialStock,
                                    CustBU = custBU,
                                    ProdBU = prodBU,
                                    SpecialStockNumber = specialStockNumber,
                                    WarehouseNumber = warehouseNumber,
                                    ProfitCenterName = profitCenterName,
                                    ProfitCenter = profitCenter,
                                    MaterialDocYear = materialDocYear,
                                    ReturnSalesOrder = returnSalesOrder,
                                    GPLCode = gplCode,
                                    CustProfitCenter = custProfitCenter,
                                    GlobalPortfolioStatus = globalPortfolioStatus,
                                    EndOfLifeDate = endOfLifeDate,

                                    PnPlant = pnPlant,
                                    Team = team,
                                    CustomID = customID,
                                    BlockedSinceDays = blockedSinceDays,
                                    BlockedSinceMonths = blockedSinceMonths,
                                    BlockingPeriodCluster = blockingPeriodCluster,
                                    ComponentOrFG = componentOrFG // Add this value to the model
                                };

                                blockedStockList.Add(blockedStock);
                            }
                            catch (Exception ex)
                            {
                                continue;
                            }
                        }

                        await _blockedStockService.ImportBlockedStockDataAsync(blockedStockList);
                    }
                }

                return Ok(new { Success = true, Message = "Blocked stock data imported successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error importing blocked stock data.");
            }
        }
        private static string GetBlockingPeriodCluster(int blockedSinceMonths)
        {
            if (blockedSinceMonths <= 1)
            {
                return "<=1M";
            }
            else if (blockedSinceMonths <= 2)
            {
                return "1M<=blk<=2M";
            }
            else
            {
                return ">=2M";
            }
        }

        private static string GetTeamByMRPController(string mrpController)
        {
            var mrpToTeamMap = new Dictionary<string, string>
            {
                { "X31", "CAS" }, { "MOS", "CAS" }, { "ADG", "CAS" }, { "AEC", "CAS" },
                { "AD5", "CAS" }, { "ADP", "MCA" }, { "ADI", "MCA" }, { "ALB", "MCA" },
                { "AEI", "MCA" }, { "ADW", "CAS" }, { "ADJ", "MCA" }, { "ADF", "MCA" },
                { "MOE", "MCA" }, { "AD6", "CAS" }, { "ASE", "CAS" }, { "ALC", "MCA" },
                { "ADH", "CAS" }, { "AD7", "CAS" }, { "MOO", "CAS" }, { "MCE", "MCA" },
                { "MD1", "MCA" }, { "MOU", "MCA" }, { "MOH", "MCA" }, { "MOR", "CAS" },
                { "MOJ", "CAS" }, { "MCD", "MCA" }, { "MCR", "MCA" }, { "MOK", "CAS" },
                { "MOV", "CAS" }, { "MON", "CAS" }, { "MCB", "MCA" }, { "MOI", "CAS" },
                { "MOL", "CAS" }, { "MCA", "MCA" }, { "MOX", "CAS" }, { "MOW", "CAS" },
                { "MOT", "CAS" }, { "MNO", "Stamping" }, { "MO3", "CAS" }, { "AED", "CAS" },
                { "X33", "MCA" }
            };
            if (mrpToTeamMap.TryGetValue(mrpController, out var team))
            {
                return team;
            }
            return "Unknown"; // Fallback in case the MRP Controller is not in the map
        }
   
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBlockedStockData(Guid id, [FromBody] BlockedStock updatedBlockedStock)
    {
        if (id != updatedBlockedStock.Id)
        {
            return BadRequest("ID mismatch.");
        }

        try
        {
            await _blockedStockService.UpdateBlockedStockAsync(id, updatedBlockedStock);
            return Ok(new { Success = true, Message = "Blocked stock data updated successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Blocked stock data not found.");
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating blocked stock data.");
        }
    }


    [HttpGet("missing-fields-count")]
    public async Task<ActionResult<int>> GetMissingFieldsCount()
    {
        try
        {
            var count = await _blockedStockService.GetMissingFieldsCountAsync();
            return Ok(count);
        }
        catch (Exception ex)
        {
            // Log exception (if necessary)
            return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving missing fields count");
        }
    }


        // Endpoint to delete all blocked stock data
        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAllBlockedStockData()
        {
            try
            {
                await _blockedStockService.DeleteAllBlockedStockDataAsync();
                return Ok("All blocked stock data deleted successfully.");
            }
            catch (Exception ex)
            {
                // Log exception (not shown here)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting blocked stock data");
            }
        }
    }
}
