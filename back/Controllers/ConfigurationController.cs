using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.Models;
using back.Services;
using back.Dtos;
using Microsoft.AspNetCore.Authorization;


namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigurationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

    public ConfigurationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Manage Teams

    [HttpGet("teams")]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
    {
        var teams = await _context.Teams.ToListAsync();
        return Ok(teams);
    }

    [HttpPost("teams")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateTeam([FromBody] Team team)
    {
        if (team == null || string.IsNullOrEmpty(team.Name))
            return BadRequest("Invalid team data.");

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        return Ok(team);
    }

    [HttpDelete("teams/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteTeam(Guid id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
            return NotFound();

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("teams/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateTeam(Guid id, [FromBody] UpdateTeamDto updateTeamDto)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
            return NotFound();

        if (string.IsNullOrEmpty(updateTeamDto.Name))
            return BadRequest("Name cannot be empty.");

        team.Name = updateTeamDto.Name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Manage Plants
    [HttpGet("plants")]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<IEnumerable<Plant>>> GetPlants()
    {
    var plants = await _context.Plants.ToListAsync();
    return Ok(plants);
    }

    [HttpPost("plants")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreatePlant([FromBody] Plant plant)
    {
        if (plant == null || string.IsNullOrEmpty(plant.Name))
            return BadRequest("Invalid plant data.");

        _context.Plants.Add(plant);
        await _context.SaveChangesAsync();

        return Ok(plant);
    }

    [HttpDelete("plants/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeletePlant(Guid id)
    {
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null)
            return NotFound();

        _context.Plants.Remove(plant);
        await _context.SaveChangesAsync();

        return NoContent();
    }

   [HttpPut("plants/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdatePlant(Guid id, [FromBody] UpdatePlantDto updatePlantDto)
    {
        var plant = await _context.Plants.FindAsync(id);
        if (plant == null)
            return NotFound();

        if (string.IsNullOrEmpty(updatePlantDto.Name))
            return BadRequest("Name cannot be empty.");

        plant.Name = updatePlantDto.Name;
        await _context.SaveChangesAsync();

        return NoContent();
    }


        // Manage Departments
        [HttpGet("departments")]
        //[Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            return Ok(departments);
        }

        [HttpPost("departments")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            if (department == null || string.IsNullOrEmpty(department.Name))
                return BadRequest("Invalid department data.");

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            return Ok(department);
        }

        [HttpDelete("departments/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("departments/{id}")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] UpdateDepartmentDto updateDepartmentDto)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            if (string.IsNullOrEmpty(updateDepartmentDto.Name))
                return BadRequest("Name cannot be empty.");

            department.Name = updateDepartmentDto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
    }
}