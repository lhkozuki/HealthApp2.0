using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedSync.Backend.DTO
{
    // Essa DTO é de consulta! Insiro os dados que vão aparecer no GET
    public class MedicationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Dose { get; set; }
        public int FrequencyHours { get; set; }
        public DateTime StartDate { get; set; }
        public int TreatmentDurationDays { get; set; }
        public int UserId { get; set; }
    }
}