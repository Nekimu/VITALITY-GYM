import { UI, validators } from './js/ui.js';
import { API } from './js/api.js';
import { FormHandlers } from './js/forms.js';
import { CONFIG } from './js/config.js';

document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Smooth Scrolling & Active Nav Link ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateActiveLink() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') && link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // --- Select Plan from Pricing Table ---
    const planButtons = document.querySelectorAll('.plan-button');
    const planSelect = document.getElementById('plan');
    planButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = button.getAttribute('data-plan');
            if (planSelect) planSelect.value = plan;
            const registroEl = document.getElementById('registro');
            if (registroEl) registroEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Modal Closing ---
    const modalCloseButton = document.getElementById('modal-close-button');
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', UI.hideModal);
    }

    // --- Form Handlers ---
    FormHandlers.initContactForm('contact-form', {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        message: document.getElementById('contact-message'),
    });

    FormHandlers.initRegistrationButton('btn-registrar', {
        elements: {
            errorMsg: document.getElementById('registro-error-message'),
            successMsg: document.getElementById('registro-success-message'),
            errorText: document.getElementById('error-text'),
            form: document.getElementById('registro-form')
        }
    });

    // --- Admin Users (If present) ---
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    if (tablaUsuarios) {
        cargarUsuarios();
    }

    async function cargarUsuarios() {
        try {
            const usuarios = await API.usuarios.getAll();
            if (!tablaUsuarios) return;
            tablaUsuarios.innerHTML = '';
            usuarios.forEach(u => {
                tablaUsuarios.innerHTML += `
                    <tr class="border-b border-gray-700">
                        <td class="px-4 py-2">${u.nombre}</td>
                        <td class="px-4 py-2">${u.edad}</td>
                        <td class="px-4 py-2">${u.peso}</td>
                        <td class="px-4 py-2">${u.talla}</td>
                        <td class="px-4 py-2">${u.membresia}</td>
                        <td class="px-4 py-2">
                            <button class="bg-yellow-500 text-black px-3 py-1 rounded mr-2" onclick="llenarFormularioUsuario(${u.id}, '${u.nombre}', ${u.edad}, ${u.peso}, ${u.talla}, '${u.membresia}')">✏️</button>
                            <button class="bg-red-600 text-white px-3 py-1 rounded" onclick="eliminarUsuario(${u.id})">🗑️</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    }

    // Export helpers to window for legacy onclick handlers if needed
    window.llenarFormularioUsuario = (id, nombre, edad, peso, talla, membresia) => {
        const fields = {
            id: document.getElementById('usuarioId'),
            nombre: document.getElementById('usuario-nombre'),
            edad: document.getElementById('usuario-edad'),
            peso: document.getElementById('usuario-peso'),
            talla: document.getElementById('usuario-talla'),
            membresia: document.getElementById('usuario-membresia'),
        };
        if (fields.id) fields.id.value = id;
        if (fields.nombre) fields.nombre.value = nombre;
        if (fields.edad) fields.edad.value = edad;
        if (fields.peso) fields.peso.value = peso;
        if (fields.talla) fields.talla.value = talla;
        if (fields.membresia) fields.membresia.value = membresia;
        const btn = document.getElementById('btnGuardarUsuario');
        if (btn) btn.textContent = 'Actualizar Usuario';
    };

    window.eliminarUsuario = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            const res = await API.usuarios.delete(id);
            if (res.ok) cargarUsuarios();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
        }
    };
});
