// JS для страницы "Магазин"

// Данные товаров (заглушка)
const mockProducts = [
    {
        id: 1,
        name: "Классическая доска",
        description: "Традиционная шахматная доска из дерева",
        price: 500,
        category: "boards",
        owned: true,
        icon: "fa-chess-board"
    },
    {
        id: 2,
        name: "Мраморные фигуры",
        description: "Элегантные фигуры из белого мрамора",
        price: 750,
        category: "pieces",
        owned: false,
        icon: "fa-chess-king"
    },
    {
        id: 3,
        name: "Золотая подписка",
        description: "Премиум-функции на 1 месяц",
        price: 300,
        category: "subscriptions",
        owned: false,
        icon: "fa-crown"
    },
    {
        id: 4,
        name: "3D-фигуры",
        description: "Объемные фигуры с анимацией",
        price: 1200,
        category: "pieces",
        owned: false,
        icon: "fa-chess-queen"
    },
    {
        id: 5,
        name: "Темная тема",
        description: "Специальная темная тема для доски",
        price: 250,
        category: "effects",
        owned: true,
        icon: "fa-moon"
    },
    {
        id: 6,
        name: "Анимация ходов",
        description: "Плавная анимация перемещения фигур",
        price: 400,
        category: "effects",
        owned: false,
        icon: "fa-bolt"
    },
    {
        id: 7,
        name: "Историческая доска",
        description: "Доска в стиле средневековья",
        price: 900,
        category: "boards",
        owned: false,
        icon: "fa-landmark"
    },
    {
        id: 8,
        name: "Платиновая подписка",
        description: "Все премиум-функции на 3 месяца",
        price: 800,
        category: "subscriptions",
        owned: false,
        icon: "fa-gem"
    }
];

// Мои покупки (заглушка)
const myPurchases = [
    { id: 1, name: "Классическая доска", date: "2024-03-10", price: 500 },
    { id: 5, name: "Темная тема", date: "2024-03-12", price: 250 }
];

// Переменные
let selectedCategory = 'all';
let selectedFundsAmount = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadPurchases();
    updateUserBalance();
    setupCategoryFilters();
    setupFundsOptions();
    
    // Обновляем приветствие
    const user = app.getCurrentUser();
    if (user) {
        document.querySelector('.welcome-message').textContent = `Магазин ChessClub`;
        document.querySelector('.subtitle').textContent = 'Улучшите свой игровой опыт';
    }
});

function loadProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filteredProducts = selectedCategory === 'all' 
        ? mockProducts 
        : mockProducts.filter(p => p.category === selectedCategory);
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function loadPurchases() {
    const container = document.getElementById('purchasesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (myPurchases.length === 0) {
        container.innerHTML = '<div class="empty-state">У вас еще нет покупок</div>';
        return;
    }
    
    myPurchases.forEach(purchase => {
        const product = mockProducts.find(p => p.id === purchase.id);
        if (!product) return;
        
        const item = document.createElement('div');
        item.className = 'purchase-item';
        item.innerHTML = `
            <div class="purchase-icon">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="purchase-info">
                <h4>${product.name}</h4>
                <div class="purchase-date">Куплено: ${formatDate(purchase.date)}</div>
                <div class="purchase-price">${purchase.price} золота</div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${product.owned ? 'owned' : ''}`;
    
    card.innerHTML = `
        <div class="product-image">
            <i class="fas ${product.icon}"></i>
        </div>
        <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">
                <div class="price-amount">${product.price} золота</div>
                <div class="product-actions">
                    ${product.owned ? 
                        '<button class="btn-buy" disabled>Куплено</button>' : 
                        `<button class="btn-buy" onclick="buyProduct(${product.id})">Купить</button>`
                    }
                    <button class="btn-preview" onclick="previewProduct(${product.id})">Превью</button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function updateUserBalance() {
    const user = app.getCurrentUser();
    if (!user) return;
    
    const balance = app.getBalance(user.id);
    const balanceElement = document.getElementById('userBalanceAmount');
    const profileBalanceElement = document.getElementById('profileBalance');
    
    if (balanceElement) {
        balanceElement.textContent = `${balance.toLocaleString()} золота`;
    }
    
    if (profileBalanceElement) {
        profileBalanceElement.textContent = balance.toLocaleString();
    }
}

function setupCategoryFilters() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем выбранную категорию
            selectedCategory = this.dataset.category;
            
            // Перезагружаем товары
            loadProducts();
        });
    });
}

function setupFundsOptions() {
    document.querySelectorAll('.funds-option').forEach(option => {
        option.addEventListener('click', function() {
            // Убираем выбор у всех опций
            document.querySelectorAll('.funds-option').forEach(o => {
                o.classList.remove('selected');
            });
            
            // Выбираем текущую опцию
            this.classList.add('selected');
            selectedFundsAmount = parseInt(this.dataset.amount);
            
            // Очищаем поле для произвольной суммы
            document.getElementById('customAmount').value = '';
        });
    });
    
    // Обработка ввода произвольной суммы
    document.getElementById('customAmount').addEventListener('input', function() {
        // Снимаем выбор с фиксированных опций
        document.querySelectorAll('.funds-option').forEach(o => {
            o.classList.remove('selected');
        });
        
        selectedFundsAmount = parseInt(this.value) || null;
    });
}

function buyProduct(productId) {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт для покупки', 'info');
        return;
    }
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    
    const user = app.getCurrentUser();
    const balance = app.getBalance(user.id);
    
    if (balance < product.price) {
        app.showNotification('Недостаточно средств', 'error');
        openAddFundsModal();
        return;
    }
    
    // Списание средств
    const newBalance = balance - product.price;
    app.saveBalance(user.id, newBalance);
    
    // Добавление в покупки
    const purchase = {
        id: product.id,
        name: product.name,
        date: new Date().toISOString().split('T')[0],
        price: product.price
    };
    
    myPurchases.push(purchase);
    product.owned = true;
    
    // Обновление интерфейса
    updateUserBalance();
    loadProducts();
    loadPurchases();
    
    app.showNotification(`Покупка "${product.name}" успешно завершена!`, 'success');
}

function previewProduct(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
        app.showNotification(`Превью товара: ${product.name}`, 'info');
        // Здесь будет открытие модального окна с превью
    }
}

function openAddFundsModal() {
    if (!app.getCurrentUser()) {
        openLoginModal();
        app.showNotification('Войдите в аккаунт для пополнения', 'info');
        return;
    }
    
    document.getElementById('addFundsModal').style.display = 'flex';
}

function closeAddFundsModal() {
    document.getElementById('addFundsModal').style.display = 'none';
    document.querySelectorAll('.funds-option').forEach(o => {
        o.classList.remove('selected');
    });
    document.getElementById('customAmount').value = '';
    selectedFundsAmount = null;
}

function processPayment() {
    const user = app.getCurrentUser();
    if (!user) return;
    
    let amount = selectedFundsAmount;
    
    // Проверяем произвольную сумму
    if (!amount) {
        const customAmount = parseInt(document.getElementById('customAmount').value);
        if (!customAmount || customAmount < 10 || customAmount > 10000) {
            app.showNotification('Введите корректную сумму (10-10000)', 'error');
            return;
        }
        amount = customAmount;
    }
    
    // Имитация пополнения
    const balance = app.getBalance(user.id);
    const newBalance = balance + amount;
    app.saveBalance(user.id, newBalance);
    
    updateUserBalance();
    closeAddFundsModal();
    
    app.showNotification(`Баланс пополнен на ${amount} золота!`, 'success');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Модальные окна (те же функции что и в других вкладках)
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
        app.checkAuthStatus();
        location.reload();
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
    location.reload();
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