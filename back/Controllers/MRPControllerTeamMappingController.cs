// MRPControllerTeamMappingController.cs
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
    public class MRPControllerTeamMappingController : ControllerBase
    {
        private readonly IMRPControllerTeamMappingService _service;

        public MRPControllerTeamMappingController(IMRPControllerTeamMappingService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMappings()
        {
            var mappings = await _service.GetAllMappingsAsync();
            return Ok(mappings);
        }

        [HttpGet("{mrpController}")]
        public async Task<IActionResult> GetMappingByController(string mrpController)
        {
            var mapping = await _service.GetMappingByControllerAsync(mrpController);
            if (mapping == null)
            {
                return NotFound("MRP Controller not found.");
            }
            return Ok(mapping);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMapping([FromBody] CreateMRPControllerTeamMappingDTO mappingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newMapping = await _service.CreateMappingAsync(mappingDTO);

            return CreatedAtAction(nameof(GetMappingByController), new { mrpController = newMapping.MRPController }, newMapping);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> CreateMappings([FromBody] List<CreateMRPControllerTeamMappingDTO> mappingDTOs)
        {
            if (!ModelState.IsValid || mappingDTOs == null || !mappingDTOs.Any())
            {
                return BadRequest(ModelState);
            }

            var createdMappings = await _service.CreateMappingsAsync(mappingDTOs);
            return Ok(createdMappings);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMapping(Guid id, [FromBody] CreateMRPControllerTeamMappingDTO mappingDto)
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
    }
}
