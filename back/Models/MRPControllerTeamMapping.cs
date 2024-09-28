using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class MRPControllerTeamMapping
    {
        public Guid Id { get; set; }
        public string MRPController { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
    }
}