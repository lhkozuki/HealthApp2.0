using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MedSync.Backend.Entities
{
    public class Medication
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Dose { get; set; }
        public int FrequencyHours { get; set; } // Periodicidade em horas
        public DateTime StartDate { get; set; }
        public int? TreatmentDurationDays { get; set; } // Nulo se o tratamento for por tempo indeterminado

        // Relacionamento: Medicamento pertence a um Usuário
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        
    }
}