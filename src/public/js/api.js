import { CONFIG } from './config.js';

export const API = {
    usuarios: {
        getAll: async () => {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios`);
            return await res.json();
        },
        create: async (data) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        },
        update: async (id, data) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        },
        delete: async (id) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${id}`, { method: 'DELETE' });
        }
    },
    inscripciones: {
        getAll: async () => {
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/inscripciones`);
            return await res.json();
        },
        create: async (data) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/inscripciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        },
        update: async (id, data) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/inscripciones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        },
        delete: async (id) => {
            return await fetch(`${CONFIG.API_BASE_URL}/api/inscripciones/${id}`, { method: 'DELETE' });
        }
    }
};
