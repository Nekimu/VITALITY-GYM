using Microsoft.AspNetCore.Mvc;
using GymApi.Models;
using GymApi.Models.DTOs;
using GymApi.Services;
using Microsoft.Extensions.Logging;

namespace GymApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuariosService _service;
        private readonly ILogger<UsuariosController> _logger;

        public UsuariosController(UsuariosService service, ILogger<UsuariosController> logger)
        {
            _service = service;
            _logger = logger;
        }

        // ✅ GET: api/usuarios - Retorna DTOs para el admin panel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> ObtenerTodos()
        {
            _logger.LogInformation("📥 GET /api/usuarios");
            var usuarios = await _service.ObtenerTodosDTO();
            return Ok(usuarios);
        }

        // ✅ GET: api/usuarios/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> ObtenerPorId(int id)
        {
            _logger.LogInformation("📥 GET /api/usuarios/{Id}", id);
            var usuario = await _service.ObtenerPorId(id);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
            return Ok(usuario);
        }

        // ✅ POST: api/usuarios
        [HttpPost]
        public async Task<ActionResult<Usuario>> Crear(Usuario usuario)
        {
            _logger.LogInformation("📥 POST /api/usuarios - {Nombre}", usuario.Nombre);

            var usuarioCreado = await _service.Crear(usuario);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = usuarioCreado.Id }, usuarioCreado);
        }

        // ✅ PUT: api/usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, Usuario usuario)
        {
            _logger.LogInformation("📥 PUT /api/usuarios/{Id}", id);
            var usuarioActualizado = await _service.Actualizar(id, usuario);
            if (usuarioActualizado == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
            return Ok(usuarioActualizado);
        }

        // ✅ DELETE: api/usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            _logger.LogInformation("📥 DELETE /api/usuarios/{Id}", id);
            var resultado = await _service.Eliminar(id);
            if (!resultado)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }
            return Ok(new { message = "Usuario eliminado correctamente" });
        }
    }
}
