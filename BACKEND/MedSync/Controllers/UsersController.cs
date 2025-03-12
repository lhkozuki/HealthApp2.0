using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MedSync.Backend.Context;
using MedSync.Backend.Entities;
using MedSync.Backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace MedSync.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: API/ Lista todos os usuários e seus medicamentos
        [HttpGet]
        public ActionResult<List<UserDto>> GetAllUsers()
        {
            var users = _context.Users
                .Include(u => u.Medications)  // Inclui a tabela intermediária
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    MedicationIds = u.Medications.Select(m => m.Id).ToList() // Mapeia os Id's dos medicamentos
                })
                .ToList();

            return Ok(users);
        }

        // GET: API/ User/ {id} - Retorna um usuário e seus medicamentos pelo Id
        [HttpGet("{id}")]
        public ActionResult<UserDto> GetUserById(int id)
        {
            var user = _context.Users
                .Include(u => u.Medications)  // Inclui a tabela intermediária
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    MedicationIds = u.Medications.Select(m => m.Id).ToList()
                })
                .FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return NotFound("Nenhum usuário cadastrado.");
            }

            return Ok(user);
        }

        // POST: API/ Cadastra um usuário
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserCreateDto userDto)
        {
             var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {   
                return BadRequest("Email já cadastrado.");
            }
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = userDto.Password
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        // PUT: API/ Edita um usuário
        [HttpPut("{id}")]
        public ActionResult UpdateUser(int id, UserUpdateDto userUpdateDto)
        {
            // Busca o usuário no Banco de Dados
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("Usuário não encontrado.");

            // Atualiza os campos do usuário
            user.Name = userUpdateDto.Name ?? user.Name;
            user.Email = userUpdateDto.Email ?? user.Email;
            user.Password = userUpdateDto.Password ?? user.Password;

            // Salva as alterações no Banco de Dados
            _context.Users.Update(user);
            _context.SaveChanges();

            return Ok(user);  // Retorna o usuário atualizado
        }

        // DELETE: API/ Deleta um usuário
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            // Busca o usuário no Banco de Dados
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound("Usuário não encontrado.");

            // Remove o medicamento
            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.Password == loginDto.Password);

            if (user == null)
            {
                return Unauthorized("Email ou senha inválidos.");
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                MedicationIds = user.Medications?.Select(m => m.Id).ToList() ?? new List<int>()
            };

            return Ok(userDto);
        }
    }
}