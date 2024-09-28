using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Dtos
{
    public class CreateMRPControllerTeamMappingDTO
    {
        public string MRPController { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
    }
}