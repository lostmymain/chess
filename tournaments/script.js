// JS для страницы "Турниры" - РЕАЛЬНОЕ ВРЕМЯ

// Данные турниров
let activeTournaments = [];
let upcomingTournaments = [];
let myTournaments = [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadTournamentsData();
    loadActiveTournaments();
    loadUpcomingTournaments();
    loadMyTournaments();
    
    // Обновляем приветствие
    const user = app.getCurrentUser();
    if (user) {
        const tournamentsCount = myTournaments.length;
        document.querySelector('.welcome-message').textContent = `Турниры ChessClub`;
        document.querySelector('.subtitle').textContent = tournamentsCount > 0 ?
            `Вы участвуете в ${tournamentsCount} турнирах` :
            'Присоединяйтесь к соревнованиям!';
    } else {
        document.querySelector('.welcome-message').textContent = `Турниры ChessClub`;
        document.querySelector('.subtitle').textContent = 'Присоединяйтесь к соревнованиям!';
    }
});

function loadTournamentsData() {
    // Загружаем турниры из localStorage
    const savedData = JSON.parse(localStorage.getItem('chessclub_tournaments')) || {};
    
    activeTournaments = savedData.active || [];
    upcomingTournaments = savedData.upcoming || [];
    
    // Загружаем мои турниры
    const user = app.getCurrentUser();
    if (user) {
        const userTournaments = JSON.parse(localStorage.getItem(`chessclub_user_${user.id}_tournaments`)) || [];
        myTournaments = userTournaments;
    }
}

function saveTournamentsData() {
    const data = {
        active: activeTournaments,
        upcoming: upcomingTournaments
    };
    localStorage.setItem('chessclub_tournaments', JSON.stringify(data));
    
    const user = app.getCurrentUser();
    if (user) {
        localStorage.setItem(`chessclub_user_${user.id}_tournaments`, JSON.stringify(myTournaments));
    }
}

function loadActiveTournaments() {
    const container = document.getElementById('activeTournaments');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (activeTournaments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5); grid-column: 1 / -1;">
                <i class="fas fa-bolt" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>Пока нет активных турниров</p>
                <p>Создайте первый турнир!</p>
            </div>
        `;
        return;
    }
    
    activeTournaments.forEach(tournament => {
        const card = createTournamentCard(tournament, true);
        container.appendChild(card);
    });
}

function loadUpcomingTournaments() {
    const container = document.getElementById('upcomingTournaments');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (upcomingTournaments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5); grid-column: 1 / -1;">
                <i class="fas fa-calendar-alt" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>Пока нет предстоящих турниров</p>
                <p>Создайте турнир или дождитесь начала новых!</p>
            </div>
        `;
        return;
    }
    
    upcomingTournaments.forEach(tournament => {
        const card = createTournamentCard(tournament, false);
        container.appendChild(card);
    });
}

function loadMyTournaments() {
    const container = document.getElementById('myTournaments');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (myTournaments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5); grid-column: 1 / -1;">
                <i class="fas fa-user-check" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <p>Вы еще не участвуете в турнирах</p>
                <p>Присоединяйтесь к одному из турниров выше!</p>
            </div>
        `;
        return;
    }
    
    myTournaments.forEach(tournament => {
        const item = document.createElement('div');
        item.className = 'my-tournament-item';
        item.innerHTML = `
            <div class="my-tournament-info">
                <h4>${tournament.name}</h4>
                <div class="my-tournament-position">${tournament.position || 'Участник'}</div>
            </div>
            <div class="my-tournament-score">${tournament.score || '0/0'}</div>
        `;
        
        item.addEventListener('click', () => {
            viewTournament(tournament.id);
        });
        
        container.appendChild(item);
    });
}

function createTournamentCard(tournament, isActive) {
    const card = document.createElement('div');
    card.className = `tournament-card ${isActive ? 'active' : ''}`;
    
    const startDate = new Date(tournament.startTime);
    const formattedTime = startDate.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="tournament-header">
            <div class="tournament-title">${tournament.name}</div>
            <div class="tournament-status ${tournament.status}">
                ${tournament.status === 'active' ? 'Идет' : 
                  tournament.status === 'upcoming' ? 'Скоро' : 'Завершен'}
            </div>
        </div>
        
        <div class="tournament-info">
            <div class="tournament-detail">
                <i class="fas fa-users"></i>
                <span>${tournament.players}/${tournament.maxPlayers} участников</span>
            </div>
            <div class="tournament-detail">
                <i class="fas fa-clock"></i>
                <span>Контроль: ${tournament.timeControl}</span>
            </div>
            <div class="tournament-detail">
                <i class="fas fa-calendar-alt"></i>
                <span>Начало: ${formattedTime}</span>
            </div>
            <div class="tournament-detail">
                <i class="fas fa-trophy"></i>
                <span class="tournament-prize">Приз: ${tournament.prize} золота</span>
            </div>
        </div>
        
        <div class="tournament-actions">
            <button class="tournament-btn join" onclick="joinTournament(${tournament.id})">
                ${isActive ? 'Присоединиться' : 'Зарегистрироваться'}
            </button>
            <button class="tournament-btn view" onclick="viewTournament(${tournament.id})">
                Подробнее
            </button>
        </div>
    `;
    
    return card;
}

