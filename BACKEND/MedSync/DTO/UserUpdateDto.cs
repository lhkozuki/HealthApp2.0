using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedSync.Backend.DTO
{
    // Essa DTO é de atualização! Insiro os dados que podem ser atualizados via PUT
    public class UserUpdateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}