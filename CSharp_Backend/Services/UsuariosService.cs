using GymApi.Data;
using GymApi.Models;
using GymApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GymApi.Services
{
    public class UsuariosService
    {
        private readonly GymDbContext _context;

        public UsuariosService(GymDbContext context)
        {
            _context = context;
        }

        // ✅ Obtener todos los usuarios
        public async Task<List<Usuario>> ObtenerTodos()
        {
            return await _context.Usuarios.OrderByDescending(u => u.FechaCreacion).ToListAsync();
        }

        // ✅ Obtener todos los usuarios mapeados a DTO (para el panel admin)
        public async Task<List<UsuarioDTO>> ObtenerTodosDTO()
        {
            var usuarios = await _context.Usuarios.OrderByDescending(u => u.FechaCreacion).ToListAsync();
            return usuarios.Select(u => new UsuarioDTO
            {
                Id = u.Id,
                Nombre = u.Nombre,
                Email = u.Nombre, // Usando Nombre como Email provisionalmente
                Telefono = "N/A",  // No hay campo telefono en Usuario
                Estado = "activo"
            }).ToList();
        }

        // ✅ Obtener usuario por ID
        public async Task<Usuario?> ObtenerPorId(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }

        // ✅ Crear usuario
        public async Task<Usuario> Crear(Usuario usuario)
        {
            usuario.FechaCreacion = DateTime.Now;
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Usuario creado: {usuario.Nombre}");
            return usuario;
        }

        // ✅ Actualizar usuario
        public async Task<Usuario?> Actualizar(int id, Usuario usuarioActualizado)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return null;

            usuario.Nombre = usuarioActualizado.Nombre;
            usuario.Edad = usuarioActualizado.Edad;
            usuario.Peso = usuarioActualizado.Peso;
            usuario.Talla = usuarioActualizado.Talla;
            usuario.Membresia = usuarioActualizado.Membresia;

            await _context.SaveChangesAsync();
            Console.WriteLine($"✏️ Usuario actualizado: {usuario.Nombre}");
            return usuario;
        }

        // ✅ Eliminar usuario
        public async Task<bool> Eliminar(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            Console.WriteLine($"🗑️ Usuario eliminado: {usuario.Nombre}");
            return true;
        }
    }
}
