using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MedSync.Backend.Context;
using MedSync.Backend.DTO;
using MedSync.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedSync.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        // Construtor: injeção do contexto do Banco de Dados
        public MedicationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: API/ Lista todos os medicamentos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicationDto>>> GetAllMedications()
        {
            // Retorna todos os medicamentos, incluindo o usuário associado
            var medications = await _context.Medications
                .Include(m => m.User)
                .ToListAsync();

            // Mapeia para DTO
            var medicationDto = medications.Select(medication => new MedicationDto
            {
                Id = medication.Id,
                Name = medication.Name,
                Dose = medication.Dose,
                FrequencyHours = medication.FrequencyHours,
                StartDate = medication.StartDate,
                TreatmentDurationDays = medication.TreatmentDurationDays ?? 0,
                UserId = medication.UserId
            }).ToList();

            return Ok(medicationDto);
        } 

        // GET: API/ Medications/ {id} - Retorna um medicamento pelo Id
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationDto>> GetMedicationById(int id)
        {
            // Busca medicamento específico pelo ID
            var medication = await _context.Medications
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            
            if (medication == null)
            {
                // Retorna o código 404 (Not Found) se o medicamento não for encontrado
                return NotFound("Não há medicamento cadastrado.");
            }

            // Mapeia DTO
            var medicationDto = new MedicationDto
            {
                Id = medication.Id,
                Name = medication.Name,
                Dose = medication.Dose,
                FrequencyHours = medication.FrequencyHours,
                StartDate = medication.StartDate,
                TreatmentDurationDays = medication.TreatmentDurationDays  ?? 0,
                UserId = medication.UserId
            };

            return Ok(medicationDto);
        }

        

        // GET: api/Medications/{userId}/search?name={searchTerm}
        [HttpGet("{userId}/search")]
        public async Task<ActionResult<IEnumerable<MedicationDto>>> GetMedicationsByUserId(int userId, [FromQuery] string? name = null)
        {
            // Busca medicamentos pelo userId, com filtro opcional por nome
            var query = _context.Medications
                .Where(m => m.UserId == userId);

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(m => m.Name.Contains(name));
            }

            var medications = await query
                .Select(m => new MedicationDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Dose = m.Dose,
                    FrequencyHours = m.FrequencyHours,
                    StartDate = m.StartDate,
                    TreatmentDurationDays = m.TreatmentDurationDays.HasValue ? m.TreatmentDurationDays.Value : 0, // Trata nullable
                    UserId = m.UserId
                })
                .ToListAsync();

            return Ok(medications);
        }
    
    
    
 
        // POST: API/ Cadastra um novo medicamento
        [HttpPost]
        public async Task<ActionResult<Medication>> CreatMedication([FromBody]MedicationDto medicationDto)
        {
            // Verifica se o usuário existe
            var user = await _context.Users.FindAsync(medicationDto.UserId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Mapeia a DTO
            var medication = new Medication
            {
                Name = medicationDto.Name,
                Dose = medicationDto.Dose,
                FrequencyHours = medicationDto.FrequencyHours,
                StartDate = medicationDto.StartDate,
                TreatmentDurationDays = medicationDto.TreatmentDurationDays,
                UserId = medicationDto.UserId
            };

            // Adiciona o novo medicamento ao Banco de Dados
            _context.Medications.Add(medication);
            await _context.SaveChangesAsync();

            // Retorna o medicamento (DTO) criado com o código 201 (Created)
            var medicationResponseDto = new MedicationDto
            {
                Id = medication.Id,
                Name = medication.Name,
                Dose = medication.Dose,
                FrequencyHours = medication.FrequencyHours,
                StartDate = medication.StartDate,
                TreatmentDurationDays = medication.TreatmentDurationDays ?? 0,
                UserId = medication.UserId
            };

            return CreatedAtAction(nameof(GetMedicationById), new { id = medicationDto.Id }, medicationDto);
        }

        // PUT: API/ Edita um medicamento
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedication(int id, MedicationUpdateDto medicationUpdateDto)
        {
            // Busca o medicamento no Banco de Dados
            var medication = await _context.Medications.FindAsync(id);
            if (medication == null)
            return NotFound("Medicamento não encontrado.");

            // Atualiza os campos do medicamento
            medication.Name = medicationUpdateDto.Name;
            medication.Dose = medicationUpdateDto.Dose;
            medication.FrequencyHours = medicationUpdateDto.FrequencyHours;    
            medication.TreatmentDurationDays = medicationUpdateDto.TreatmentDurationDays;

            // Salva as alterações no Banco de Dados
            _context.Entry(medication).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(medication);  // Retorna o medicamento atualizado
        }

        // DELETE: API/ Medications 
        [HttpDelete("{id}")]
        public IActionResult DeleteMedication(int id)
        {
            // Busca o medicamento no Banco de Dados
            var medication = _context.Medications.Find(id);
            if (medication == null)
            return NotFound("Medicamento não encontrado.");

            // Remove o medicamento
            _context.Medications.Remove(medication);
            _context.SaveChanges();
            return NoContent();
        }
    }
}