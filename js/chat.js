// Chat functionality
let currentChat = null;
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Demo messages
const demoMessages = {
    1: [
        { text: 'Привет! Как дела?', sent: false, time: '10:25' },
        { text: 'Привет! Все отлично, спасибо!', sent: true, time: '10:26' },
        { text: 'Что нового?', sent: false, time: '10:30' }
    ],
    2: [
        { text: 'Встретимся завтра?', sent: false, time: '09:10' },
        { text: 'Да, конечно!', sent: true, time: '09:12' },
        { text: 'Увидимся завтра', sent: false, time: '09:15' }
    ]
};

function loadChat(chat) {
    currentChat = chat;
    document.getElementById('chatName').textContent = chat.name;
    document.getElementById('chatAvatar').textContent = chat.avatar;
    document.getElementById('chatStatus').textContent = 'онлайн';
    
    // Mark as active
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Load messages
    messagesContainer.innerHTML = '';
    const messages = demoMessages[chat.id] || [];
    messages.forEach(msg => addMessage(msg.text, msg.sent, msg.time));
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addMessage(text, sent = true, time = null) {
    const message = document.createElement('div');
    message.className = `message ${sent ? 'sent' : 'received'}`;
    
    const now = time || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    message.innerHTML = `
        <div>${text}</div>
        <div class="message-time">${now}</div>
    `;
    
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChat) return;
    
    addMessage(text, true);
    messageInput.value = '';
    
    // Simulate response
    setTimeout(() => {
        const responses = ['Понял!', 'Хорошо', 'Отлично!', 'Спасибо!', '👍'];
        addMessage(responses[Math.floor(Math.random() * responses.length)], false);
    }, 1000);
}
