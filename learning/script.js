// JS для страницы "Обучение"

// Прогресс обучения пользователя
function getLearningProgress() {
    const user = app.getCurrentUser();
    if (!user) return null;
    
    const progress = JSON.parse(localStorage.getItem(`chessclub_learning_${user.id}`)) || {
        basics: 0,
        tactics: 0,
        openings: 0,
        endgame: 0,
        strategy: 0,
        puzzles: 0
    };
    
    return progress;
}

function saveLearningProgress(progress) {
    const user = app.getCurrentUser();
    if (!user) return;
    
    localStorage.setItem(`chessclub_learning_${user.id}`, JSON.stringify(progress));
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateProgressBars();
    
    // Обновляем приветствие
    const user = app.getCurrentUser();
    if (user) {
        document.querySelector('.welcome-message').textContent = `Обучение шахматам`;
        document.querySelector('.subtitle').textContent = 'Развивайте свои навыки!';
    }
});

function updateProgressBars() {
    const progress = getLearningProgress();
    
    if (progress) {
        // Основы
        document.getElementById('basicsProgress').style.width = `${progress.basics}%`;
        document.getElementById('basicsPercent').textContent = `${progress.basics}%`;
        
        // Тактика
        document.getElementById('tacticsProgress').style.width = `${progress.tactics}%`;
        document.getElementById('tacticsPercent').textContent = `${progress.tactics}%`;
        
        // Дебюты
        document.getElementById('openingsProgress').style.width = `${progress.openings}%`;
        document.getElementById('openingsPercent').textContent = `${progress.openings}%`;
    }
}

function startLesson(lessonType) {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт для обучения', 'info');
        return;
    }
    
    const lessonNames = {
        'basics': 'Основы шахмат',
        'tactics': 'Тактика',
        'openings': 'Дебюты',
        'endgame': 'Эндшпиль',
        'strategy': 'Стратегия',
        'puzzles': 'Задачи'
    };
    
    const lessonName = lessonNames[lessonType] || 'Урок';
    
    // Получаем текущий прогресс
    const progress = getLearningProgress();
    if (!progress) return;
    
    // Увеличиваем прогресс (в реальном приложении здесь была бы логика урока)
    if (progress[lessonType] < 100) {
        progress[lessonType] = Math.min(progress[lessonType] + 10, 100);
        saveLearningProgress(progress);
        updateProgressBars();
        
        app.showNotification(`Урок "${lessonName}" пройден! Прогресс: ${progress[lessonType]}%`, 'success');
    } else {
        app.showNotification(`Вы уже полностью прошли урок "${lessonName}"!`, 'info');
    }
}

// Модальные окна
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    hideAllErrors();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
    hideAllErrors();
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPasswordConfirm').value = '';
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(openRegisterModal, 300);
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(openLoginModal, 300);
}

function hideAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.success-message').forEach(el => {
        el.style.display = 'none';
    });
}

function login() {
    hideAllErrors();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username) {
        document.getElementById('loginUsernameError').style.display = 'block';
        return;
    }
    
    if (!password) {
        document.getElementById('loginPasswordError').style.display = 'block';
        return;
    }
    
    const user = app.findUser(username);
    
    if (!user) {
        document.getElementById('loginError').style.display = 'block';
        app.showNotification('Пользователь не найден', 'error');
        return;
    }
    
    const hashedPassword = app.hashPassword(password);
    if (hashedPassword !== user.password) {
        document.getElementById('loginError').style.display = 'block';
        app.showNotification('Неверный пароль', 'error');
        return;
    }
    
    document.getElementById('loginSuccess').style.display = 'block';
    app.setCurrentUser(user);
    app.showNotification(`Вход успешен! Добро пожаловать, ${user.username}!`, 'success');
    
    setTimeout(() => {
        closeLoginModal();
        app.checkAuthStatus();
        updateProgressBars();
    }, 1000);
}

