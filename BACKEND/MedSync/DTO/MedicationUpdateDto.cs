using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedSync.Backend.DTO
{
    public class MedicationUpdateDto
    {
        public string Name { get; set; }
        public string Dose { get; set; }
        public int FrequencyHours { get; set; }
        public DateTime StartDate { get; set; }
        public int TreatmentDurationDays { get; set; }
    }
}