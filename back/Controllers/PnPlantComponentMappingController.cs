using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using back.Services;
using back.Models;
using back.Dtos;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PnPlantComponentMappingController : ControllerBase
    {
        private readonly IPnPlantComponentMappingService _service;

        public PnPlantComponentMappingController(IPnPlantComponentMappingService service)
        {
            _service = service;
        }

        // Get all mappings
        [HttpGet]
        public async Task<IActionResult> GetAllMappings()
        {
            var mappings = await _service.GetAllMappingsAsync();
            return Ok(mappings);
        }

        // Get mapping by PnPlant
        [HttpGet("{pnPlant}")]
        public async Task<IActionResult> GetMappingByPnPlant(string pnPlant)
        {
            var mapping = await _service.GetMappingByPnPlantAsync(pnPlant);
            if (mapping == null)
            {
                return NotFound("PnPlant not found.");
            }
            return Ok(mapping);
        }

        // Create single mapping
        [HttpPost]
        public async Task<IActionResult> CreateMapping([FromBody] CreatePnPlantComponentMappingDTO mappingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newMapping = await _service.CreateMappingAsync(mappingDTO);

            return CreatedAtAction(nameof(GetMappingByPnPlant), new { pnPlant = newMapping.PnPlant }, newMapping);
        }

        // Create multiple mappings (bulk)
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateMappings([FromBody] List<CreatePnPlantComponentMappingDTO> mappingDTOs)
        {
            if (!ModelState.IsValid || mappingDTOs == null || !mappingDTOs.Any())
            {
                return BadRequest(ModelState);
            }

            var createdMappings = await _service.CreateMappingsAsync(mappingDTOs);
            return Ok(createdMappings);
        }

        // Update mapping by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMapping(Guid id, [FromBody] CreatePnPlantComponentMappingDTO mappingDto)
        {
            var updatedMapping = await _service.UpdateMappingAsync(id, mappingDto);
            if (updatedMapping == null)
            {
                return NotFound("Mapping not found.");
            }
            return Ok(updatedMapping);
        }

        // Delete mapping by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMapping(Guid id)
        {
            var result = await _service.DeleteMappingAsync(id);
            if (!result)
            {
                return NotFound("Mapping not found.");
            }
            return NoContent();
        }
    }
}
