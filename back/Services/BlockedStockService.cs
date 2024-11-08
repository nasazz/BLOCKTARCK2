using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back.Data;
using back.Models;
using back.Dtos;
using Microsoft.EntityFrameworkCore;

namespace back.Services
{
    public class BlockedStockService : IBlockedStockService
    {
        private readonly ApplicationDbContext _context;

        public BlockedStockService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlockedStock>> GetBlockedStockDataAsync()
        {
            return await _context.BlockedStocks.ToListAsync();
        }

        public async Task AddBlockedStockDataAsync(IEnumerable<BlockedStock> blockedStockData)
        {
            await _context.BlockedStocks.AddRangeAsync(blockedStockData);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAllBlockedStockDataAsync()
        {
            _context.BlockedStocks.RemoveRange(_context.BlockedStocks);
            await _context.SaveChangesAsync();
        }

        public async Task AddRangeAsync(List<BlockedStock> blockedStockList)
        {
            await _context.BlockedStocks.AddRangeAsync(blockedStockList);
            await _context.SaveChangesAsync();
        }

    public async Task ImportBlockedStockDataAsync(IEnumerable<BlockedStock> blockedStockData)
{
    // Get the existing CustomIDs from the database to prevent duplicates
    var existingCustomIDs = await _context.BlockedStocks
                                          .Select(b => b.CustomID)
                                          .ToListAsync();

    // Filter out the items from the input data that already exist in the database
    var newBlockedStockData = blockedStockData
                                .Where(b => !existingCustomIDs.Contains(b.CustomID))
                                .ToList();

    // Add only the new blocked stock data with unique CustomIDs
    if (newBlockedStockData.Any())
    {
        await AddBlockedStockDataAsync(newBlockedStockData);
    }
}
        public async Task<BlockedStock> GetBlockedStockByCustomIDAsync(string customID)
        {
            return await _context.BlockedStocks.FirstOrDefaultAsync(b => b.CustomID == customID);
        }
        public async Task UpdateBlockedStockAsync(Guid id, BlockedStock updatedBlockedStock)
        {
            var existingBlockedStock = await _context.BlockedStocks.FindAsync(id);
            if (existingBlockedStock == null)
            {
                throw new KeyNotFoundException("BlockedStock not found.");
            }

            // Update the existing entity with new values
            _context.Entry(existingBlockedStock).CurrentValues.SetValues(updatedBlockedStock);
            await _context.SaveChangesAsync();

    }
     public async Task<int> GetMissingFieldsCountAsync()
    {
        // Count records where any of the specified fields are missing
        return await _context.BlockedStocks
            .CountAsync(bs => string.IsNullOrEmpty(bs.CodeFunctionBlocking) || 
                              string.IsNullOrEmpty(bs.codeReason) ||
                              string.IsNullOrEmpty(bs.codeExpectedUsageDecision) ||
                              string.IsNullOrEmpty(bs.scrapRequestNo));
    }
   public async Task<IEnumerable<MissingFieldsByPlantAndTeam>> GetMissingFieldsCountByPlantAndTeamAsync()
{
    return await _context.BlockedStocks
        .GroupBy(bs => new { bs.Team, bs.Plant }) // Grouping by both Team and Plant
        .Select(g => new MissingFieldsByPlantAndTeam
        {
            Team = g.Key.Team,
            Plant = g.Key.Plant,
            MissingFieldsCount = g.Count(bs => 
                string.IsNullOrEmpty(bs.CodeFunctionBlocking) || 
                string.IsNullOrEmpty(bs.codeReason) ||
                string.IsNullOrEmpty(bs.codeExpectedUsageDecision) ||
                string.IsNullOrEmpty(bs.scrapRequestNo))
        })
        .ToListAsync();
}

}
}
