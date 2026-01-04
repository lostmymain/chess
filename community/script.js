// JS для страницы "Сообщество" - РЕАЛЬНОЕ ВРЕМЯ

// Данные для рейтинга (из реальных пользователей)
function getRealPlayers() {
    const users = JSON.parse(localStorage.getItem('chessclub_users')) || [];
    return users.map(user => ({
        id: user.id,
        name: user.username,
        rating: user.rating || 1200,
        games: 0,
        online: false
    }));
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadRatingTable();
    loadFriendsList();
    
    // Обновляем приветствие
    const user = app.getCurrentUser();
    if (user) {
        const players = getRealPlayers();
        const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
        const place = sortedPlayers.findIndex(p => p.id === user.id) + 1;
        
        document.querySelector('.welcome-message').textContent = `Сообщество ChessClub`;
        document.querySelector('.subtitle').textContent = place ? 
            `Ваше место в рейтинге: ${place}` : 
            'Присоединяйтесь к обсуждениям!';
    } else {
        document.querySelector('.welcome-message').textContent = `Сообщество ChessClub`;
        document.querySelector('.subtitle').textContent = 'Присоединяйтесь к обсуждениям!';
    }
});

function loadRatingTable() {
    const ratingList = document.getElementById('ratingList');
    if (!ratingList) return;
    
    ratingList.innerHTML = '';
    
    // Получаем реальных пользователей
    const players = getRealPlayers();
    
    if (players.length === 0) {
        ratingList.innerHTML = `
            <div class="empty-state" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>Пока нет зарегистрированных игроков</p>
                <p>Будьте первым!</p>
            </div>
        `;
        return;
    }
    
    // Сортируем по рейтингу
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    const currentUser = app.getCurrentUser();
    
    sortedPlayers.forEach((player, index) => {
        const isCurrentUser = currentUser && currentUser.id === player.id;
        
        const item = document.createElement('div');
        item.className = `rating-item ${isCurrentUser ? 'current-user' : ''}`;
        item.innerHTML = `
            <div class="rating-place">#${index + 1}</div>
            <div class="rating-user">
                <div class="rating-avatar">${player.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div>${player.name}</div>
                    <div class="friend-status ${player.online ? 'online' : 'offline'}">
                        ${player.online ? 'В сети' : 'Не в сети'}
                    </div>
                </div>
            </div>
            <div class="rating-rating">${player.rating}</div>
            <div class="rating-games">${player.games}</div>
        `;
        
        item.addEventListener('click', () => {
            viewPlayerProfile(player.id);
        });
        
        ratingList.appendChild(item);
    });
}

function loadFriendsList() {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) return;
    
    friendsList.innerHTML = '';
    
    const currentUser = app.getCurrentUser();
    
    if (!currentUser) {
        friendsList.innerHTML = `
            <div class="empty-state" style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">
                <p>Войдите в аккаунт, чтобы видеть друзей</p>
            </div>
        `;
        return;
    }
    
    // Показываем пустой список друзей
    friendsList.innerHTML = `
        <div class="empty-state" style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">
            <i class="fas fa-user-friends" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>У вас пока нет друзей</p>
            <p>Добавьте друзей, играя в шахматы!</p>
        </div>
    `;
}

function viewPlayerProfile(playerId) {
    const players = getRealPlayers();
    const player = players.find(p => p.id === playerId);
    if (player) {
        app.showNotification(`Профиль игрока: ${player.name} (Рейтинг: ${player.rating})`, 'info');
    }
}

function sendChallenge(friendId) {
    app.showNotification('Добавьте друзей, чтобы отправлять вызовы', 'info');
}

function openForum() {
    app.showNotification('Форум в разработке', 'info');
}

function searchFriends() {
    app.showNotification('Поиск друзей в разработке', 'info');
}

function browseClubs() {
    app.showNotification('Клубы в разработке', 'info');
}

// Обновление таблицы рейтинга при изменении данных
function updateCommunityData() {
    loadRatingTable();
    loadFriendsList();
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
        loadRatingTable();
        loadFriendsList();
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
    
    document.getElementById('registerSuccess').style.display = 'block';
    app.showNotification(`Регистрация успешна! Аккаунт ${username} создан.`, 'success');
    
    setTimeout(() => {
        closeRegisterModal();
        app.checkAuthStatus();
        loadRatingTable();
        loadFriendsList();
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
    loadRatingTable();
    
    closeProfileMenu();
    app.showNotification('Профиль успешно обновлен!', 'success');
}

function logout() {
    app.logout();
    closeProfileMenu();
    loadRatingTable();
    loadFriendsList();
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

// Экспортируем для использования в других файлах
window.updateCommunityData = updateCommunityData;