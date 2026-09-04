const conversation = document.querySelector('#conversation');
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const characterCount = document.querySelector('#character-count');
const promptChips = document.querySelector('#prompt-chips');
const locationButton = document.querySelector('#location-button');
const locationStatus = document.querySelector('#location-status');
const privacyModal = document.querySelector('#privacy-modal');
const checkModal = document.querySelector('#check-modal');
const cameraVideo = document.querySelector('#camera-video');
const cameraPreview = document.querySelector('.camera-preview');
const checkStatus = document.querySelector('#check-status');
const ageConfirm = document.querySelector('#age-confirm');
const aiModal = document.querySelector('#ai-modal');
const aiConsent = document.querySelector('#ai-consent');
const idToggle = document.querySelector('#id-toggle');
const idLabel = document.querySelector('.id-toggle');
const userIdValue = document.querySelector('#user-id-value');
let cameraStream;
const chatChannel = 'BroadcastChannel' in window ? new BroadcastChannel('company-chat') : null;
const savedMessages = JSON.parse(localStorage.getItem('company-messages') || '[]');

// Keep the clock useful without relying on a server or a user account.
function updateClock() {
  document.querySelector('#clock').textContent = new Intl.DateTimeFormat([], {
    hour: 'numeric', minute: '2-digit'
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 30000);

function addMessage(text, type = 'sent') {
  const row = document.createElement('div');
  row.className = `message-row ${type}`;
  const now = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date());
  row.innerHTML = type === 'sent'
    ? `<div><div class="message-bubble"><p></p></div><time>${now}</time></div>`
    : `<span class="avatar tiny-avatar">M</span><div><div class="message-bubble"><p></p></div><time>${now}</time></div>`;
  row.querySelector('p').textContent = text;
  conversation.insertBefore(row, promptChips);
  conversation.scrollTop = conversation.scrollHeight;
}

function saveMessage(text, type) {
  const messages = JSON.parse(localStorage.getItem('company-messages') || '[]');
  messages.push({ text, type });
  localStorage.setItem('company-messages', JSON.stringify(messages.slice(-40)));
}

// Restore this browser's conversation and mirror new messages to another open tab.
savedMessages.forEach(({ text, type }) => addMessage(text, type));
chatChannel?.addEventListener('message', ({ data }) => {
  if (data?.source !== 'company' || !data.text) return;
  addMessage(data.text, data.type || 'sent');
});

function replyTo(message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('heard') || lowerMessage.includes('feel')) return 'I’m listening. You can take your time and start anywhere.';
  if (lowerMessage.includes('distract')) return 'Okay. Important question: what is a small, oddly specific thing you enjoy?';
  if (lowerMessage.includes('stay')) return 'I’m here. No pressure to fill the silence.';
  return 'Thank you for telling me. I’m here with you for this moment.';
}

function sendMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;
  addMessage(cleanText);
  saveMessage(cleanText, 'sent');
  chatChannel?.postMessage({ source: 'company', text: cleanText, type: 'sent' });
  input.value = '';
  characterCount.textContent = '0 / 500';
  promptChips.hidden = true;
  window.setTimeout(() => {
    const reply = replyTo(cleanText);
    addMessage(reply, 'received');
    saveMessage(reply, 'received');
    chatChannel?.postMessage({ source: 'company', text: reply, type: 'received' });
  }, 650);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage(input.value);
});
input.addEventListener('input', () => {
  characterCount.textContent = `${input.value.length} / 500`;
});
promptChips.addEventListener('click', (event) => {
  if (event.target.matches('button')) sendMessage(event.target.textContent);
});
document.querySelector('#new-connection').addEventListener('click', () => {
  addMessage('I’d like to meet someone new.', 'sent');
  window.setTimeout(() => addMessage('I’ll look for a kind, open conversation for you.', 'received'), 650);
});

document.querySelector('#settings-button').addEventListener('click', () => privacyModal.showModal());
document.querySelectorAll('.modal-close, .modal-close-action, #skip-check').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('dialog').close();
    if (button.id === 'skip-check') checkStatus.textContent = 'Skipped. You can try this again anytime.';
  });
});
document.querySelector('#check-button').addEventListener('click', () => checkModal.showModal());
document.querySelector('#video-button').addEventListener('click', () => checkModal.showModal());
document.querySelector('#ai-button').addEventListener('click', () => aiModal.showModal());
document.querySelector('#start-ai').addEventListener('click', () => {
  if (!aiConsent.checked) return;
  aiModal.close();
  addMessage('I’m here as your AI guide. Would you like to be heard, find a next small step, or simply have company?', 'received');
});
idToggle.addEventListener('change', () => {
  idLabel.classList.toggle('is-visible', idToggle.checked);
  userIdValue.textContent = idToggle.checked ? 'guest-4821' : 'blurred';
});

// Geolocation is requested only after the user explicitly asks for a nearby match.
locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = 'unavailable';
    return;
  }
  locationStatus.textContent = 'checking...';
  navigator.geolocation.getCurrentPosition(
    () => { locationStatus.textContent = 'area set'; },
    () => { locationStatus.textContent = 'skipped'; },
    { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
  );
});

document.querySelector('#start-camera').addEventListener('click', async () => {
  if (!ageConfirm.checked) {
    checkStatus.textContent = 'Please confirm that you are 18 or older, or skip this check.';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    checkStatus.textContent = 'Camera access is unavailable in this browser.';
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    cameraVideo.srcObject = cameraStream;
    cameraPreview.classList.add('active');
    checkStatus.textContent = 'Camera connected. This preview stays on your device.';
  } catch {
    checkStatus.textContent = 'Camera check skipped. No image was captured.';
  }
});
checkModal.addEventListener('close', () => {
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = undefined;
  cameraVideo.srcObject = null;
  cameraPreview.classList.remove('active');
});
