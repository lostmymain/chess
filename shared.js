// Общие функции для всех страниц
class ChessClubApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.initDatabase();
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadSettings();
        this.updatePerformanceStats();
        setInterval(() => this.updatePerformanceStats(), 3000);
    }
    
    initDatabase() {
        if (!localStorage.getItem('chessclub_users')) {
            localStorage.setItem('chessclub_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('chessclub_current_user')) {
            localStorage.setItem('chessclub_current_user', JSON.stringify(null));
        }
        if (!localStorage.getItem('chessclub_settings')) {
            localStorage.setItem('chessclub_settings', JSON.stringify({
                language: 'ru',
                theme: 'dark',
                volume: 50
            }));
        }
        if (!localStorage.getItem('chessclub_avatars')) {
            localStorage.setItem('chessclub_avatars', JSON.stringify({}));
        }
        if (!localStorage.getItem('chessclub_balance')) {
            localStorage.setItem('chessclub_balance', JSON.stringify({}));
        }
    }
    
    getUsers() {
        return JSON.parse(localStorage.getItem('chessclub_users')) || [];
    }
    
    saveUser(user) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('chessclub_users', JSON.stringify(users));
    }
    
    findUser(usernameOrEmail) {
        const users = this.getUsers();
        return users.find(user => 
            user.username === usernameOrEmail || user.email === usernameOrEmail
        );
    }
    
    setCurrentUser(user) {
        localStorage.setItem('chessclub_current_user', JSON.stringify(user));
    }
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('chessclub_current_user'));
    }
    
    logout() {
        localStorage.setItem('chessclub_current_user', JSON.stringify(null));
        this.checkAuthStatus();
        this.showNotification('Вы вышли из аккаунта', 'info');
    }
    
    getSettings() {
        return JSON.parse(localStorage.getItem('chessclub_settings'));
    }
    
    saveSettings(settings) {
        localStorage.setItem('chessclub_settings', JSON.stringify(settings));
    }
    
    getAvatar(userId) {
        const avatars = JSON.parse(localStorage.getItem('chessclub_avatars')) || {};
        return avatars[userId] || null;
    }
    
    saveAvatar(userId, avatarData) {
        const avatars = JSON.parse(localStorage.getItem('chessclub_avatars')) || {};
        avatars[userId] = avatarData;
        localStorage.setItem('chessclub_avatars', JSON.stringify(avatars));
    }
    
    getBalance(userId) {
        const balances = JSON.parse(localStorage.getItem('chessclub_balance')) || {};
        return balances[userId] || 1250;
    }
    
    saveBalance(userId, balance) {
        const balances = JSON.parse(localStorage.getItem('chessclub_balance')) || {};
        balances[userId] = balance;
        localStorage.setItem('chessclub_balance', JSON.stringify(balances));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    hashPassword(password) {
        return btoa(password);
    }
    
    updatePerformanceStats() {
        const ping = Math.floor(Math.random() * 100) + 20;
        const server = Math.floor(Math.random() * 5) + 1;
        const fps = Math.floor(Math.random() * 30) + 30;
        
        const pingElement = document.getElementById('pingValue');
        const serverElement = document.getElementById('serverValue');
        const fpsElement = document.getElementById('fpsValue');
        
        if (pingElement) pingElement.textContent = `${ping} ms`;
        if (serverElement) serverElement.textContent = `${server} ms`;
        if (fpsElement) fpsElement.textContent = fps;
    }
    
    setupEventListeners() {
        // Настройки dropdown
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsDropdown = document.getElementById('settingsDropdownContent');
        
        if (settingsBtn && settingsDropdown) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsDropdown.classList.toggle('show');
                const profileDropdown = document.getElementById('profileDropdownContent');
                if (profileDropdown) profileDropdown.classList.remove('show');
            });
        }
        
        // Профиль dropdown
        const userMenu = document.getElementById('userMenu');
        const profileDropdown = document.getElementById('profileDropdownContent');
        
        if (userMenu && profileDropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
                if (settingsDropdown) settingsDropdown.classList.remove('show');
            });
        }
        
        // Закрытие dropdown при клике вне
        document.addEventListener('click', (e) => {
            if (settingsDropdown && !settingsDropdown.contains(e.target) && 
                settingsBtn && !settingsBtn.contains(e.target)) {
                settingsDropdown.classList.remove('show');
            }
            
            if (profileDropdown && userMenu && 
                !profileDropdown.contains(e.target) && 
                !userMenu.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
    
    checkAuthStatus() {
        const user = this.getCurrentUser();
        if (user) {
            this.showUserMenu(user);
        } else {
            this.showAuthButtons();
        }
    }
    
    showUserMenu(user) {
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        
        if (userMenu) {
            userMenu.style.display = 'flex';
            document.getElementById('userName').textContent = user.username;
            
            // Аватар
            const avatarData = this.getAvatar(user.id);
            const userAvatar = document.getElementById('userAvatar');
            const userAvatarText = document.getElementById('userAvatarText');
            const userAvatarImg = document.getElementById('userAvatarImg');
            
            if (avatarData) {
                userAvatar.classList.add('has-image');
                userAvatarImg.src = avatarData;
                userAvatarText.textContent = '';
            } else {
                userAvatar.classList.remove('has-image');
                userAvatarText.textContent = user.username.charAt(0).toUpperCase();
                userAvatarImg.src = '';
            }
        }
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }
    }
    
    showAuthButtons() {
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        
        if (userMenu) userMenu.style.display = 'none';
        if (authButtons) authButtons.style.display = 'flex';
    }
    
    loadSettings() {
        const settings = this.getSettings();
        
        // Применяем тему
        if (settings.theme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Устанавливаем язык
        const languageSelect = document.getElementById('languageSelect');
        const themeSelect = document.getElementById('themeSelect');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (languageSelect) languageSelect.value = settings.language;
        if (themeSelect) themeSelect.value = settings.theme;
        if (volumeSlider) volumeSlider.value = settings.volume;
    }
    
    changeLanguage() {
        const languageSelect = document.getElementById('languageSelect');
        if (!languageSelect) return;
        
        const language = languageSelect.value;
        const settings = this.getSettings();
        settings.language = language;
        this.saveSettings(settings);
        
        this.showNotification(`Язык изменен на: ${languageSelect.options[languageSelect.selectedIndex].text}`, 'success');
    }
    
    changeTheme() {
        const themeSelect = document.getElementById('themeSelect');
        if (!themeSelect) return;
        
        const theme = themeSelect.value;
        const settings = this.getSettings();
        settings.theme = theme;
        this.saveSettings(settings);
        
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        
        this.showNotification(`Тема изменена на: ${theme === 'dark' ? 'Темная' : 'Светлая'}`, 'success');
    }
    
    changeVolume() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (!volumeSlider) return;
        
        const volume = volumeSlider.value;
        const settings = this.getSettings();
        settings.volume = volume;
        this.saveSettings(settings);
    }
}

// Инициализация при загрузке страницы
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ChessClubApp();
});

// Обновляем данные при регистрации/входе
function updateAllData() {
    // Обновляем данные на всех страницах
    if (typeof updateCommunityData === 'function') {
        updateCommunityData();
    }
    if (typeof updateTournamentsData === 'function') {
        updateTournamentsData();
    }
    
    // Уведомление о реальных данных
    const userCount = this.getUsers().length;
    if (userCount === 1) {
        this.showNotification('Вы первый пользователь ChessClub!', 'info');
    } else if (userCount > 0) {
        this.showNotification(`В ChessClub уже ${userCount} игроков!`, 'info');
    }
}

// В функции register() добавить в конце:
this.updateAllData();

// В функции login() добавить в конце:
this.updateAllData();