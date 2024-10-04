using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.Models;
using back.Dtos;

namespace back.Services
{
    public class PnPlantComponentMappingService : IPnPlantComponentMappingService
    {
        private readonly ApplicationDbContext _context;

        public PnPlantComponentMappingService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all mappings
        public async Task<List<PnPlantComponentMapping>> GetAllMappingsAsync()
        {
            return await _context.PnPlantComponentMappings.ToListAsync();
        }

        // Get component or FG by PnPlant
        public async Task<string> GetComponentOrFGByPnPlantAsync(string pnPlant)
        {
            var mapping = await _context.PnPlantComponentMappings
                .FirstOrDefaultAsync(m => m.PnPlant == pnPlant);

            return mapping?.ComponentOrFG ?? "Unknown"; // Return the ComponentOrFG or "Unknown" if not found
        }

        // Get mapping by PnPlant
        public async Task<PnPlantComponentMapping> GetMappingByPnPlantAsync(string pnPlant)
        {
            return await _context.PnPlantComponentMappings
                .FirstOrDefaultAsync(m => m.PnPlant == pnPlant);
        }

        // Create a single mapping
        public async Task<PnPlantComponentMapping> CreateMappingAsync(CreatePnPlantComponentMappingDTO mappingDto)
        {
            var newMapping = new PnPlantComponentMapping
            {
                Id = Guid.NewGuid(),
                PnPlant = mappingDto.PnPlant,
                ComponentOrFG = mappingDto.ComponentOrFG
            };

            _context.PnPlantComponentMappings.Add(newMapping);
            await _context.SaveChangesAsync();

            return newMapping;
        }

        // Create multiple mappings (bulk)
        public async Task<List<PnPlantComponentMapping>> CreateMappingsAsync(List<CreatePnPlantComponentMappingDTO> mappingDTOs)
        {
            var mappings = mappingDTOs.Select(dto => new PnPlantComponentMapping
            {
                Id = Guid.NewGuid(),
                PnPlant = dto.PnPlant,
                ComponentOrFG = dto.ComponentOrFG
            }).ToList();

            try
            {
                await _context.PnPlantComponentMappings.AddRangeAsync(mappings);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error details for debugging
                Console.WriteLine($"Bulk insert error: {ex.Message}");
                throw; // Consider handling or rethrowing
            }

            return mappings;
        }


        // Update mapping by Id
        public async Task<PnPlantComponentMapping> UpdateMappingAsync(Guid id, CreatePnPlantComponentMappingDTO mappingDto)
        {
            var existingMapping = await _context.PnPlantComponentMappings.FindAsync(id);
            if (existingMapping == null)
            {
                return null;
            }

            existingMapping.PnPlant = mappingDto.PnPlant;
            existingMapping.ComponentOrFG = mappingDto.ComponentOrFG;

            await _context.SaveChangesAsync();
            return existingMapping;
        }

        // Delete mapping by Id
        public async Task<bool> DeleteMappingAsync(Guid id)
        {
            var mapping = await _context.PnPlantComponentMappings.FindAsync(id);
            if (mapping == null)
            {
                return false;
            }

            _context.PnPlantComponentMappings.Remove(mapping);
            await _context.SaveChangesAsync();
            return true;
        }
        // Delete all mappings
        public async Task<bool> DeleteAllMappingsAsync()
        {
            var allMappings = await _context.PnPlantComponentMappings.ToListAsync();

            if (allMappings == null || !allMappings.Any())
            {
                return false; // No mappings to delete
            }

            _context.PnPlantComponentMappings.RemoveRange(allMappings);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
