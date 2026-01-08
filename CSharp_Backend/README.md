# 🚀 Backend C# - ASP.NET Core 8.0

## 📋 Estructura

```
CSharp_Backend/
├── GymApi.csproj              ← Proyecto .NET
├── Program.cs                 ← Startup y configuración
├── appsettings.json           ← Configuración SQL Server
├── appsettings.Development.json
├── Properties/
│   └── launchSettings.json   ← Puertos (5000/5001)
├── Controllers/               ← Endpoints REST
│   ├── UsuariosController.cs
│   ├── InscripcionesController.cs
│   └── VerifyCaptchaController.cs
├── Services/                  ← Lógica de negocio
│   ├── UsuariosService.cs
│   ├── InscripcionesService.cs
│   └── ReCaptchaService.cs
├── Models/                    ← Entidades
│   ├── Usuario.cs
│   └── Inscripcion.cs
└── Data/                      ← Entity Framework
    └── GymDbContext.cs
```

## 🔧 Instalación

### 1. Requisitos
- .NET SDK 8.0+
- SQL Server 2019+
- Base de datos TESTDB con usuario sa/1234

### 2. Restaurar dependencias
```bash
cd CSharp_Backend
dotnet restore
```

### 3. Compilar
```bash
dotnet build
```

### 4. Ejecutar
```bash
dotnet run
```

**Resultado:**
```
info: Microsoft.Hosting.Lifetime
      Now listening on: https://localhost:5001
      Now listening on: http://localhost:5000
```

## 🔌 API Endpoints

### Usuarios
```
GET    https://localhost:5001/api/usuarios
GET    https://localhost:5001/api/usuarios/{id}
POST   https://localhost:5001/api/usuarios
PUT    https://localhost:5001/api/usuarios/{id}
DELETE https://localhost:5001/api/usuarios/{id}
```

### Inscripciones
```
GET    https://localhost:5001/api/inscripciones
GET    https://localhost:5001/api/inscripciones/{id}
POST   https://localhost:5001/api/inscripciones
PUT    https://localhost:5001/api/inscripciones/{id}
DELETE https://localhost:5001/api/inscripciones/{id}
```

### reCAPTCHA
```
POST   https://localhost:5001/verify-captcha
```

## 📚 Swagger
```
https://localhost:5001/swagger
```

## 🗄️ Base de Datos

### Conexión
```
Server: localhost
Database: TESTDB
User: sa
Password: 1234
Encrypt: false
```

### Tablas
- USUARIO (Usuario.cs)
- INSCRIPCION (Inscripcion.cs)

## 🛠️ Desarrollo

### Hot reload
```bash
dotnet watch run
```

### Publicar
```bash
dotnet publish -c Release -o ./publish
```

## 🐛 Troubleshooting

### Error: "Cannot find appsettings.json"
→ Asegúrate de estar en la carpeta CSharp_Backend/

### Error: "Connection to SQL Server failed"
→ Verifica credenciales en appsettings.json

### Puerto 5001 en uso
→ `dotnet run --urls="https://localhost:5002"`

## 📖 Documentación

Ver en carpeta raíz:
- GUIA_ARQUITECTURA_HIBRIDA.md
- COMANDOS_UTILES.md
