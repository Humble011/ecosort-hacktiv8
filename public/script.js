lucide.createIcons();

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const fileInput = document.getElementById('file-input');
const btnAttach = document.getElementById('btn-attach');
const btnReset = document.getElementById('btn-reset');
const btnSend = document.getElementById('btn-send');
const filePreview = document.getElementById('file-preview');
const previewName = document.getElementById('preview-name');
const previewSize = document.getElementById('preview-size');
const previewIcon = document.getElementById('preview-icon');
const previewThumb = document.getElementById('preview-thumb');
const btnRemoveFile = document.getElementById('btn-remove-file');
const welcomeBanner = document.getElementById('welcome-banner');

const btnTheme = document.getElementById('btn-theme');
const themeIcon = document.getElementById('theme-icon');

function initTheme() {
  const savedTheme = localStorage.getItem('ecosort_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    document.documentElement.classList.remove('dark');
    themeIcon.setAttribute('data-lucide', 'moon');
  }
  lucide.createIcons();
}

btnTheme.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  if (isDark) {
    localStorage.setItem('ecosort_theme', 'dark');
    themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    localStorage.setItem('ecosort_theme', 'light');
    themeIcon.setAttribute('data-lucide', 'moon');
  }
  lucide.createIcons();
});

initTheme();

let selectedFile = null;

// Sinkronisasi riwayat chat API dan tampilan di localStorage
let chatHistory = JSON.parse(localStorage.getItem('ecosort_api_history') || '[]');
let chatUIHistory = JSON.parse(localStorage.getItem('ecosort_ui_history') || '[]');

function saveToLocalStorage() {
  localStorage.setItem('ecosort_api_history', JSON.stringify(chatHistory));
  localStorage.setItem('ecosort_ui_history', JSON.stringify(chatUIHistory));
}

