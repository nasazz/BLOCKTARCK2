// PnPlantComponentMappingController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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

        [HttpGet]
        public async Task<IActionResult> GetAllMappings()
        {
            var mappings = await _service.GetAllMappingsAsync();
            return Ok(mappings);
        }

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

        // New method to get ComponentOrFG by PnPlant
        [HttpGet("{pnPlant}/component-or-fg")]
        public async Task<IActionResult> GetComponentOrFGByPnPlant(string pnPlant)
        {
            var componentOrFG = await _service.GetComponentOrFGByPnPlantAsync(pnPlant);
            if (componentOrFG == "Unknown")
            {
                return NotFound("PnPlant not found or ComponentOrFG is unknown.");
            }
            return Ok(new { PnPlant = pnPlant, ComponentOrFG = componentOrFG });
        }

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

        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllMappings()
        {
            var result = await _service.DeleteAllMappingsAsync();
            if (!result)
            {
                return NotFound("No mappings to delete.");
            }
            return NoContent();
        }
    }
}
