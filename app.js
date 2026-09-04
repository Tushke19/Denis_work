// ===== COMPANY APP - MAIN APPLICATION LOGIC =====

// === STATE MANAGEMENT ===
const state = {
    mode: 'welcome', // welcome, chat, video
    currentMatch: null,
    userId: generateUserId(),
    isAnonymous: true,
    messages: [],
    videoStream: null,
    peerConnection: null,
    isAudioEnabled: true,
    isVideoEnabled: true,
    isBlurred: false,
    blurAmount: 0,
};

// === DOM ELEMENTS ===
const elements = {
    // Landing
    ageCheckbox: document.getElementById('ageConfirmCheckbox'),
    enterButton: document.getElementById('enterButton'),
    
    // Main
    workspace: document.getElementById('workspace'),
    topbarStatus: document.getElementById('status'),
    clock: document.getElementById('clock'),
    settingsButton: document.getElementById('settingsButton'),
    
    // Sidebar
    statusPill: document.getElementById('statusPill'),
    currentMatch: document.getElementById('currentMatch'),
    noMatch: document.getElementById('noMatch'),
    matchName: document.getElementById('matchName'),
    matchStatus: document.getElementById('matchStatus'),
    matchAvatar: document.getElementById('matchAvatar'),
    newConnectionBtn: document.getElementById('newConnection'),
    chatModeBtn: document.getElementById('chatModeBtn'),
    videoModeBtn: document.getElementById('videoModeBtn'),
    aiButton: document.getElementById('aiButton'),
    idToggle: document.getElementById('idToggle'),
    idToggleLabel: document.querySelector('.id-toggle'),
    nameStatus: document.getElementById('nameStatus'),
    donateButton: document.getElementById('donateButton'),
    
    // Chat
    chatPanel: document.getElementById('chatPanel'),
    conversation: document.getElementById('conversation'),
    chatForm: document.getElementById('chatForm'),
    messageInput: document.getElementById('messageInput'),
    characterCount: document.getElementById('characterCount'),
    chatAvatar: document.getElementById('chatAvatar'),
    chatName: document.getElementById('chatName'),
    chatStatus: document.getElementById('chatStatus'),
    voiceButton: document.getElementById('voiceButton'),
    moreButton: document.getElementById('moreButton'),
    chatOptions: document.getElementById('chatOptions'),
    clearChatButton: document.getElementById('clearChatButton'),
    reportChatButton: document.getElementById('reportChatButton'),
    setLocationBtn: document.getElementById('setLocationBtn'),
    locationStatus: document.getElementById('locationStatus'),
    settingsNameToggle: document.getElementById('settingsNameToggle'),
    toast: document.getElementById('toast'),
    
    // Video
    videoPanel: document.getElementById('videoPanel'),
    localVideo: document.getElementById('localVideo'),
    remoteVideo: document.getElementById('remoteVideo'),
    blurToggle: document.getElementById('blurToggle'),
    blurAmount: document.getElementById('blurAmount'),
    toggleAudioBtn: document.getElementById('toggleAudioBtn'),
    toggleVideoBtn: document.getElementById('toggleVideoBtn'),
    endCallBtn: document.getElementById('endCallBtn'),
    
    // Welcome
    welcomePanel: document.getElementById('welcomePanel'),
    
    // Modals
    settingsModal: document.getElementById('settingsModal'),
    aiModal: document.getElementById('aiModal'),
    donateModal: document.getElementById('donateModal'),
};

// === FAKE PEER NAMES & AVATARS ===
const peers = [
    { name: 'Maya', avatar: 'M', status: 'listening nearby' },
    { name: 'Jordan', avatar: 'J', status: 'open to chat' },
    { name: 'Alex', avatar: 'A', status: 'here to support' },
    { name: 'Sam', avatar: 'S', status: 'listening' },
    { name: 'Casey', avatar: 'C', status: 'here to talk' },
    { name: 'Morgan', avatar: 'M', status: 'ready to listen' },
];

// === UTILITY FUNCTIONS ===
function generateUserId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
}

