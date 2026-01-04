// JS для страницы "Профиль"

// Данные игр (заглушка)
const mockGames = [
    {
        id: 1,
        opponent: "Гроссмейстер",
        result: "lose",
        ratingChange: -15,
        timeControl: "10+5",
        date: "2024-03-15T14:30:00"
    },
    {
        id: 2,
        opponent: "ШахматныйВолк",
        result: "win",
        ratingChange: +20,
        timeControl: "5+0",
        date: "2024-03-14T18:45:00"
    },
    {
        id: 3,
        opponent: "БелыйКонь",
        result: "draw",
        ratingChange: 0,
        timeControl: "15+10",
        date: "2024-03-13T21:15:00"
    },
    {
        id: 4,
        opponent: "Начинающий",
        result: "win",
        ratingChange: +12,
        timeControl: "10+5",
        date: "2024-03-12T16:20:00"
    },
    {
        id: 5,
        opponent: "ЛадьяГрозная",
        result: "lose",
        ratingChange: -18,
        timeControl: "3+2",
        date: "2024-03-11T19:30:00"
    }
];

// Статистика (заглушка)
const userStats = {
    totalGames: 45,
    wins: 25,
    losses: 15,
    draws: 5,
    rating: 1200,
    highestRating: 1350,
    winRate: 56
};

let gamesChart = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const user = app.getCurrentUser();
    
    if (user) {
        loadProfileData(user);
        loadRecentGames();
        initStatsChart();
    } else {
        // Если пользователь не авторизован, показываем сообщение
        document.querySelector('.profile-content').innerHTML = `
            <div class="not-logged-in">
                <h2>Профиль недоступен</h2>
                <p>Войдите в аккаунт для просмотра профиля</p>
                <div class="auth-buttons">
                    <button class="btn-primary" onclick="openLoginModal()">Войти</button>
                    <button class="btn-secondary" onclick="openRegisterModal()">Регистрация</button>
                </div>
            </div>
        `;
    }
});

function loadProfileData(user) {
    // Основная информация
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileUsername').value = user.username;
    document.getElementById('profileEmailInput').value = user.email;
    
    // Дата регистрации
    const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const formattedDate = joinDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('profileJoined').textContent = `Зарегистрирован: ${formattedDate}`;
    
    // Статистика
    document.getElementById('profileRating').textContent = userStats.rating;
    document.getElementById('profileGames').textContent = userStats.totalGames;
    document.getElementById('profileWins').textContent = userStats.wins;
    
    // Баланс
    const balance = app.getBalance(user.id);
    document.getElementById('profileBalance').textContent = balance.toLocaleString();
    
    // Аватар
    const avatarData = app.getAvatar(user.id);
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    const profileAvatarText = document.getElementById('profileAvatarText');
    const profileAvatarImg = document.getElementById('profileAvatarImg');
    
    if (avatarData) {
        profileAvatarLarge.classList.add('has-image');
        profileAvatarImg.src = avatarData;
        profileAvatarText.textContent = '';
    } else {
        profileAvatarLarge.classList.remove('has-image');
        profileAvatarText.textContent = user.username.charAt(0).toUpperCase();
        profileAvatarImg.src = '';
    }
}

function loadRecentGames() {
    const container = document.getElementById('gamesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockGames.forEach(game => {
        const gameElement = createGameElement(game);
        container.appendChild(gameElement);
    });
}

function createGameElement(game) {
    const gameDate = new Date(game.date);
    const formattedDate = gameDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const resultText = {
        'win': 'Победа',
        'lose': 'Поражение',
        'draw': 'Ничья'
    }[game.result] || game.result;
    
    const ratingChange = game.ratingChange > 0 ? 
        `+${game.ratingChange}` : game.ratingChange;
    
    const item = document.createElement('div');
    item.className = 'game-item';
    item.innerHTML = `
        <div class="game-result">
            <div class="game-outcome ${game.result}">
                ${game.result === 'win' ? 'W' : game.result === 'lose' ? 'L' : 'D'}
            </div>
            <div class="game-info">
                <h4>${game.opponent}</h4>
                <div class="game-details">
                    ${resultText} • ${game.timeControl} • ${formattedDate}
                </div>
            </div>
        </div>
        <div class="game-rating">
            ${ratingChange}
        </div>
    `;
    
    item.addEventListener('click', () => {
        viewGameDetails(game.id);
    });
    
    return item;
}