function loadSavedChatUI() {
  if (chatUIHistory.length > 0) {
    if (welcomeBanner) welcomeBanner.style.display = 'none';

    chatUIHistory.forEach(item => {
      if (item.sender === 'user') {
        appendUserMessage(item.text, item.fileName, item.fileType, false);
      } else if (item.sender === 'bot') {
        appendBotMessage(item.text, false);
      }
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

btnAttach.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validasi durasi berkas audio maksimal 60 detik
  if (file.type.startsWith('audio/')) {
    const audioTest = document.createElement('audio');
    audioTest.preload = 'metadata';
    audioTest.src = URL.createObjectURL(file);

    audioTest.onloadedmetadata = () => {
      URL.revokeObjectURL(audioTest.src);
      if (audioTest.duration > 60) {
        alert('Durasi audio maksimal 1 menit.');
        clearAttachment();
        return;
      }
      setAttachmentPreview(file);
    };
    return;
  }

  setAttachmentPreview(file);
});

function setAttachmentPreview(file) {
  // Batas ukuran berkas maksimal 10MB
  if (file.size > 10 * 1024 * 1024) {
    alert('Batas ukuran file maksimal adalah 10MB.');
    clearAttachment();
    return;
  }

  selectedFile = file;
  previewName.textContent = file.name;
  previewSize.textContent = `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewThumb.src = e.target.result;
      previewThumb.classList.remove('hidden');
      previewIcon.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    previewThumb.classList.add('hidden');
    previewThumb.src = '';
    previewIcon.classList.remove('hidden');

    let iconName = 'file';
    if (file.type.startsWith('audio/')) iconName = 'music';
    else if (file.type === 'application/pdf') iconName = 'file-text';

    previewIcon.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
    lucide.createIcons();
  }

  filePreview.classList.remove('hidden');
  filePreview.classList.add('flex');
}

btnRemoveFile.addEventListener('click', clearAttachment);

function clearAttachment() {
  selectedFile = null;
  fileInput.value = '';
  if (previewThumb) {
    previewThumb.src = '';
    previewThumb.classList.add('hidden');
  }
  if (previewIcon) {
    previewIcon.innerHTML = '';
  }
  filePreview.classList.add('hidden');
  filePreview.classList.remove('flex');
}

// Penanganan submit formulir dan pengiriman muatan ke server
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text && !selectedFile) return;

  if (welcomeBanner) welcomeBanner.style.display = 'none';

  const fileName = selectedFile ? selectedFile.name : null;
  const fileType = selectedFile ? selectedFile.type : null;

  const localImgUrl = (selectedFile && fileType && fileType.startsWith('image/')) ? URL.createObjectURL(selectedFile) : null;
  appendUserMessage(text, fileName, fileType, localImgUrl, true);

  const payload = new FormData();
  if (text) payload.append('message', text);
  if (selectedFile) payload.append('file', selectedFile);
  payload.append('history', JSON.stringify(chatHistory));

  const textForHistory = text || (selectedFile ? `Mengunggah berkas: ${selectedFile.name}` : '');

  input.value = '';
  clearAttachment();
  toggleFormState(false);

  const botLoadingEl = appendBotLoading();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: payload
    });

    const data = await res.json();

    if (res.ok && data.reply) {
      renderFormattedReply(botLoadingEl, data.reply);

      chatHistory.push({
        role: 'user',
        parts: [{ text: textForHistory }]
      });
      chatHistory.push({
        role: 'model',
        parts: [{ text: data.reply }]
      });

      chatUIHistory.push({
        sender: 'bot',
        text: data.reply
      });

      saveToLocalStorage();
    } else {
      renderErrorMessage(botLoadingEl, data.message || 'Terjadi gangguan saat memproses permintaan.');
    }
  } catch (err) {
    renderErrorMessage(botLoadingEl, 'Koneksi ke server gagal. Periksa koneksi internet atau server backend.');
  } finally {
    toggleFormState(true);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function toggleFormState(enabled) {
  input.disabled = !enabled;
  btnSend.disabled = !enabled;
  btnAttach.disabled = !enabled;
  if (enabled) input.focus();
}

function appendUserMessage(text, fileName, fileType, fileData = null, saveToHistory = false) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = 'flex justify-end';

  let fileSnippet = '';
  if (fileName) {
    const isImg = fileType && fileType.startsWith('image/');
    const isAudio = fileType && fileType.startsWith('audio/');

    if (isImg && fileData) {
      fileSnippet = `
        <div class="mb-2 overflow-hidden rounded-xl bg-black/10">
          <img src="${fileData}" alt="${escapeHtml(fileName)}" class="w-48 h-36 md:w-56 md:h-40 object-cover rounded-xl border border-emerald-400/40" />
        </div>
      `;
    } else {
      const icon = isAudio ? 'volume-2' : 'paperclip';
      fileSnippet = `
        <div class="mb-2 inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-400/30 px-2.5 py-1.5 rounded-lg text-xs">
          <i data-lucide="${icon}" class="w-3.5 h-3.5 text-emerald-200"></i>
          <span class="truncate max-w-[220px] text-emerald-50 font-medium">${escapeHtml(fileName)}</span>
        </div>
      `;
    }
  }

  msgWrapper.innerHTML = `
    <div class="max-w-[85%] md:max-w-[70%] bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-3 shadow-md">
      ${fileSnippet}
      ${text ? `<p class="text-sm leading-relaxed whitespace-pre-wrap">${escapeHtml(text)}</p>` : ''}
    </div>
  `;

  chatBox.appendChild(msgWrapper);
  lucide.createIcons();
  chatBox.scrollTop = chatBox.scrollHeight;

  if (saveToHistory) {
    chatUIHistory.push({
      sender: 'user',
      text: text,
      fileName: fileName,
      fileType: fileType,
      fileData: fileType && fileType.startsWith('image/') ? fileData : null
    });
    saveToLocalStorage();
  }
}

function appendBotMessage(markdownText) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = 'flex gap-3 max-w-[85%] md:max-w-[75%]';

  msgWrapper.innerHTML = `
    <div class="w-8 h-8 rounded-xl overflow-hidden logo-box flex items-center justify-center shrink-0 p-0.5 shadow-sm border">
      <img src="ecosort-ai.png" alt="EcoSort Bot" class="w-full h-full object-contain" />
    </div>
    <div class="bot-content bot-bubble-wrapper rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm"></div>
  `;

  const botContent = msgWrapper.querySelector('.bot-content');
  renderFormattedReply(botContent, markdownText);
  chatBox.appendChild(msgWrapper);
  lucide.createIcons();
}

function appendBotLoading() {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = 'flex gap-3 max-w-[85%] md:max-w-[75%]';

  msgWrapper.innerHTML = `
    <div class="w-8 h-8 rounded-xl overflow-hidden logo-box flex items-center justify-center shrink-0 p-0.5 shadow-sm border">
      <img src="ecosort-ai.png" alt="EcoSort Bot" class="w-full h-full object-contain" />
    </div>
    <div class="bot-content bot-bubble-wrapper rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm">
      <div class="flex items-center gap-1.5 py-1">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  `;

  chatBox.appendChild(msgWrapper);
  lucide.createIcons();
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgWrapper.querySelector('.bot-content');
}

function renderFormattedReply(element, markdownText) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const parsedHtml = marked.parse(markdownText);
  element.innerHTML = `<div class="prose-chat text-sm leading-relaxed">${parsedHtml}</div>`;
}

function renderErrorMessage(element, message) {
  element.innerHTML = `
    <div class="flex items-start gap-2.5 text-rose-600 dark:text-rose-400">
      <i data-lucide="alert-triangle" class="w-5 h-5 shrink-0 mt-0.5"></i>
      <div class="flex-1">
        <p class="font-medium text-xs md:text-sm leading-relaxed">${escapeHtml(message)}</p>
        <button type="button" onclick="location.reload()" class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 hover:underline cursor-pointer">
          <i data-lucide="refresh-cw" class="w-3 h-3"></i> Muat Ulang Halaman
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

document.querySelectorAll('.quick-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    input.value = chip.textContent.trim();
    form.dispatchEvent(new Event('submit'));
  });
});

