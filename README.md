# 🏋️‍♂️ Vitality Gym - Full Stack Application

Este es un proyecto Full Stack para la gestión de un gimnasio. Incluye una landing page rápida para los usuarios interesados y un panel administrativo para la gestión de inscripciones y miembros. El sistema está dividido en un Frontend estático proveído por Express, y un Backend robusto en ASP.NET Core.

## 🚀 Tecnologías

### Backend (C# - ASP.NET Core 8.0)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

### Frontend & Utilities (Node.js)
- Express.js (Servidor Frontend)
- Vanilla JavaScript (ES Modules)
- HTML5, CSS3 (Tailwind CSS)
- Font Awesome
- Integración de reCAPTCHA v2 de Google

## 🛠️ Estructura del Proyecto

El proyecto está organizado de la siguiente manera para un ambiente profesional de producción:

- `CSharp_Backend/`: API REST desarrollada en C# (Lógica de negocio y Bases de datos).
- `src/`: Carpeta base del Frontend y servidor Node.js.
  - `public/`: Archivos públicos y estáticos (HTML, CSS, assets y JS orientados al cliente).
  - `config/`: Archivos de configuración para NodeJS y cadenas de conexión si aplicase.
  - `app.js`: Servidor Express.
- `.env`: Variables de entorno de Node.js (ignorado por Git por seguridad).
- `.env.example`: Plantilla de variables de entorno utilizables.
- `.gitignore`: Configurado para ignorar dependencias y secretos locales.

## 🔧 Instalación y Despliegue

### 1. Configuración de Base de Datos y Secretos

1. Copia o renombra `.env.example` a `.env` en la raíz del proyecto.
2. Completa el archivo `.env` con las credenciales de tu base de datos, contraseñas y claves de reCAPTCHA.
3. Asegurate de configurar tu cadena de conexión usando Variables de Entorno en el backend C#.

### 2. Backend C#

Para compilar y correr la API localmente:
- **Requisitos:** .NET SDK 8.0+ y SQL Server 2019+
- Ubícate dentro de la carpeta `CSharp_Backend` (`cd CSharp_Backend`).
- Restaura las dependencias: `dotnet restore`
- Ejecuta la aplicación: `dotnet run` 

El servidor debería iniciar en los puertos `5000` o `5001`.

### 3. Frontend Node.js

Para servir las vistas interactivas del sistema:
- Mantente en la raíz del proyecto.
- Ejecuta `npm install` para instalar dependencias de Express y Node.
- Levanta el servidor con `npm start` o `node src/app.js`.

