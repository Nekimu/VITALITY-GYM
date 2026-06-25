# 🏋️‍♂️ Vitality Gym — Full Stack Application

Aplicación Full Stack para la gestión de un gimnasio. Incluye una **landing page** para los usuarios interesados y un **panel administrativo** para la gestión de inscripciones y miembros. El sistema está dividido en un **Frontend estático** servido por Express y un **Backend** en ASP.NET Core que expone una API REST.

---

## 📑 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Despliegue](#-instalación-y-despliegue)
- [Variables de Entorno](#-variables-de-entorno)
- [Base de Datos](#-base-de-datos)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Notas de Seguridad](#-notas-de-seguridad)

---

## 🚀 Tecnologías

### Backend (C# — ASP.NET Core 8.0)
- ASP.NET Core Web API
- Entity Framework Core 8
- SQL Server
- Swagger / OpenAPI
- Integración reCAPTCHA v2 (verificación de token en servidor)

### Frontend & Utilidades (Node.js)
- Express.js (servidor de archivos estáticos y vistas)
- JavaScript Vanilla (ES Modules)
- HTML5 + Tailwind CSS (vía CDN)
- Font Awesome
- reCAPTCHA v2 (checkbox) de Google

---

## 🛠️ Estructura del Proyecto

```
VITALITY-GYM/
├── CSharp_Backend/                # API REST en C# (lógica de negocio + base de datos)
│   ├── Controllers/               # Health, Usuarios, Inscripciones
│   ├── Services/                  # UsuariosService, InscripcionesService, ReCaptchaService
│   ├── Models/                    # Entidades y DTOs
│   ├── Data/                      # GymDbContext (EF Core)
│   ├── appsettings.json           # Configuración (placeholders, sin secretos reales)
│   └── Program.cs                 # Punto de entrada de la API
│
├── src/                           # Frontend y servidor Node.js
│   ├── public/                    # Archivos estáticos servidos al cliente
│   │   ├── *.html                 # Landing, login y panel admin
│   │   ├── css/                   # Hojas de estilo
│   │   ├── js/                    # Lógica del cliente (ES Modules)
│   │   └── assets/                # Imágenes
│   ├── config/                    # config.js y connection.js (cadena de conexión Node)
│   ├── controllers/               # Controladores Node (CRUD alternativo)
│   ├── routes/                    # Rutas Express
│   ├── database/                  # Scripts SQL de creación de tablas
│   ├── app.js                     # Configuración del servidor Express
│   └── index.js                   # Arranque del servidor
│
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore                     # Ignora dependencias y secretos locales
└── package.json
```

> **Nota:** la API de datos (usuarios e inscripciones) la maneja el **Backend C#** en el puerto `5000`. El servidor Node de `src/` sirve el frontend y un endpoint auxiliar de verificación de reCAPTCHA.

---

## 📸 Capturas de Pantalla

> Las imágenes se colocan manualmente en la carpeta `docs/screenshots/`. Cada bloque de abajo ya apunta al archivo esperado; basta con guardar la captura con el nombre indicado para que se muestre aquí.

### 🏠 Landing Page
![Landing Page](docs/screenshots/landing.png)

### 💳 Planes y Registro
![Planes y Registro](docs/screenshots/planes-registro.png)

### 🔐 Login de Administrador
![Login Admin](docs/screenshots/admin-login.png)

### 📊 Panel de Administración — Dashboard
![Panel Admin Dashboard](docs/screenshots/admin-dashboard.png)

### 👥 Gestión de Usuarios e Inscripciones
![Gestión de Usuarios](docs/screenshots/admin-usuarios.png)

### 🧩 Swagger / API
![Swagger API](docs/screenshots/swagger.png)

---

## 📋 Requisitos Previos

- **Node.js** 18+ (incluye `fetch` nativo)
- **.NET SDK** 8.0+
- **SQL Server** 2019+ (local o Azure SQL)

---

## 🔧 Instalación y Despliegue

### 1. Clonar el repositorio
```bash
git clone https://github.com/Nekimu/VITALITY-GYM.git
cd VITALITY-GYM
```

### 2. Configurar secretos
1. Copia `.env.example` a `.env` en la raíz del proyecto.
2. Completa las credenciales de base de datos y la clave de reCAPTCHA.
3. Para el backend C#, configura la cadena de conexión y el secreto de reCAPTCHA mediante **variables de entorno** o `appsettings.json` (no subas secretos reales al repositorio).

### 3. Backend C#
```bash
cd CSharp_Backend
dotnet restore
dotnet run
```
La API inicia en `http://localhost:5000` (y `https://localhost:5001`). Swagger queda disponible en `/swagger`.

### 4. Frontend Node.js
```bash
# Desde la raíz del proyecto
npm install
npm start          # node src/index.js
# o, en desarrollo con recarga automática:
npm run dev        # nodemon
```
El servidor de frontend inicia en `http://localhost:3000`.

---

## 🔑 Variables de Entorno

Definidas en `.env` (Node) — ver `.env.example`:

| Variable             | Descripción                                  |
|----------------------|----------------------------------------------|
| `PORT`               | Puerto del servidor Node (por defecto 3000)  |
| `DB_USER`            | Usuario de la base de datos                  |
| `DB_PASSWORD`        | Contraseña de la base de datos               |
| `DB_SERVER`          | Servidor de la base de datos                 |
| `DB_DATABASE`        | Nombre de la base de datos                   |
| `ADMIN_USER`         | Usuario del panel admin                      |
| `ADMIN_PASSWORD`     | Contraseña del panel admin                   |
| `NODE_ENV`           | Entorno (`development` / `production`)       |
| `RECAPTCHA_SECRET`   | Clave secreta de reCAPTCHA v2                |

En el backend C# (`appsettings.json` o variables de entorno):

| Clave                          | Descripción                          |
|--------------------------------|--------------------------------------|
| `ConnectionStrings:GymDb`      | Cadena de conexión a SQL Server      |
| `ReCaptcha:SecretKey`          | Clave secreta de reCAPTCHA v2        |

---

## 🗄️ Base de Datos

Scripts de creación en `src/database/`:

- `CREATE_TABLE_USUARIO.sql` — tabla `Usuario`
- `CREATE_TABLE_INSCRIPCION.sql` — tabla `Inscripcion`

Ejecútalos en tu instancia de SQL Server antes de levantar la API.

---

## 🌐 Endpoints de la API

Servidos por el Backend C# (`http://localhost:5000`):

| Método | Ruta                       | Descripción                         |
|--------|----------------------------|-------------------------------------|
| GET    | `/`                        | Health check de la API              |
| GET    | `/api/usuarios`            | Listar usuarios                     |
| GET    | `/api/usuarios/{id}`       | Obtener usuario por ID              |
| POST   | `/api/usuarios`            | Crear usuario                       |
| PUT    | `/api/usuarios/{id}`       | Actualizar usuario                  |
| DELETE | `/api/usuarios/{id}`       | Eliminar usuario                    |
| GET    | `/api/inscripciones`       | Listar inscripciones                |
| GET    | `/api/inscripciones/{id}`  | Obtener inscripción por ID          |
| POST   | `/api/inscripciones`       | Crear inscripción (valida reCAPTCHA)|
| PUT    | `/api/inscripciones/{id}`  | Actualizar inscripción              |
| DELETE | `/api/inscripciones/{id}`  | Eliminar inscripción                |

---

## 🔒 Notas de Seguridad

- Los archivos `.env`, `appsettings.Development.json` y los secretos locales están en `.gitignore`. **No subas credenciales reales** al repositorio.
- La **clave de sitio** de reCAPTCHA (`data-sitekey` en el HTML) es pública por diseño; la **clave secreta** debe mantenerse solo en el servidor.
- El login del panel administrativo se valida **del lado del servidor** (`POST /api/admin/login`) contra las variables de entorno `ADMIN_USER` / `ADMIN_PASSWORD`. No hay credenciales en el código del cliente.
