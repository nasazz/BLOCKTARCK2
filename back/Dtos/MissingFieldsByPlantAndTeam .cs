using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back.Dtos
{
    public class MissingFieldsByPlantAndTeam 
    {
        public string Team { get; set; }
        public string Plant { get; set; }
        public int MissingFieldsCount { get; set; }
    }
}