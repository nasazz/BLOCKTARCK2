using System.Collections.Generic;
using System.Threading.Tasks;
using back.Models;
using back.Dtos;


namespace back.Services
{
    public interface IBlockedStockService
    {
        Task<IEnumerable<BlockedStock>> GetBlockedStockDataAsync();
        Task AddBlockedStockDataAsync(IEnumerable<BlockedStock> blockedStockData);
        Task DeleteAllBlockedStockDataAsync();
        Task AddRangeAsync(List<BlockedStock> blockedStockList);
        Task ImportBlockedStockDataAsync(IEnumerable<BlockedStock> blockedStockData); 
        Task<BlockedStock> GetBlockedStockByCustomIDAsync(string customID);
        Task UpdateBlockedStockAsync(Guid id, BlockedStock updatedBlockedStock); 
        Task<int> GetMissingFieldsCountAsync();
        Task<IEnumerable<MissingFieldsByPlantAndTeam>> GetMissingFieldsCountByPlantAndTeamAsync();


    }
}
