// Функции для страницы "Играть"

function startQuickGame() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт, чтобы начать игру', 'info');
        return;
    }
    
    app.showNotification('Ищем соперника...', 'info');
    // Здесь будет логика поиска игры
}

function startCustomGame() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        return;
    }
    
    // Здесь будет открытие модального окна с настройками игры
    app.showNotification('Настройка игры', 'info');
}

function playWithComputer() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        return;
    }
    
    app.showNotification('Запуск игры с компьютером', 'info');
    // Здесь будет логика игры с компьютером
}

function createTournament() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        return;
    }
    
    window.location.href = '../tournaments/index.html';
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

// Функция входа
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
    }, 1000);
}

// Функция регистрации
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
    
    document.getElementById('registerSuccess').style.display = 'block';
    app.showNotification(`Регистрация успешна! Аккаунт ${username} создан.`, 'success');
    
    setTimeout(() => {
        closeRegisterModal();
        app.checkAuthStatus();
    }, 1000);
}

// Профиль
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

// Инициализация шахматной доски
function initChessBoard() {
    const board = document.getElementById('chessBoard');
    if (!board) return;
    
    const squares = [];
    const pieces = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ];
    
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        const row = Math.floor(i / 8);
        const col = i % 8;
        
        square.className = `chess-square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        square.textContent = pieces[i];
        square.dataset.index = i;
        
        square.addEventListener('click', () => {
            if (pieces[i]) {
                app.showNotification(`Выбрана фигура: ${pieces[i]}`, 'info');
            }
        });
        
        board.appendChild(square);
        squares.push(square);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initChessBoard();
    
    // Обновляем приветствие
    const user = app.getCurrentUser();
    if (user) {
        document.getElementById('welcomeMessage').textContent = `Добро пожаловать, ${user.username}!`;
        document.getElementById('subtitleText').textContent = `Ваш рейтинг: ${user.rating}. Наслаждайтесь игрой!`;
    }
});