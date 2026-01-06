// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'auth.html';
}

// Initialize app
document.getElementById('userName').textContent = currentUser?.username || 'Пользователь';
document.getElementById('userAvatar').textContent = currentUser?.username?.[0]?.toUpperCase() || 'U';

// Settings
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const logoutBtn = document.getElementById('logoutBtn');
const themeSelect = document.getElementById('themeSelect');

settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
});

// Theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = savedTheme === 'dark' ? 'dark-theme' : '';
themeSelect.value = savedTheme;

themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
});

// Notifications
const notificationsToggle = document.getElementById('notificationsToggle');
notificationsToggle.checked = localStorage.getItem('notifications') !== 'false';
notificationsToggle.addEventListener('change', (e) => {
    localStorage.setItem('notifications', e.target.checked);
});

// Sound
const soundToggle = document.getElementById('soundToggle');
soundToggle.checked = localStorage.getItem('sound') !== 'false';
soundToggle.addEventListener('change', (e) => {
    localStorage.setItem('sound', e.target.checked);
});

// Animations
const animationsToggle = document.getElementById('animationsToggle');
animationsToggle.checked = localStorage.getItem('animations') !== 'false';
animationsToggle.addEventListener('change', (e) => {
    localStorage.setItem('animations', e.target.checked);
    if (!e.target.checked) {
        document.body.style.setProperty('--animation-duration', '0s');
    } else {
        document.body.style.removeProperty('--animation-duration');
    }
});

// Demo chats
const demoChats = [
    { id: 1, name: 'Алексей', lastMessage: 'Привет! Как дела?', time: '10:30', avatar: 'А' },
    { id: 2, name: 'Мария', lastMessage: 'Увидимся завтра', time: '09:15', avatar: 'М' },
    { id: 3, name: 'Дмитрий', lastMessage: 'Отправил файлы', time: 'Вчера', avatar: 'Д' },
    { id: 4, name: 'Елена', lastMessage: 'Спасибо!', time: 'Вчера', avatar: 'Е' }
];

const chatsList = document.getElementById('chatsList');
demoChats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.innerHTML = `
        <div class="avatar">${chat.avatar}</div>
        <div class="chat-item-info">
            <h4>${chat.name}</h4>
            <p>${chat.lastMessage}</p>
        </div>
        <span style="color: var(--text-secondary); font-size: 12px;">${chat.time}</span>
    `;
    chatItem.addEventListener('click', () => loadChat(chat));
    chatsList.appendChild(chatItem);
});

// Friends system
let friends = JSON.parse(localStorage.getItem('friends_' + currentUser.username) || '[]');

// Add friend modal
const addFriendBtn = document.getElementById('addFriendBtn');
const addFriendModal = document.getElementById('addFriendModal');
const closeAddFriend = document.getElementById('closeAddFriend');
const friendSearchInput = document.getElementById('friendSearchInput');
const searchResults = document.getElementById('searchResults');

addFriendBtn.addEventListener('click', () => {
    addFriendModal.classList.add('active');
    friendSearchInput.value = '';
    searchResults.innerHTML = '';
});

closeAddFriend.addEventListener('click', () => {
    addFriendModal.classList.remove('active');
});

addFriendModal.addEventListener('click', (e) => {
    if (e.target === addFriendModal) {
        addFriendModal.classList.remove('active');
    }
});

// Real-time friend search
friendSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
        searchResults.innerHTML = '<p style="color: var(--text-secondary); padding: 12px;">Введите минимум 2 символа</p>';
        return;
    }
    
    // Search in all registered users
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const results = allUsers.filter(user => 
        user.username.toLowerCase().includes(query) && 
        user.username !== currentUser.username &&
        !friends.find(f => f.username === user.username)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="color: var(--text-secondary); padding: 12px;">Пользователи не найдены</p>';
        return;
    }
    
    results.forEach(user => {
        const userItem = document.createElement('div');
        userItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border);';
        userItem.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: center;">
                <div class="avatar">${user.username[0].toUpperCase()}</div>
                <div>
                    <h4>${user.username}</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">${user.email}</p>
                </div>
            </div>
            <button class="auth-btn" style="width: auto; padding: 8px 16px; font-size: 14px;" onclick="addFriend('${user.username}', '${user.email}')">Добавить</button>
        `;
        searchResults.appendChild(userItem);
    });
});

window.addFriend = function(username, email) {
    const newFriend = {
        id: Date.now(),
        username: username,
        email: email,
        avatar: username[0].toUpperCase(),
        lastMessage: 'Новый друг',
        time: 'Сейчас'
    };
    
    friends.push(newFriend);
    localStorage.setItem('friends_' + currentUser.username, JSON.stringify(friends));
    
    // Add to chat list
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.innerHTML = `
        <div class="avatar">${newFriend.avatar}</div>
        <div class="chat-item-info">
            <h4>${newFriend.username}</h4>
            <p>${newFriend.lastMessage}</p>
        </div>
        <span style="color: var(--text-secondary); font-size: 12px;">${newFriend.time}</span>
    `;
    chatItem.addEventListener('click', () => loadChat(newFriend));
    chatsList.appendChild(chatItem);
    
    addFriendModal.classList.remove('active');
    alert('Друг добавлен!');
};

// Load friends on start
function loadFriends() {
    friends.forEach(friend => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <div class="avatar">${friend.avatar}</div>
            <div class="chat-item-info">
                <h4>${friend.username}</h4>
                <p>${friend.lastMessage}</p>
            </div>
            <span style="color: var(--text-secondary); font-size: 12px;">${friend.time}</span>
        `;
        chatItem.addEventListener('click', () => loadChat(friend));
        chatsList.appendChild(chatItem);
    });
}

// Load friends after demo chats
setTimeout(loadFriends, 100);

// Search in chats
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.chat-item').forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
});
