// MRPControllerTeamMappingService.cs
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
    public class MRPControllerTeamMappingService : IMRPControllerTeamMappingService
    {
        private readonly ApplicationDbContext _context;

        public MRPControllerTeamMappingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MRPControllerTeamMapping>> GetAllMappingsAsync()
        {
            return await _context.MRPControllerTeamMappings.ToListAsync();
        }

        public async Task<string> GetTeamByMRPControllerAsync(string mrpController)
        {
            var mapping = await _context.MRPControllerTeamMappings
                .FirstOrDefaultAsync(m => m.MRPController == mrpController);

            return mapping?.Team ?? "Unknown"; // Return the team or "Unknown" if not found
        }

        public async Task<MRPControllerTeamMapping> GetMappingByControllerAsync(string mrpController)
        {
            return await _context.MRPControllerTeamMappings
                .FirstOrDefaultAsync(m => m.MRPController == mrpController);
        }

        public async Task<MRPControllerTeamMapping> CreateMappingAsync(CreateMRPControllerTeamMappingDTO mappingDTO)
        {
            var newMapping = new MRPControllerTeamMapping
            {
                Id = Guid.NewGuid(),
                MRPController = mappingDTO.MRPController,
                Team = mappingDTO.Team
            };

            _context.MRPControllerTeamMappings.Add(newMapping);
            await _context.SaveChangesAsync();

            return newMapping;
        }

        public async Task<List<MRPControllerTeamMapping>> CreateMappingsAsync(List<CreateMRPControllerTeamMappingDTO> mappingDTOs)
        {
            var mappings = mappingDTOs.Select(dto => new MRPControllerTeamMapping
            {
                Id = Guid.NewGuid(),
                MRPController = dto.MRPController,
                Team = dto.Team
            }).ToList();

            _context.MRPControllerTeamMappings.AddRange(mappings);
            await _context.SaveChangesAsync();

            return mappings;
        }

        public async Task<MRPControllerTeamMapping> UpdateMappingAsync(Guid id, CreateMRPControllerTeamMappingDTO mappingDto)
        {
            var existingMapping = await _context.MRPControllerTeamMappings.FindAsync(id);
            if (existingMapping == null)
            {
                return null;
            }

            existingMapping.MRPController = mappingDto.MRPController;
            existingMapping.Team = mappingDto.Team;

            await _context.SaveChangesAsync();
            return existingMapping;
        }

        public async Task<bool> DeleteMappingAsync(Guid id)
        {
            var mapping = await _context.MRPControllerTeamMappings.FindAsync(id);
            if (mapping == null)
            {
                return false;
            }

            _context.MRPControllerTeamMappings.Remove(mapping);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
