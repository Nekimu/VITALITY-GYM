namespace GymApi.Models.DTOs
{
    public class InscripcionDTO
    {
        public int Id { get; set; }
        public string? NombreUsuario { get; set; }
        public string? Email { get; set; }
        public string? TipoMembresia { get; set; }
        public DateTime FechaInscripcion { get; set; }
        public string Estado { get; set; } = "confirmada";
    }
}
