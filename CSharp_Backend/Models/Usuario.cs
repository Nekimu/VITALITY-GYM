namespace GymApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public int Edad { get; set; }
        public decimal Peso { get; set; }
        public decimal Talla { get; set; }
        public string? Membresia { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}
