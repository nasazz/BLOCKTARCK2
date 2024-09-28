using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Dtos
{
    public class CreatePnPlantComponentMappingDTO
    {
        public string PnPlant { get; set; } = string.Empty; // Combination of Material + Plant
        public string ComponentOrFG { get; set; } = string.Empty; // Finish Goods, Purchased Component, or Produced Component
    }
}