function initStatsChart() {
    const ctx = document.getElementById('gamesChart');
    if (!ctx) return;
    
    if (gamesChart) {
        gamesChart.destroy();
    }
    
    gamesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Рейтинг',
                data: [1150, 1200, 1250, 1300, 1250, 1200],
                borderColor: '#d1b568',
                backgroundColor: 'rgba(209, 181, 104, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
    
    // Адаптация для светлой темы
    if (document.body.classList.contains('light-theme')) {
        gamesChart.options.scales.y.grid.color = 'rgba(0, 0, 0, 0.1)';
        gamesChart.options.scales.y.ticks.color = 'rgba(51, 51, 51, 0.7)';
        gamesChart.options.scales.x.grid.color = 'rgba(0, 0, 0, 0.1)';
        gamesChart.options.scales.x.ticks.color = 'rgba(51, 51, 51, 0.7)';
        gamesChart.update();
    }
}

function viewGameDetails(gameId) {
    const game = mockGames.find(g => g.id === gameId);
    if (game) {
        app.showNotification(`Детали игры с ${game.opponent}`, 'info');
        // Здесь будет открытие модального окна с деталями игры
    }
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
    loadProfileData(user);
    
    app.showNotification('Профиль успешно обновлен!', 'success');
    resetForm();
}

function resetForm() {
    document.getElementById('profileCurrentPassword').value = '';
    document.getElementById('profileNewPassword').value = '';
    document.getElementById('profileConfirmPassword').value = '';
}

function logout() {
    app.logout();
    location.href = '../play/index.html';
}

function deleteAccount() {
    if (!app.getCurrentUser()) return;
    
    document.getElementById('deleteAccountModal').style.display = 'flex';
}

function closeDeleteAccountModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
    document.getElementById('deletePassword').value = '';
}

function confirmDelete() {
    const user = app.getCurrentUser();
    if (!user) return;
    
    const password = document.getElementById('deletePassword').value;
    const hashedPassword = app.hashPassword(password);
    
    if (hashedPassword !== user.password) {
        app.showNotification('Неверный пароль', 'error');
        return;
    }
    
    // Удаление пользователя
    const users = app.getUsers();
    const updatedUsers = users.filter(u => u.id !== user.id);
    localStorage.setItem('chessclub_users', JSON.stringify(updatedUsers));
    
    // Удаление связанных данных
    const avatars = JSON.parse(localStorage.getItem('chessclub_avatars') || '{}');
    delete avatars[user.id];
    localStorage.setItem('chessclub_avatars', JSON.stringify(avatars));
    
    const balances = JSON.parse(localStorage.getItem('chessclub_balance') || '{}');
    delete balances[user.id];
    localStorage.setItem('chessclub_balance', JSON.stringify(balances));
    
    // Выход из системы
    app.logout();
    closeDeleteAccountModal();
    
    app.showNotification('Аккаунт успешно удален', 'success');
    setTimeout(() => {
        location.href = '../play/index.html';
    }, 1000);
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
            loadProfileData(user);
            app.showNotification('Аватар успешно обновлен!', 'success');
        }
    };
    reader.readAsDataURL(file);
});

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
        location.reload();
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
        location.reload();
    }, 1000);
}

// Функции для настроек
function changeLanguage() { 
    app.changeLanguage();
    if (gamesChart) {
        gamesChart.destroy();
        initStatsChart();
    }
}
function changeTheme() { 
    app.changeTheme();
    if (gamesChart) {
        gamesChart.destroy();
        initStatsChart();
    }
}
function changeVolume() { app.changeVolume(); }