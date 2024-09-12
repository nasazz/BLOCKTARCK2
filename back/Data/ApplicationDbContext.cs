using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using back.Models;
using Microsoft.AspNetCore.Identity;

namespace back.Data
{
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Plant> Plants { get; set; }
        public DbSet<BlockedStock> BlockedStocks { get; set; }
        public DbSet<Department> Departments { get; set; } 


    }
}
