namespace GymApi.Models.DTOs
{
    public class UsuarioDTO
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Email { get; set; }
        public string? Telefono { get; set; }

        public string Estado { get; set; } = "activo";
    }
}
