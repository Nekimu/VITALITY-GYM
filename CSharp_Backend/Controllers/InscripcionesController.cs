using Microsoft.AspNetCore.Mvc;
using GymApi.Models;
using GymApi.Models.DTOs;
using GymApi.Services;
using Microsoft.Extensions.Logging;

namespace GymApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InscripcionesController : ControllerBase
    {
        private readonly InscripcionesService _service;
        private readonly ReCaptchaService _reCaptchaService;
        private readonly ILogger<InscripcionesController> _logger;

        public InscripcionesController(InscripcionesService service, ReCaptchaService reCaptchaService, ILogger<InscripcionesController> logger)
        {
            _service = service;
            _reCaptchaService = reCaptchaService;
            _logger = logger;
        }

        // ✅ GET: api/inscripciones - Retorna DTOs para el admin panel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InscripcionDTO>>> ObtenerTodas()
        {
            _logger.LogInformation("📥 GET /api/inscripciones");
            var inscripciones = await _service.ObtenerTodasDTO();
            return Ok(inscripciones);
        }

        // ✅ GET: api/inscripciones/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Inscripcion>> ObtenerPorId(int id)
        {
            _logger.LogInformation("📥 GET /api/inscripciones/{Id}", id);
            var inscripcion = await _service.ObtenerPorId(id);
            if (inscripcion == null)
            {
                return NotFound(new { message = "Inscripción no encontrada" });
            }
            return Ok(inscripcion);
        }

        // ✅ POST: api/inscripciones
        [HttpPost]
        public async Task<ActionResult<Inscripcion>> Crear(Inscripcion inscripcion)
        {
            _logger.LogInformation("📥 POST /api/inscripciones - {Nombre}", inscripcion.Nombre);

            // ✅ Verificar reCAPTCHA si existe token
            if (!string.IsNullOrEmpty(inscripcion.CaptchaToken))
            {
                bool esCaptchaValido = await _reCaptchaService.VerifyToken(inscripcion.CaptchaToken);
                if (!esCaptchaValido)
                {
                    _logger.LogWarning("❌ Verificación de reCAPTCHA fallida para {Nombre}", inscripcion.Nombre);
                    return BadRequest(new { message = "Verificación de reCAPTCHA fallida" });
                }
            }

            var inscripcionCreada = await _service.Crear(inscripcion);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = inscripcionCreada.Id }, inscripcionCreada);
        }

        // ✅ PUT: api/inscripciones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, Inscripcion inscripcion)
        {
            _logger.LogInformation("📥 PUT /api/inscripciones/{Id}", id);
            var inscripcionActualizada = await _service.Actualizar(id, inscripcion);
            if (inscripcionActualizada == null)
            {
                return NotFound(new { message = "Inscripción no encontrada" });
            }
            return Ok(inscripcionActualizada);
        }

        // ✅ DELETE: api/inscripciones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            _logger.LogInformation("📥 DELETE /api/inscripciones/{Id}", id);
            var resultado = await _service.Eliminar(id);
            if (!resultado)
            {
                return NotFound(new { message = "Inscripción no encontrada" });
            }
            return Ok(new { message = "Inscripción eliminada correctamente" });
        }
    }
}
