using Microsoft.AspNetCore.Mvc;

namespace GymApi.Controllers
{
    [ApiController]
    public class HealthController : ControllerBase
    {
        // ✅ GET: /
        [HttpGet("/")]
        public IActionResult Health()
        {
            return Ok(new { message = "🏋️ C# Backend is running", status = "healthy" });
        }
    }
}
