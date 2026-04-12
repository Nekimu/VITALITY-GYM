import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ⚠️ NOTA: En Node.js v18+ 'fetch' es nativo, no necesitas importarlo.
// Si importas 'node-fetch' y no está instalado, la app fallará.
// import fetch from 'node-fetch'; 

// ⚠️ COMENTAMOS ESTO PARA EVITAR ERRORES SI LOS ARCHIVOS NO EXISTEN
// Si el backend es C#, Node solo debe servir el HTML.
// import productsRoutes from './src/routes/products.routes.js';
// import usuariosRoutes from './src/routes/usuarios.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Definir __dirname para ES Modules
const __dirname = path.resolve();

// Servir archivos estáticos desde la carpeta 'src/public'
app.use(express.static(path.join(__dirname, 'src', 'public')));

// --- RUTAS DE API (Comentadas porque C# maneja esto en el puerto 5000) ---
/*
console.log('🔌 Cargando rutas de productos...');
app.use('/api', productsRoutes);
console.log('🔌 Cargando rutas de usuarios...');
app.use('/api', usuariosRoutes);
*/
console.log('⚠️ Las inscripciones y usuarios se manejan en el Backend C#');

// --- RUTAS DE VISTAS (HTML) ---

// Página Principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index_GYM.html'));
    console.log('📄 Sirviendo Index_GYM');
});

// Panel Admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'admin-panel.html'));
});

// Páginas de confirmación de pago (Corregido: buscando en 'src/public')
app.get('/pago-exitoso', (req, res) => {
    console.log('✅ GET /pago-exitoso');
    res.sendFile(path.join(__dirname, 'src', 'public', 'pago-exitoso.html'));
});

app.get('/pago-fallido', (req, res) => {
    console.log('❌ GET /pago-fallido');
    res.sendFile(path.join(__dirname, 'src', 'public', 'pago-fallido.html'));
});

app.get('/pago-pendiente', (req, res) => {
    console.log('⏳ GET /pago-pendiente');
    res.sendFile(path.join(__dirname, 'src', 'public', 'pago-pendiente.html'));
});

// --- Endpoint para verificar reCAPTCHA v2 Checkbox ---
app.post('/verify-captcha', async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET;

    console.log('🔐 [Node] Verificando token de reCAPTCHA...');

    if (!token) {
        console.log('❌ Token no recibido');
        return res.status(400).json({ success: false, message: 'Token no proporcionado' });
    }

    try {
        // Usamos fetch nativo
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();
        console.log('📡 Respuesta Google:', data);

        if (data.success) {
            console.log('✅ Captcha válido');
            return res.json({ success: true });
        } else {
            console.log('❌ Captcha inválido:', data['error-codes']);
            return res.status(400).json({ success: false, message: 'Verificación fallida', errors: data['error-codes'] });
        }
    } catch (error) {
        console.error('❌ Error verificando Captcha:', error);
        return res.status(500).json({ success: false, message: 'Error en servidor Node' });
    }
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error no capturado:', err);
    res.status(500).send('<h1>Error 500</h1><p>Algo salió mal en el servidor.</p>');
});

export default app;