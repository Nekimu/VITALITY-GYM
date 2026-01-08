# Vitality Gym - Full Stack Application

Este es un proyecto Full Stack para la gestión de un gimnasio, incluyendo una landing page para usuarios y un panel administrativo para la gestión de inscripciones y miembros.

## 🚀 Tecnologías

### Backend (C#)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

### Backend (Node.js)
- Express.js (Servidor de archivos estáticos y utilidades)
- reCAPTCHA v2 Integration

### Frontend
- HTML5, CSS3 (Tailwind CSS)
- Vanilla JavaScript (ES Modules)
- Font Awesome

## 🛠️ Estructura del Proyecto

- `CSharp_Backend/`: API REST desarrollada en C#.
- `src/`: Lógica del frontend y servidor Node.js.
  - `js/`: Módulos de JavaScript (API, UI, Config, Forms).
- `.env`: Variables de entorno del proyecto.

## 🔧 Configuración

1. **Backend C#**: Configura la cadena de conexión en `appsettings.json` o mediante variables de entorno `ConnectionStrings__GymDb`.
2. **Node.js**: Instala dependencias con `npm install` y configura el archivo `.env`.
3. **Frontend**: Los módulos JS se encuentran en `src/js/` para facilitar su mantenimiento.

## 📦 Despliegue en GitHub

Para subir este proyecto a un nuevo repositorio:

```powershell
git init
git add .
git commit -m "Initial commit: Project refactored and modularized"
git remote add origin <URL_DE_TU_REPOSITORIO>
git push -u origin main
```

## 🔒 Seguridad
- Secretos movidos a variables de entorno.
- Modularización de lógica sensible.
- Validación de reCAPTCHA implementada.
