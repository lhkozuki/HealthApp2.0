using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedSync.Backend.DTO
{
    public class UserDto
    {
        // Essa DTO é de consulta! Insiro os dados que vão aparecer no GET
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        // Na consulta a um Usuário, mostra quais medicamentos ele faz uso
        //public List<MedicationDto>? Medications { get; set; } = new();
        public List<int>? MedicationIds { get; set; }
    }
}


