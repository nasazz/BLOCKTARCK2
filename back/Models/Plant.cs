using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class Plant
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}