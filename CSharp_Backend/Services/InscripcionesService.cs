using GymApi.Data;
using GymApi.Models;
using GymApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymApi.Services
{
    public class InscripcionesService
    {
        private readonly GymDbContext _context;

        public InscripcionesService(GymDbContext context)
        {
            _context = context;
        }

        // ✅ Obtener todas las inscripciones
        public async Task<List<Inscripcion>> ObtenerTodas()
        {
            return await _context.Inscripciones.OrderByDescending(i => i.FechaRegistro).ToListAsync();
        }

        // ✅ Obtener todas las inscripciones mapeadas a DTO (para el panel admin)
        public async Task<List<InscripcionDTO>> ObtenerTodasDTO()
        {
            var inscripciones = await _context.Inscripciones.OrderByDescending(i => i.FechaRegistro).ToListAsync();
            return inscripciones.Select(i => new InscripcionDTO
            {
                Id = i.Id,
                NombreUsuario = i.Nombre,
                Email = i.Correo,
                TipoMembresia = i.Planes,
                FechaInscripcion = i.FechaRegistro,
                Estado = "confirmada"
            }).ToList();
        }

        // ✅ Obtener inscripción por ID
        public async Task<Inscripcion?> ObtenerPorId(int id)
        {
            return await _context.Inscripciones.FindAsync(id);
        }

        // ✅ Crear inscripción
        public async Task<Inscripcion> Crear(Inscripcion inscripcion)
        {
            // FechaRegistro se asigna automáticamente por la BD (DEFAULT GETDATE())
            // Pero si no se asigna en la BD, C# lo hace
            if (inscripcion.FechaRegistro == default)
            {
                inscripcion.FechaRegistro = DateTime.Now;
            }
            
            _context.Inscripciones.Add(inscripcion);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Inscripción creada: {inscripcion.Nombre} - Plan: {inscripcion.Planes}");
            return inscripcion;
        }

        // ✅ Actualizar inscripción
        public async Task<Inscripcion?> Actualizar(int id, Inscripcion inscripcionActualizada)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);
            if (inscripcion == null) return null;

            inscripcion.Nombre = inscripcionActualizada.Nombre;
            inscripcion.Correo = inscripcionActualizada.Correo;
            inscripcion.Telefono = inscripcionActualizada.Telefono;
            inscripcion.Planes = inscripcionActualizada.Planes;
            // FechaRegistro no se actualiza (es valor de creación)

            await _context.SaveChangesAsync();
            Console.WriteLine($"✏️ Inscripción actualizada: {inscripcion.Nombre}");
            return inscripcion;
        }

        // ✅ Eliminar inscripción
        public async Task<bool> Eliminar(int id)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);
            if (inscripcion == null) return false;

            _context.Inscripciones.Remove(inscripcion);
            await _context.SaveChangesAsync();
            Console.WriteLine($"🗑️ Inscripción eliminada: {inscripcion.Nombre}");
            return true;
        }
    }
}