function joinTournament(tournamentId) {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт для участия', 'info');
        return;
    }
    
    let tournament = [...activeTournaments, ...upcomingTournaments]
        .find(t => t.id === tournamentId);
    
    if (tournament) {
        const user = app.getCurrentUser();
        const alreadyJoined = myTournaments.some(t => t.id === tournamentId);
        
        if (alreadyJoined) {
            app.showNotification('Вы уже участвуете в этом турнире', 'warning');
            return;
        }
        
        // Добавляем турнир в список моих турниров
        const myTournament = {
            id: tournament.id,
            name: tournament.name,
            status: tournament.status,
            position: 'Новый участник',
            score: '0/0'
        };
        
        myTournaments.push(myTournament);
        saveTournamentsData();
        
        // Увеличиваем количество участников
        tournament.players += 1;
        saveTournamentsData();
        
        // Обновляем интерфейс
        loadActiveTournaments();
        loadUpcomingTournaments();
        loadMyTournaments();
        
        app.showNotification(`Вы присоединились к турниру "${tournament.name}"`, 'success');
    }
}

function viewTournament(tournamentId) {
    app.showNotification('Детали турнира в разработке', 'info');
}

function createTournamentModal() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт для создания турнира', 'info');
        return;
    }
    
    document.getElementById('createTournamentModal').style.display = 'flex';
}

function closeCreateTournamentModal() {
    document.getElementById('createTournamentModal').style.display = 'none';
    document.getElementById('tournamentName').value = '';
    document.getElementById('tournamentDescription').value = '';
    document.getElementById('tournamentMaxPlayers').value = '16';
    document.getElementById('tournamentTime').value = '300';
    document.getElementById('tournamentPrize').value = '1000';
}

function createTournament() {
    const name = document.getElementById('tournamentName').value.trim();
    const description = document.getElementById('tournamentDescription').value.trim();
    const maxPlayers = document.getElementById('tournamentMaxPlayers').value;
    const timeControl = document.getElementById('tournamentTime').value;
    const prize = document.getElementById('tournamentPrize').value;
    
    if (!name) {
        app.showNotification('Введите название турнира', 'error');
        return;
    }
    
    if (maxPlayers < 2 || maxPlayers > 128) {
        app.showNotification('Количество участников должно быть от 2 до 128', 'error');
        return;
    }
    
    const timeLabels = {
        '300': '5 минут',
        '600': '10 минут',
        '900': '15 минут',
        '1800': '30 минут'
    };
    
    const user = app.getCurrentUser();
    const newTournament = {
        id: Date.now(),
        name: name,
        description: description,
        players: 1,
        maxPlayers: parseInt(maxPlayers),
        timeControl: timeLabels[timeControl] || '5 минут',
        prize: parseInt(prize),
        status: 'upcoming',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        creatorId: user.id,
        creatorName: user.username
    };
    
    // Добавляем в предстоящие турниры
    upcomingTournaments.push(newTournament);
    
    // Добавляем в мои турниры
    const myTournament = {
        id: newTournament.id,
        name: newTournament.name,
        status: newTournament.status,
        position: 'Организатор',
        score: '0/0'
    };
    myTournaments.push(myTournament);
    
    saveTournamentsData();
    
    app.showNotification(`Турнир "${name}" создан!`, 'success');
    closeCreateTournamentModal();
    
    // Обновляем интерфейс
    loadUpcomingTournaments();
    loadMyTournaments();
}

// Обновление данных турниров
function updateTournamentsData() {
    loadTournamentsData();
    loadActiveTournaments();
    loadUpcomingTournaments();
    loadMyTournaments();
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
        updateTournamentsData();
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
        updateTournamentsData();
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
    updateTournamentsData();
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
window.updateTournamentsData = updateTournamentsData;