function register() {
    hideAllErrors();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (username.length < 3 || username.length > 20) {
        document.getElementById('registerUsernameError').style.display = 'block';
        return;
    }
    
    if (!app.validateEmail(email)) {
        document.getElementById('registerEmailError').style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('registerPasswordError').style.display = 'block';
        return;
    }
    
    if (password !== passwordConfirm) {
        document.getElementById('registerPasswordConfirmError').style.display = 'block';
        return;
    }
    
    const existingUser = app.findUser(username) || app.findUser(email);
    if (existingUser) {
        app.showNotification('Пользователь с таким логином или email уже существует', 'error');
        return;
    }
    
    const hashedPassword = app.hashPassword(password);
    const user = {
        id: Date.now(),
        username: username,
        email: email,
        password: hashedPassword,
        rating: 1200,
        createdAt: new Date().toISOString()
    };
    
    app.saveUser(user);
    app.setCurrentUser(user);
    app.saveBalance(user.id, 1250);
    
    // Инициализируем прогресс обучения
    const initialProgress = {
        basics: 0,
        tactics: 0,
        openings: 0,
        endgame: 0,
        strategy: 0,
        puzzles: 0
    };
    saveLearningProgress(initialProgress);
    
    document.getElementById('registerSuccess').style.display = 'block';
    app.showNotification(`Регистрация успешна! Аккаунт ${username} создан.`, 'success');
    
    setTimeout(() => {
        closeRegisterModal();
        app.checkAuthStatus();
        updateProgressBars();
    }, 1000);
}

// Функции профиля
function closeProfileMenu() {
    document.getElementById('profileDropdownContent').classList.remove('show');
    document.getElementById('profileCurrentPassword').value = '';
    document.getElementById('profileNewPassword').value = '';
    document.getElementById('profileConfirmPassword').value = '';
}

function saveProfile() {
    const user = app.getCurrentUser();
    if (!user) return;
    
    const newUsername = document.getElementById('profileUsername').value.trim();
    const newEmail = document.getElementById('profileEmailInput').value.trim();
    const currentPassword = document.getElementById('profileCurrentPassword').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmPassword = document.getElementById('profileConfirmPassword').value;
    
    const hashedCurrentPassword = app.hashPassword(currentPassword);
    if (hashedCurrentPassword !== user.password) {
        app.showNotification('Неверный текущий пароль', 'error');
        return;
    }
    
    if (newPassword) {
        if (newPassword.length < 6) {
            app.showNotification('Новый пароль должен содержать минимум 6 символов', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            app.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        user.password = app.hashPassword(newPassword);
    }
    
    if (newUsername && newUsername !== user.username) {
        const existingUser = app.findUser(newUsername);
        if (existingUser && existingUser.id !== user.id) {
            app.showNotification('Пользователь с таким логином уже существует', 'error');
            return;
        }
        user.username = newUsername;
    }
    
    if (newEmail && newEmail !== user.email) {
        if (!app.validateEmail(newEmail)) {
            app.showNotification('Введите корректный email', 'error');
            return;
        }
        
        const existingUser = app.findUser(newEmail);
        if (existingUser && existingUser.id !== user.id) {
            app.showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }
        user.email = newEmail;
    }
    
    app.saveUser(user);
    app.setCurrentUser(user);
    app.checkAuthStatus();
    
    closeProfileMenu();
    app.showNotification('Профиль успешно обновлен!', 'success');
}

function logout() {
    app.logout();
    closeProfileMenu();
}

function changeAvatar() {
    document.getElementById('avatarUpload').click();
}

document.getElementById('avatarUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        app.showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const avatarData = e.target.result;
        const user = app.getCurrentUser();
        
        if (user) {
            app.saveAvatar(user.id, avatarData);
            app.checkAuthStatus();
            app.showNotification('Аватар успешно обновлен!', 'success');
        }
    };
    reader.readAsDataURL(file);
});

// Функции для настроек
function changeLanguage() { app.changeLanguage(); }
function changeTheme() { app.changeTheme(); }
function changeVolume() { app.changeVolume(); }