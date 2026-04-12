export const UI = {
    showModal: (title, message) => {
        const modal = document.getElementById('confirmation-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modal) modal.classList.remove('hidden');
    },
    hideModal: () => {
        const modal = document.getElementById('confirmation-modal');
        if (modal) modal.classList.add('hidden');
    },
    validateField: (field, validationFn) => {
        const errorElement = field.nextElementSibling;
        if (validationFn(field.value.trim())) {
            field.classList.remove('border-red-500');
            if (errorElement) errorElement.classList.add('hidden');
            return true;
        } else {
            field.classList.add('border-red-500');
            if (errorElement) errorElement.classList.remove('hidden');
            return false;
        }
    }
};

export const validators = {
    isNotEmpty: value => value !== '',
    isValidEmail: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
};
