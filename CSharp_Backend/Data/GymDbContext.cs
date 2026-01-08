using Microsoft.EntityFrameworkCore;
using GymApi.Models;

namespace GymApi.Data
{
    public class GymDbContext : DbContext
    {
        public GymDbContext(DbContextOptions<GymDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✅ Configurar tabla Usuarios
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("USUARIO");
                entity.HasKey(e => e.Id).HasName("PK_USUARIO_ID");
                entity.Property(e => e.Nombre).HasMaxLength(100);
                entity.Property(e => e.Peso).HasPrecision(5, 2);
                entity.Property(e => e.Talla).HasPrecision(5, 2);
                entity.Property(e => e.Membresia).HasMaxLength(50);
            });

            // ✅ Configurar tabla Inscripciones
            modelBuilder.Entity<Inscripcion>(entity =>
            {
                entity.ToTable("Inscripcion");  // ✅ Coincide con nombre real en SQL Server
                entity.HasKey(e => e.Id).HasName("PK_Inscripcion_Id");
                entity.Property(e => e.Nombre).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Correo).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Telefono).HasMaxLength(20);
                entity.Property(e => e.Planes).HasMaxLength(50);
                entity.Property(e => e.FechaRegistro).HasColumnName("FechaRegistro").HasDefaultValueSql("GETDATE()");
            });
        }
    }
}
