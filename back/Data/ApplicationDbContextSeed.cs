using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using back.Models;

namespace back.Data
{
public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        // Seed Roles
        if (!await roleManager.RoleExistsAsync("admin"))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>("admin"));
        }

        // Seed Admin User
        if (userManager.FindByEmailAsync("admin@example.com").Result == null)
        {
            var adminUser = new User
            {
                UserName = "admin",
                Email = "admin@example.com",
                FullName = "Administrator",
                Plant = "DefaultPlant",
                Department = "DefaultDepartment",
                Team = "DefaultTeam"
            };

            var result = await userManager.CreateAsync(adminUser, "Admin@1234");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "admin");
            }
        }
    }
}

}
