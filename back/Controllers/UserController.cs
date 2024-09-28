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
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;

        public UserController(ApplicationDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager, SignInManager<User> signInManager, ITokenService tokenService)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized(new { message = "Email or password is incorrect" });

            var roles = await _userManager.GetRolesAsync(user);                                                               // Get user roles
            var token = _tokenService.GenerateToken(user, roles);                                                             // Generate token with roles if needed

            return Ok(new { Token = token, Role = roles.FirstOrDefault() });                            // Return the token and the first role (assuming single role)
        }

        [HttpPost("register")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            // Fetch the actual names based on the provided IDs
            var plant = await _context.Plants.FindAsync(Guid.Parse(registerDto.Plant));
            var department = await _context.Departments.FindAsync(Guid.Parse(registerDto.Department));
            var team = await _context.Teams.FindAsync(Guid.Parse(registerDto.Team));
            var role = await _roleManager.FindByIdAsync(registerDto.Role); // Assuming role is the ID

            if (plant == null || department == null || team == null || role == null)
            return BadRequest("Invalid references for Plant, Department, Team, or Role.");

            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                Plant = plant.Name, // Store the actual name
                Department = department.Name, // Store the actual name
                Team = team.Name, // Store the actual name
                Role = role.Name // Store the actual name
            };

         var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
          return BadRequest(result.Errors);

        if (!await _roleManager.RoleExistsAsync(role.Name))
            await _roleManager.CreateAsync(new IdentityRole<Guid>(role.Name));

        await _userManager.AddToRoleAsync(user, role.Name);

        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);

        return Ok(new { User = user, Token = token });
        } 
 
        [HttpGet]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserRegisterDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            return NotFound();

         // Fetch the actual names based on the provided IDs
         var plant = await _context.Plants.FindAsync(Guid.Parse(updateDto.Plant));
        var department = await _context.Departments.FindAsync(Guid.Parse(updateDto.Department));
        var team = await _context.Teams.FindAsync(Guid.Parse(updateDto.Team));
        var role = await _roleManager.FindByIdAsync(updateDto.Role);

        if (plant == null || department == null || team == null || role == null)
            return BadRequest("Invalid references for Plant, Department, Team, or Role.");

        user.UserName = updateDto.Email;
        user.Email = updateDto.Email;
        user.FullName = updateDto.FullName;
        user.Plant = plant.Name; // Store the actual name
        user.Department = department.Name; // Store the actual name
        user.Team = team.Name; // Store the actual name
        user.Role = role.Name; // Store the actual name

        // Update the user's role in UserManager
        var currentRoles = await _userManager.GetRolesAsync(user);
        var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeRolesResult.Succeeded)
            return BadRequest(removeRolesResult.Errors);

        var addRoleResult = await _userManager.AddToRoleAsync(user, role.Name);
        if (!addRoleResult.Succeeded)
            return BadRequest(addRoleResult.Errors);

        // Save changes
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Generate a new token with the updated role
        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);

        return Ok(new { User = user, Token = token });
    }
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return NoContent();
        }
    }
}
