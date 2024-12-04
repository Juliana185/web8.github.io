const openPopup = document.getElementById('open-popup');
const closePopup = document.getElementById('close-popup');
const popup = document.getElementById('popup');
const form = document.getElementById('feedback-form');
const responseMessage = document.getElementById('response-message');

// Открытие попапа
if (openPopup) {
    openPopup.addEventListener('click', () => {
        popup.style.display = 'flex';
        history.pushState({ popupOpen: true }, '', '?popup=true');
        loadFormData();
    });
}

// Закрытие попапа
if (closePopup) {
    closePopup.addEventListener('click', () => {
        closePopupForm();
    });
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.popupOpen) {
        closePopupForm();
    }
});

function closePopupForm() {
    popup.style.display = 'none';
    history.pushState(null, '', window.location.pathname);
    clearForm();
}

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('https://formcarry.com/s/xS5W407N85p', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' // Добавлено для корректной отправки JSON
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                responseMessage.textContent = 'Форма успешно отправлена!';
                clearForm();
                saveFormData(data); // Возможно, стоит убрать это, если форма успешно отправлена
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            responseMessage.textContent = error.message;
        }
    });
}

function saveFormData(data) {
    localStorage.setItem('formData', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('formData');
        if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('fullname').value = data.fullname || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('organization').value = data.organization || '';
        document.getElementById('message').value = data.message || '';
    }
}

function clearForm() {
    form.reset();
    responseMessage.textContent = '';
}
