using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using back.Models;
using back.Data;
using back.Dtos;
using back.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;

        public RoleController(RoleManager<IdentityRole<Guid>> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        //[Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<IdentityRole<Guid>>>> GetRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (string.IsNullOrEmpty(roleName))
                return BadRequest("Role name cannot be empty.");

            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (roleExists)
                return BadRequest("Role already exists.");

            var result = await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
       // [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateRole(Guid id, [FromBody] string newRoleName)
        {
            if (string.IsNullOrEmpty(newRoleName))
                return BadRequest("Role name cannot be empty.");

            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
                return NotFound("Role not found.");

            role.Name = newRoleName;
            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
                return Ok(role);

            return BadRequest(result.Errors);
        }

[HttpDelete("{id}")]
//[Authorize(Roles = "admin")]
public async Task<IActionResult> DeleteRole(Guid id)
{
    var role = await _roleManager.Roles.FirstOrDefaultAsync(r => r.Id == id);
    if (role == null)
        return NotFound("Role not found.");

    var result = await _roleManager.DeleteAsync(role);
    if (result.Succeeded)
        return Ok();

    return BadRequest(result.Errors);
}
    }
}
