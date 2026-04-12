import { UI, validators } from './ui.js';
import { API } from './api.js';

export const FormHandlers = {
    initContactForm: (formId, fields) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const isNameValid = UI.validateField(fields.name, validators.isNotEmpty);
            const isEmailValid = UI.validateField(fields.email, validators.isValidEmail);
            const isMessageValid = UI.validateField(fields.message, validators.isNotEmpty);

            if (isNameValid && isEmailValid && isMessageValid) {
                UI.showModal('¡Mensaje Enviado!', 'Gracias por contactarnos. Te responderemos a la brevedad.');
                form.reset();
            }
        });
    },

    initRegistrationButton: (btnId, config) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const { errorMsg, successMsg, errorText, form } = config.elements;

            errorMsg?.classList.add('hidden');
            successMsg?.classList.add('hidden');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';

            try {
                const nombre = document.getElementById('nombre')?.value?.trim();
                const email = document.getElementById('email')?.value?.trim();
                const telefono = document.getElementById('telefono')?.value?.trim();
                const plan = document.getElementById('plan')?.value;

                if (!nombre || !email || !telefono) {
                    showError('Por favor completa los campos obligatorios');
                    return;
                }

                if (!validators.isValidEmail(email)) {
                    showError('El email no es válido');
                    return;
                }

                let captchaToken = null;
                if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse) {
                    captchaToken = grecaptcha.getResponse();
                    if (!captchaToken) {
                        showError('Por favor verifica el reCAPTCHA');
                        return;
                    }
                }

                const data = { Nombre: nombre, Correo: email, Telefono: telefono, Planes: plan || 'basico' };
                if (captchaToken) data.CaptchaToken = captchaToken;

                const response = await API.inscripciones.create(data);

                if (response.ok) {
                    successMsg?.classList.remove('hidden');
                    form?.reset();
                    if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) grecaptcha.reset();
                    successMsg?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    showError(errorData.message || `Error ${response.status}`);
                }
            } catch (error) {
                showError('Error de conexión. Intenta más tarde.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-user-check mr-2"></i>Registrarse';
            }

            function showError(msg) {
                if (errorText) errorText.textContent = msg;
                errorMsg?.classList.remove('hidden');
                errorMsg?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
};
