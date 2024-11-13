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
            var team = user.Team;
            var plant = user.Plant;

            return Ok(new { Token = token, Role = roles.FirstOrDefault(), Team = team, Plant = plant });
            // Return the token and the first role (assuming single role)
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


[HttpPost("register-by-name")]
public async Task<IActionResult> RegisterByName([FromBody] UserRegisterDto registerDto)
{
    try
    {
        // Fetch the entities by name
        var plant = await _context.Plants.FirstOrDefaultAsync(p => p.Name == registerDto.Plant);
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Name == registerDto.Department);
        var team = await _context.Teams.FirstOrDefaultAsync(t => t.Name == registerDto.Team);
        var role = await _roleManager.FindByNameAsync(registerDto.Role);

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

        // Add the user to the specified role
        await _userManager.AddToRoleAsync(user, role.Name);

        // Generate a token for the registered user
        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateToken(user, roles);

        return Ok(new { User = user, Token = token });
    }
    catch (Exception ex)
    {
        return StatusCode(500, "An error occurred while registering the user.");
    }
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
public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDto userUpdateDto)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null)
        return NotFound();

    // Validate if the Plant, Department, and Team names exist in their respective tables
    var plant = await _context.Plants.FirstOrDefaultAsync(p => p.Name == userUpdateDto.Plant);
    var department = await _context.Departments.FirstOrDefaultAsync(d => d.Name == userUpdateDto.Department);
    var team = await _context.Teams.FirstOrDefaultAsync(t => t.Name == userUpdateDto.Team);

    if (plant == null || department == null || team == null)
        return BadRequest("Invalid references for Plant, Department, or Team.");

    // Update fields with the validated names
    user.FullName = userUpdateDto.FullName;
    user.Plant = plant.Name;
    user.Department = department.Name;
    user.Team = team.Name;
    user.Role = userUpdateDto.Role;

    // Save changes
    _context.Users.Update(user);
    await _context.SaveChangesAsync();

    return Ok(user);
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