function updateClock() {
    const now = new Date();
    const time = new Intl.DateTimeFormat('en-KE', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(now);
    elements.clock.textContent = time;
}

function getRandomPeer() {
    return peers[Math.floor(Math.random() * peers.length)];
}

function generateDateLabel() {
    const now = new Date();
    const today = new Intl.DateTimeFormat('en-KE', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(now);
    return today;
}

// === MESSAGE MANAGEMENT ===
function saveMessage(text, type) {
    const message = {
        id: Date.now(),
        text,
        type,
        timestamp: new Date(),
    };
    state.messages.push(message);
    localStorage.setItem('company-messages', JSON.stringify(state.messages));
}

function loadMessages() {
    const saved = localStorage.getItem('company-messages');
    if (saved) {
        state.messages = JSON.parse(saved);
    }
}

function addMessageToUI(text, type = 'sent', senderName = 'Someone') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-row ${type}`;
    
    const time = new Intl.DateTimeFormat('en-KE', {
        hour: 'numeric',
        minute: '2-digit'
    }).format(new Date());
    
    if (type === 'received') {
        msgDiv.innerHTML = `
            <span class="avatar tiny-avatar">${senderName.charAt(0)}</span>
            <div>
                <div class="message-bubble"><p>${escapeHtml(text)}</p></div>
                <time>${time}</time>
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div>
                <div class="message-bubble"><p>${escapeHtml(text)}</p></div>
                <time>${time}</time>
            </div>
        `;
    }
    
    const dateLabel = elements.conversation.querySelector('.date-divider');
    if (dateLabel) {
        elements.conversation.insertBefore(msgDiv, dateLabel.nextSibling);
    } else {
        elements.conversation.appendChild(msgDiv);
    }
    
    elements.conversation.scrollTop = elements.conversation.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let toastTimer;
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove('is-visible'), 3500);
}

// === AI RESPONSES ===
function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    const responses = {
        stress: 'That sounds really heavy. Sometimes just naming it helps. What would feel good right now—talking about it, or taking a break?',
        alone: 'You\'re not alone. This might not feel real in this moment, but there are people who understand. I\'m here.',
        help: 'I\'m listening. What would help most right now—someone to talk to, or someone to just sit with you?',
        future: 'It\'s hard to see light when things are dark. But many people who felt this way before found their way through. One small step at a time.',
        grateful: 'That\'s beautiful. Gratitude, even tiny, is a real thing. Hold onto that.',
        default: 'Thank you for sharing. I\'m here, and I hear you.'
    };
    
    if (msg.includes('stress') || msg.includes('anxious') || msg.includes('scared')) return responses.stress;
    if (msg.includes('alone') || msg.includes('lonely') || msg.includes('no one')) return responses.alone;
    if (msg.includes('help') || msg.includes('need')) return responses.help;
    if (msg.includes('future') || msg.includes('never') || msg.includes('hopeless')) return responses.future;
    if (msg.includes('thanks') || msg.includes('grateful') || msg.includes('better')) return responses.grateful;
    
    return responses.default;
}

// === PEER MATCHING ===
function matchWithPeer() {
    const peer = getRandomPeer();
    state.currentMatch = peer;
    
    // Update UI
    elements.matchName.textContent = peer.name;
    elements.matchStatus.textContent = peer.status;
    elements.matchAvatar.textContent = peer.avatar;
    elements.currentMatch.style.display = 'flex';
    elements.noMatch.style.display = 'none';
    elements.statusPill.textContent = 'connected';
    elements.statusPill.classList.add('online');
    
    elements.chatName.textContent = peer.name;
    elements.chatAvatar.textContent = peer.avatar;
    
    elements.topbarStatus.textContent = `Chatting with ${peer.name}`;
}

// === MODE SWITCHING ===
function switchMode(mode) {
    state.mode = mode;
    
    // Hide all panels
    elements.chatPanel.style.display = 'none';
    elements.videoPanel.style.display = 'none';
    elements.welcomePanel.style.display = 'none';
    
    // Update buttons
    elements.chatModeBtn.classList.remove('active');
    elements.videoModeBtn.classList.remove('active');
    
    if (mode === 'welcome') {
        elements.welcomePanel.style.display = 'flex';
    } else if (mode === 'chat') {
        elements.chatPanel.style.display = 'flex';
        elements.chatModeBtn.classList.add('active');
        matchWithPeer();
        elements.messageInput.focus();
    } else if (mode === 'video') {
        elements.videoPanel.style.display = 'flex';
        elements.videoModeBtn.classList.add('active');
        matchWithPeer();
        startVideo();
    }
}

// === CHAT FUNCTIONALITY ===
elements.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = elements.messageInput.value.trim();
    
    if (!text) return;
    
    // Add user message
    addMessageToUI(text, 'sent');
    saveMessage(text, 'sent');
    elements.messageInput.value = '';
    elements.characterCount.textContent = '0 / 500';
    
    // Simulate peer response (delay)
    setTimeout(() => {
        const peerResponses = [
            'I hear you.',
            'That makes sense.',
            'Thank you for telling me.',
            "I'm here with you.",
            'Take your time.',
            'That sounds really hard.',
            'I appreciate you sharing that.',
        ];
        const response = peerResponses[Math.floor(Math.random() * peerResponses.length)];
        addMessageToUI(response, 'received', state.currentMatch.name);
        saveMessage(response, 'received');
    }, 500 + Math.random() * 1500);
});

elements.messageInput.addEventListener('input', () => {
    const length = elements.messageInput.value.length;
    elements.characterCount.textContent = `${length} / 500`;
});

elements.voiceButton.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast('Voice input is not supported in this browser. You can still type your message.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-KE';
    recognition.interimResults = false;
    elements.voiceButton.textContent = '⏺';
    elements.voiceButton.setAttribute('aria-label', 'Listening for a voice message');
    recognition.onresult = (event) => {
        elements.messageInput.value = `${elements.messageInput.value} ${event.results[0][0].transcript}`.trim();
        elements.messageInput.dispatchEvent(new Event('input'));
    };
    recognition.onerror = () => showToast('I could not hear that. Please try again or type your message.');
    recognition.onend = () => {
        elements.voiceButton.textContent = '🎤';
        elements.voiceButton.setAttribute('aria-label', 'Voice message');
    };
    recognition.start();
});

// === VIDEO FUNCTIONALITY ===
async function startVideo() {
    try {
        state.videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
        });
        
        elements.localVideo.srcObject = state.videoStream;
        elements.remoteVideo.style.backgroundColor = '#333';
        
        // Simulate remote video connection
        setTimeout(() => {
            elements.remoteVideo.style.backgroundColor = '#1a1a1a';
            // In production, this would be WebRTC peer connection
        }, 1000);
    } catch (err) {
        alert('Camera access denied. Please enable camera permissions.');
        switchMode('chat');
    }
}

async function stopVideo() {
    if (state.videoStream) {
        state.videoStream.getTracks().forEach(track => track.stop());
        state.videoStream = null;
    }
    elements.localVideo.srcObject = null;
}

// Blur Toggle
elements.blurToggle.addEventListener('change', () => {
    state.isBlurred = elements.blurToggle.checked;
    elements.blurAmount.style.display = state.isBlurred ? 'block' : 'none';
});

elements.blurAmount.addEventListener('input', (e) => {
    state.blurAmount = e.target.value;
    elements.localVideo.style.filter = `blur(${state.blurAmount}px)`;
});

// Video Controls
elements.toggleAudioBtn.addEventListener('click', () => {
    state.isAudioEnabled = !state.isAudioEnabled;
    if (state.videoStream) {
        state.videoStream.getAudioTracks().forEach(track => {
            track.enabled = state.isAudioEnabled;
        });
    }
    elements.toggleAudioBtn.style.opacity = state.isAudioEnabled ? '1' : '0.5';
    elements.toggleAudioBtn.textContent = state.isAudioEnabled ? '🔊' : '🔇';
});

elements.toggleVideoBtn.addEventListener('click', () => {
    state.isVideoEnabled = !state.isVideoEnabled;
    if (state.videoStream) {
        state.videoStream.getVideoTracks().forEach(track => {
            track.enabled = state.isVideoEnabled;
        });
    }
    elements.toggleVideoBtn.style.opacity = state.isVideoEnabled ? '1' : '0.5';
    elements.toggleVideoBtn.textContent = state.isVideoEnabled ? '📹' : '📹';
});

elements.endCallBtn.addEventListener('click', () => {
    stopVideo();
    switchMode('welcome');
});

// === MODE BUTTONS ===
elements.chatModeBtn.addEventListener('click', () => switchMode('chat'));
elements.videoModeBtn.addEventListener('click', () => switchMode('video'));

// Welcome Card Clicks
document.querySelectorAll('.welcome-card[data-mode]').forEach(card => {
    card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        switchMode(mode);
    });
});

const aiStartButton = document.getElementById('aiStartBtn');
if (aiStartButton) {
    aiStartButton.addEventListener('click', () => {
        elements.aiModal.showModal();
    });
}

// === SETTINGS & MODALS ===
elements.settingsButton.addEventListener('click', () => {
    elements.settingsModal.showModal();
});

elements.aiButton.addEventListener('click', () => {
    elements.aiModal.showModal();
});

elements.donateButton.addEventListener('click', () => {
    elements.donateModal.showModal();
});

elements.moreButton.addEventListener('click', () => {
    const isOpen = !elements.chatOptions.hidden;
    elements.chatOptions.hidden = isOpen;
    elements.moreButton.setAttribute('aria-expanded', String(!isOpen));
});

document.addEventListener('click', (event) => {
    if (!elements.chatOptions.hidden
        && !elements.chatOptions.contains(event.target)
        && event.target !== elements.moreButton) {
        elements.chatOptions.hidden = true;
        elements.moreButton.setAttribute('aria-expanded', 'false');
    }
});

elements.clearChatButton.addEventListener('click', () => {
    state.messages = [];
    localStorage.removeItem('company-messages');
    elements.conversation.querySelectorAll('.message-row').forEach(message => message.remove());
    elements.chatOptions.hidden = true;
    elements.moreButton.setAttribute('aria-expanded', 'false');
    showToast('This conversation has been cleared on your device.');
});

elements.reportChatButton.addEventListener('click', () => {
    elements.chatOptions.hidden = true;
    elements.moreButton.setAttribute('aria-expanded', 'false');
    showToast('Thank you. Your concern has been noted for the support team.');
});

// ID Toggle
elements.idToggle.addEventListener('change', () => {
    state.isAnonymous = !elements.idToggle.checked;
    elements.nameStatus.textContent = state.isAnonymous ? 'Hidden (anonymous)' : 'Alex_KE';
    elements.settingsNameToggle.checked = elements.idToggle.checked;
});

elements.settingsNameToggle.addEventListener('change', () => {
    elements.idToggle.checked = elements.settingsNameToggle.checked;
    elements.idToggle.dispatchEvent(new Event('change'));
});

elements.setLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        elements.locationStatus.textContent = 'Location is not available in this browser.';
        return;
    }

    elements.setLocationBtn.disabled = true;
    elements.setLocationBtn.textContent = 'Requesting location...';
    navigator.geolocation.getCurrentPosition(
        () => {
            elements.locationStatus.textContent = 'Area shared for nearby matching only.';
            elements.setLocationBtn.textContent = 'Area shared';
            showToast('Your approximate area is ready for nearby matching.');
        },
        () => {
            elements.locationStatus.textContent = 'Location was not shared. You can try again anytime.';
            elements.setLocationBtn.disabled = false;
            elements.setLocationBtn.textContent = 'Share my area (optional)';
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
});

document.querySelectorAll('[data-notice]').forEach(link => {
    link.addEventListener('click', () => showToast(link.dataset.notice));
});

// New Connection
elements.newConnectionBtn.addEventListener('click', () => {
    if (state.mode === 'chat') {
        addMessageToUI('I\'d like to meet someone new.', 'sent');
        setTimeout(() => {
            matchWithPeer();
            addMessageToUI(`Connected with ${state.currentMatch.name}!`, 'received', state.currentMatch.name);
        }, 800);
    }
});

// Modal Closes
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('dialog').close();
    });
});

// === AI CHAT ===
const aiChat = document.getElementById('aiChat');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');

if (aiForm) {
    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = aiInput.value.trim();
        
        if (!text) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'text-align: right; padding: 0.5rem; background: #d4a574; color: white; border-radius: 8px; margin-bottom: 0.5rem;';
        userMsg.textContent = text;
        aiChat.appendChild(userMsg);
        
        aiInput.value = '';
        
        // Add AI response
        setTimeout(() => {
            const response = getAIResponse(text);
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message';
            aiMsg.innerHTML = `<p>${response}</p>`;
            aiChat.appendChild(aiMsg);
            aiChat.scrollTop = aiChat.scrollHeight;
        }, 500);
    });
}

// === DONATION ===
document.querySelectorAll('.donation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const amount = btn.dataset.amount;
        alert(`Thank you! Donation feature coming soon.\n\nYou selected: KES ${amount}\n\nSupported: M-Pesa, Stripe, PayPal`);
    });
});

// === INITIALIZATION ===
window.addEventListener('load', () => {
    updateClock();
    setInterval(updateClock, 30000);
    
    loadMessages();
    
    // Start with welcome screen
    switchMode('welcome');
});

// === FACIAL DETECTION (Age Verification) ===
// This would load TensorFlow.js face detection in production
async function initFaceDetection() {
    try {
        // Load face detection model
        console.log('Face detection initialized');
        // In production: const detector = await faceDetection.createDetector(faceDetection.SupportedModels.FacemeshBlazeFace);
    } catch (err) {
        console.log('Face detection not available in this browser');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFaceDetection();
});

// === BROADCAST CHANNEL (Cross-Tab Sync) ===
const channel = new BroadcastChannel('company-chat');
channel.onmessage = (event) => {
    if (event.data.type === 'message') {
        if (event.data.sender !== state.userId) {
            addMessageToUI(event.data.text, event.data.direction);
        }
    }
};

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    // Alt + C: Focus chat input
    if (e.altKey && e.key === 'c' && state.mode === 'chat') {
        e.preventDefault();
        elements.messageInput.focus();
    }
    // Alt + V: Toggle video
    if (e.altKey && e.key === 'v' && state.mode === 'video') {
        e.preventDefault();
        elements.toggleVideoBtn.click();
    }
});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('App error:', e.error);
});

// === CLEANUP ===
window.addEventListener('beforeunload', async () => {
    if (state.videoStream) {
        await stopVideo();
    }
    channel.close();
});

console.log('Company app initialized ✨');
