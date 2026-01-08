using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Necesario para leer config
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using GymApi.Models;
using GymApi.Services;
using GymApi.Data;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------
// 1. CONFIGURACIÓN DE BASE DE DATOS
// ---------------------------------------------------------
// Prioriza variables de entorno (útil para Azure/Docker), luego appsettings.json
var connectionString = builder.Configuration.GetConnectionString("GymDb") 
                      ?? Environment.GetEnvironmentVariable("ConnectionStrings__GymDb");

builder.Services.AddDbContext<GymDbContext>(options =>
    options.UseSqlServer(connectionString)
);

// ---------------------------------------------------------
// 2. CORRECCIÓN CORS: Agregar https://
// ---------------------------------------------------------
var misOrigenes = "PermitirFrontendAzure";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: misOrigenes, policy =>
    {
        policy.WithOrigins(
                "https://vitality-gym-web-d9gqbabkazf3ekh7.centralus-01.azurewebsites.net" // <--- ¡AHORA SÍ TIENE HTTPS!
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ✅ Registrar servicios
builder.Services.AddScoped<UsuariosService>();
builder.Services.AddScoped<InscripcionesService>();
builder.Services.AddHttpClient<ReCaptchaService>();

// ✅ Controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// app.Urls.Add("http://0.0.0.0:8080"); // REMOVIDO PARA AZURE

// ✅ Swagger (Habilitado también en Prod para que puedas probar)
app.UseSwagger();
app.UseSwaggerUI();

// ✅ Habilitar CORS (Debe ir antes de Auth y Controllers)
app.UseCors(misOrigenes);

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("🚀 C# Backend iniciando en Azure");

app.Run();