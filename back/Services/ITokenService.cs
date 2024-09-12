using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back.Models;

namespace back.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user, IList<string> roles);
    }
}