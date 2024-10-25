using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Dtos
{
    public class UserUpdateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Plant { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}