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

// Search
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.chat-item').forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
});
