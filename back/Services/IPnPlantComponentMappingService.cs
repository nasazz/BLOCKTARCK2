using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using back.Models;
using back.Dtos;

namespace back.Services
{
    public interface IPnPlantComponentMappingService
    {
        Task<List<PnPlantComponentMapping>> GetAllMappingsAsync();
        Task<string> GetComponentOrFGByPnPlantAsync(string pnPlant);
        Task<PnPlantComponentMapping> GetMappingByPnPlantAsync(string pnPlant);
        
        // Method to create a single mapping
        Task<PnPlantComponentMapping> CreateMappingAsync(CreatePnPlantComponentMappingDTO mappingDto);

        // Method to create multiple mappings (bulk)
        Task<List<PnPlantComponentMapping>> CreateMappingsAsync(List<CreatePnPlantComponentMappingDTO> mappingDTOs);

        Task<PnPlantComponentMapping> UpdateMappingAsync(Guid id, CreatePnPlantComponentMappingDTO mappingDto);
        Task<bool> DeleteMappingAsync(Guid id);
    }
}
