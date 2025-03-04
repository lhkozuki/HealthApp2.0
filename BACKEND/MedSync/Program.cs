using MedSync.Backend.Entities;
using MedSync.Backend.Context;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Configurar as URLs (http://localhost:5153)
builder.WebHost.UseUrls("http://localhost:5153");

// Adiciona serviços ao contêiner
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração de conexão com o banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuração de CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()    // Permite qualquer origem
               .AllowAnyMethod()    // Permite qualquer método HTTP (GET, POST, etc.)
               .AllowAnyHeader();   // Permite qualquer cabeçalho
    });
});

var app = builder.Build();

// Habilita o roteamento
app.UseRouting();

// Habilita a autorização
app.UseCors("AllowAll"); 

// Configurações padrão do aplicativo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();   // Redireciona para HTTPS

app.MapControllers();        // Mapeia os controladores

app.Run();                   // Executa a aplicação