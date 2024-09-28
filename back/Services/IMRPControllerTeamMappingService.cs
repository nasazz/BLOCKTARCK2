// IMRPControllerTeamMappingService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using back.Models;
using back.Dtos;

namespace back.Services
{
    public interface IMRPControllerTeamMappingService
    {
        Task<List<MRPControllerTeamMapping>> GetAllMappingsAsync();
        Task<string> GetTeamByMRPControllerAsync(string mrpController);
        Task<MRPControllerTeamMapping> GetMappingByControllerAsync(string mrpController);
        Task<MRPControllerTeamMapping> CreateMappingAsync(CreateMRPControllerTeamMappingDTO mappingDTO);
        Task<List<MRPControllerTeamMapping>> CreateMappingsAsync(List<CreateMRPControllerTeamMappingDTO> mappingDTOs);
        Task<MRPControllerTeamMapping> UpdateMappingAsync(Guid id, CreateMRPControllerTeamMappingDTO mappingDto);
        Task<bool> DeleteMappingAsync(Guid id);
    }
}