btnReset.addEventListener('click', () => {
  chatHistory = [];
  chatUIHistory = [];
  localStorage.removeItem('ecosort_api_history');
  localStorage.removeItem('ecosort_ui_history');

  chatBox.innerHTML = '';
  if (welcomeBanner) {
    welcomeBanner.style.display = 'block';
    chatBox.appendChild(welcomeBanner);
  }
  clearAttachment();
});

loadSavedChatUI();

// Penanganan perekaman audio menggunakan MediaRecorder dan timer indikator
const btnMic = document.getElementById('btn-mic');
const recordingTimer = document.getElementById('recording-timer');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let mediaStream = null;
let timerInterval = null;
let recordingSeconds = 0;

function updateTimerDisplay() {
  const mins = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
  const secs = String(recordingSeconds % 60).padStart(2, '0');
  if (recordingTimer) {
    recordingTimer.textContent = `${mins}:${secs}`;
  }
}

function resetRecordingState() {
  isRecording = false;
  clearInterval(timerInterval);
  timerInterval = null;
  recordingSeconds = 0;

  if (recordingTimer) {
    recordingTimer.classList.add('hidden');
    recordingTimer.textContent = '00:00';
  }

  if (btnMic) {
    btnMic.classList.remove('text-rose-500', 'animate-pulse');
    btnMic.classList.add('text-gray-500');
    btnMic.innerHTML = '<i data-lucide="mic" class="w-5 h-5"></i>';
    btnMic.setAttribute('title', 'Rekam Suara');
    lucide.createIcons();
  }
}

if (btnMic) {
  btnMic.addEventListener('click', async (e) => {
    e.preventDefault();

    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Browser Anda tidak mendukung perekaman audio.');
        return;
      }

      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorder = new MediaRecorder(mediaStream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }

        const recordedDuration = recordingSeconds;
        resetRecordingState();

        // Abaikan rekaman jika berdurasi di bawah satu detik
        if (audioChunks.length === 0 || recordedDuration < 1) {
          return;
        }

        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const recordedFile = new File([audioBlob], `rekaman-${Date.now()}.${ext}`, { type: mimeType });

        setAttachmentPreview(recordedFile);
      };

      mediaRecorder.start();
      isRecording = true;

      recordingSeconds = 0;
      updateTimerDisplay();
      if (recordingTimer) recordingTimer.classList.remove('hidden');

      timerInterval = setInterval(() => {
        recordingSeconds++;
        updateTimerDisplay();

        // Batas maksimal rekaman 60 detik
        if (recordingSeconds >= 60) {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }
      }, 1000);

      btnMic.classList.remove('text-gray-500');
      btnMic.classList.add('text-rose-500', 'animate-pulse');
      btnMic.innerHTML = '<i data-lucide="square" class="w-5 h-5"></i>';
      btnMic.setAttribute('title', 'Klik untuk berhenti merekam');
      lucide.createIcons();

    } catch (err) {
      console.error('Mic Error:', err);
      resetRecordingState();
      alert('Gagal mengakses mikrofon. Pastikan mikrofon aktif dan izin akses telah diberikan.');
    }
  });
}