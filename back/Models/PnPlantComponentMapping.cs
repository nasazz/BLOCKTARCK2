using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Models
{
    public class PnPlantComponentMapping
    {
        public Guid Id { get; set; } // Unique identifier for the mapping entry
        public string PnPlant { get; set; } = string.Empty; // Combination of Material + Plant
        public string ComponentOrFG { get; set; } = string.Empty;
    }
}