using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace back.Models
{
    public class User : IdentityUser<Guid>
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Plant { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        public string Team { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

    }
}