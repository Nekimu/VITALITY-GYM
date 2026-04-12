import { API } from './js/api.js';
import { CONFIG } from './js/config.js';

// === SESSION VERIFICATION ===
function checkSession() {
    const loggedIn = sessionStorage.getItem('admin_logged_in');
    const adminUser = sessionStorage.getItem('admin_user');

    if (!loggedIn || !adminUser) {
        window.location.href = 'admin-login.html';
        return;
    }

    const sessionTime = sessionStorage.getItem('admin_session_time');
    const now = new Date().getTime();
    const timeElapsed = now - parseInt(sessionTime);
    const thirtyMinutes = 30 * 60 * 1000;

    if (timeElapsed > thirtyMinutes) {
        sessionStorage.clear();
        window.location.href = 'admin-login.html';
        return;
    }

    document.getElementById('admin-username').textContent = adminUser;
}

// === INITIALIZATION ===
window.addEventListener('load', () => {
    checkSession();
    initializeAdmin();
});

// === MOBILE MENU ===
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            sidebar.classList.add('hidden');
        }
    });
});

// === LOGOUT ===
document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'admin-login.html';
});

// === NAVIGATION ===
const navItems = document.querySelectorAll('.nav-item');
const sections = {
    usuarios: document.getElementById('usuarios-section'),
    inscripciones: document.getElementById('inscripciones-section'),
    estadisticas: document.getElementById('estadisticas-section')
};

const sectionTitles = {
    usuarios: { title: 'Usuarios', subtitle: 'Gestión de usuarios del sistema' },
    inscripciones: { title: 'Inscripciones', subtitle: 'Gestión de inscripciones' },
    estadisticas: { title: 'Estadísticas', subtitle: 'Análisis general del sistema' }
};

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        Object.values(sections).forEach(sec => sec?.classList.add('hidden'));
        if (sections[section]) sections[section].classList.remove('hidden');
        document.getElementById('page-title').textContent = sectionTitles[section].title;
        document.getElementById('page-subtitle').textContent = sectionTitles[section].subtitle;

        if (section === 'usuarios') loadUsuarios();
        else if (section === 'inscripciones') loadInscripciones();
        else if (section === 'estadisticas') loadEstadisticas();
    });
});

// === CLOCK ===
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES');
    const ct = document.getElementById('current-time');
    const st = document.getElementById('system-time');
    if (ct) ct.textContent = time;
    if (st) st.textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

// === DASHBOARD STATS ===
async function loadEstadisticas() {
    try {
        const usuarios = await API.usuarios.getAll();
        const inscripciones = await API.inscripciones.getAll();

        document.getElementById('stat-usuarios').textContent = usuarios.length;
        document.getElementById('stat-inscripciones').textContent = inscripciones.length;
        document.getElementById('stat-activos').textContent = usuarios.filter(u => u.estado === 'activo').length;
        document.getElementById('stat-inactivos').textContent = usuarios.filter(u => u.estado === 'inactivo').length;

        const recentDiv = document.getElementById('recent-inscripciones');
        const recent = inscripciones.slice(0, 5);
        recentDiv.innerHTML = recent.map(insc => `
            <div class="flex items-start justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div class="flex-1">
                    <p class="text-white text-sm font-semibold">${insc.nombreUsuario}</p>
                    <p class="text-gray-500 text-xs">${insc.tipoMembresia}</p>
                </div>
                <span class="text-gray-400 text-xs">${new Date(insc.fechaInscripcion).toLocaleDateString('es-ES')}</span>
            </div>
        `).join('');

        document.getElementById('last-update').textContent = new Date().toLocaleTimeString('es-ES');
    } catch (error) {
        console.error('Error loading estadisticas:', error);
        const status = document.getElementById('api-status');
        if (status) status.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span><span class="text-red-400">Error de conexión</span>';
    }
}

