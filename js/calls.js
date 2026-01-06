// Call functionality
const voiceCallBtn = document.getElementById('voiceCallBtn');
const videoCallBtn = document.getElementById('videoCallBtn');
const callModal = document.getElementById('callModal');
const endCallBtn = document.getElementById('endCallBtn');
const muteBtn = document.getElementById('muteBtn');
const toggleVideoBtn = document.getElementById('toggleVideoBtn');

let isMuted = false;
let isVideoOn = true;
let localStream = null;
let audioContext = null;

voiceCallBtn.addEventListener('click', () => {
    if (!currentChat) return;
    startCall(currentChat, 'voice');
});

videoCallBtn.addEventListener('click', () => {
    if (!currentChat) return;
    startCall(currentChat, 'video');
});

async function startCall(chat, type) {
    document.getElementById('callName').textContent = chat.name;
    document.getElementById('callStatus').textContent = 'Запрос доступа...';
    callModal.classList.add('active');
    
    try {
        // Request microphone and camera access
        const constraints = {
            audio: true,
            video: type === 'video'
        };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('callStatus').textContent = 'Соединено ✓';
        
        // Create audio context for visualization
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(localStream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        // Show video if video call
        if (type === 'video' && localStream.getVideoTracks().length > 0) {
            showLocalVideo();
        }
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        document.getElementById('callStatus').textContent = 'Ошибка доступа к устройствам';
        alert('Не удалось получить доступ к микрофону/камере. Проверьте разрешения браузера.');
    }
}

function showLocalVideo() {
    const videoContainer = document.createElement('div');
    videoContainer.id = 'localVideoContainer';
    videoContainer.style.cssText = 'position: absolute; top: 20px; right: 20px; width: 200px; height: 150px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
    
    const video = document.createElement('video');
    video.id = 'localVideo';
    video.autoplay = true;
    video.muted = true;
    video.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    video.srcObject = localStream;
    
    videoContainer.appendChild(video);
    document.querySelector('.call-content').appendChild(videoContainer);
}

endCallBtn.addEventListener('click', () => {
    stopCall();
});

function stopCall() {
    // Stop all tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    // Close audio context
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    // Remove video element
    const videoContainer = document.getElementById('localVideoContainer');
    if (videoContainer) {
        videoContainer.remove();
    }
    
    callModal.classList.remove('active');
    isMuted = false;
    isVideoOn = true;
    muteBtn.textContent = '🎤';
    toggleVideoBtn.textContent = '📹';
}

muteBtn.addEventListener('click', () => {
    if (!localStream) return;
    
    isMuted = !isMuted;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
    });
    muteBtn.textContent = isMuted ? '🔇' : '🎤';
});

toggleVideoBtn.addEventListener('click', () => {
    if (!localStream) return;
    
    isVideoOn = !isVideoOn;
    localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
    });
    toggleVideoBtn.textContent = isVideoOn ? '📹' : '📷';
});

callModal.addEventListener('click', (e) => {
    if (e.target === callModal) {
        stopCall();
    }
});
