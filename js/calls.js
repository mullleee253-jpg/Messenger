// Call functionality
const voiceCallBtn = document.getElementById('voiceCallBtn');
const videoCallBtn = document.getElementById('videoCallBtn');
const callModal = document.getElementById('callModal');
const endCallBtn = document.getElementById('endCallBtn');
const muteBtn = document.getElementById('muteBtn');
const toggleVideoBtn = document.getElementById('toggleVideoBtn');

let isMuted = false;
let isVideoOn = true;

voiceCallBtn.addEventListener('click', () => {
    if (!currentChat) return;
    startCall(currentChat, 'voice');
});

videoCallBtn.addEventListener('click', () => {
    if (!currentChat) return;
    startCall(currentChat, 'video');
});

function startCall(chat, type) {
    document.getElementById('callName').textContent = chat.name;
    document.getElementById('callStatus').textContent = type === 'video' ? 'Видеозвонок...' : 'Голосовой звонок...';
    callModal.classList.add('active');
    
    // Simulate connection
    setTimeout(() => {
        document.getElementById('callStatus').textContent = 'Соединено';
    }, 2000);
}

endCallBtn.addEventListener('click', () => {
    callModal.classList.remove('active');
    isMuted = false;
    isVideoOn = true;
    muteBtn.textContent = '🎤';
    toggleVideoBtn.textContent = '📹';
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🎤';
});

toggleVideoBtn.addEventListener('click', () => {
    isVideoOn = !isVideoOn;
    toggleVideoBtn.textContent = isVideoOn ? '📹' : '📷';
});

callModal.addEventListener('click', (e) => {
    if (e.target === callModal) {
        callModal.classList.remove('active');
    }
});
