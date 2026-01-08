namespace GymApi.Models
{
    public class Inscripcion
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public string? Planes { get; set; }
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        
        // ⚠️ Campos que NO se guardan en BD (ignorados por EF Core)
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public string? CaptchaToken { get; set; }
    }
}