// === SEARCH ===
document.getElementById('search-usuarios')?.addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    document.querySelectorAll('#usuarios-table-body tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});

document.getElementById('search-inscripciones')?.addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    document.querySelectorAll('#inscripciones-table-body tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});

// === CRUD HELPERS (ATTACH TO WINDOW FOR ONCLICK) ===
window.cerrarModalUsuario = () => document.getElementById('modal-usuario').classList.remove('active');
window.cerrarModalInscripcion = () => document.getElementById('modal-inscripcion').classList.remove('active');

window.editarUsuario = async (id) => {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${id}`);
        const usuario = await res.json();
        document.getElementById('modal-usuario-title').textContent = 'Editar Usuario';
        document.getElementById('btn-guardar-usuario').textContent = 'Guardar Cambios';
        document.getElementById('usuario-id').value = id;
        document.getElementById('usuario-nombre').value = usuario.nombre || '';
        document.getElementById('usuario-edad').value = usuario.edad || '';
        document.getElementById('usuario-peso').value = usuario.peso || '';
        document.getElementById('usuario-talla').value = usuario.talla || '';
        document.getElementById('usuario-membresia').value = usuario.membresia || '';
        document.getElementById('modal-usuario').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
    }
};

window.eliminarUsuario = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) return;
    try {
        const res = await API.usuarios.delete(id);
        if (res.ok) loadUsuarios();
    } catch (error) {
        console.error('Error:', error);
    }
};

window.guardarUsuario = async (event) => {
    event.preventDefault();
    const id = document.getElementById('usuario-id')?.value;
    const usuario = {
        nombre: document.getElementById('usuario-nombre').value,
        edad: parseInt(document.getElementById('usuario-edad').value),
        peso: parseFloat(document.getElementById('usuario-peso').value),
        talla: parseFloat(document.getElementById('usuario-talla').value),
        membresia: document.getElementById('usuario-membresia').value
    };
    try {
        let res;
        if (id) res = await API.usuarios.update(id, usuario);
        else res = await API.usuarios.create(usuario);
        if (res.ok) {
            window.cerrarModalUsuario();
            loadUsuarios();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

window.editarInscripcion = async (id) => {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/inscripciones/${id}`);
        const insc = await res.json();
        document.getElementById('inscripcion-id').value = id;
        document.getElementById('inscripcion-nombre').value = insc.nombre || '';
        document.getElementById('inscripcion-correo').value = insc.correo || '';
        document.getElementById('inscripcion-telefono').value = insc.telefono || '';
        document.getElementById('inscripcion-planes').value = insc.planes || '';
        document.getElementById('modal-inscripcion').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
    }
};

window.eliminarInscripcion = async (id, nombre) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la inscripción de ${nombre}?`)) return;
    try {
        const res = await API.inscripciones.delete(id);
        if (res.ok) loadInscripciones();
    } catch (error) {
        console.error('Error:', error);
    }
};

window.guardarInscripcion = async (event) => {
    event.preventDefault();
    const id = document.getElementById('inscripcion-id').value;
    const inscripcion = {
        nombre: document.getElementById('inscripcion-nombre').value,
        correo: document.getElementById('inscripcion-correo').value,
        telefono: document.getElementById('inscripcion-telefono').value,
        planes: document.getElementById('inscripcion-planes').value
    };
    try {
        const res = await API.inscripciones.update(id, inscripcion);
        if (res.ok) {
            window.cerrarModalInscripcion();
            loadInscripciones();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

async function loadUsuarios() {
    try {
        const usuarios = await API.usuarios.getAll();
        const tbody = document.getElementById('usuarios-table-body');
        const noData = document.getElementById('no-usuarios');
        if (usuarios.length === 0) {
            tbody.innerHTML = '';
            noData.classList.remove('hidden');
            return;
        }
        noData.classList.add('hidden');
        tbody.innerHTML = usuarios.map(user => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${user.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">${user.nombre}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${user.email || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${user.telefono || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-bold">${user.tipoMembresia || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="badge ${user.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
                        ${user.estado || 'Activo'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onclick="editarUsuario(${user.id})" class="btn-action bg-blue-900 hover:bg-blue-800 text-blue-200">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="eliminarUsuario(${user.id}, '${user.nombre}')" class="btn-action bg-red-900 hover:bg-red-800 text-red-200">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading usuarios:', error);
    }
}

async function loadInscripciones() {
    try {
        const inscripciones = await API.inscripciones.getAll();
        const tbody = document.getElementById('inscripciones-table-body');
        const noData = document.getElementById('no-inscripciones');
        const count = document.getElementById('inscripcion-count');
        if (count) count.textContent = `${inscripciones.length} registros`;
        if (inscripciones.length === 0) {
            tbody.innerHTML = '';
            noData.classList.remove('hidden');
            return;
        }
        noData.classList.add('hidden');
        tbody.innerHTML = inscripciones.map(insc => `
            <tr class="table-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${insc.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">${insc.nombreUsuario}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${insc.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${insc.tipoMembresia}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${new Date(insc.fechaInscripcion).toLocaleDateString('es-ES')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="badge badge-success">Confirmada</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onclick="editarInscripcion(${insc.id})" class="btn-action bg-blue-900 hover:bg-blue-800 text-blue-200">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button onclick="eliminarInscripcion(${insc.id}, '${insc.nombreUsuario}')" class="btn-action bg-red-900 hover:bg-red-800 text-red-200">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading inscripciones:', error);
    }
}

function initializeAdmin() {
    loadUsuarios();
}