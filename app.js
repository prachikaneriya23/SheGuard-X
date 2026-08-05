// 1. Initialize Supabase (REPLACE WITH YOUR ACTUAL SUPABASE KEYS)
const SUPABASE_URL = 'https://lpiclnzjpdasbkxnhtqj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwaWNsbnpqcGRhc2JreG5odHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDEwMTMsImV4cCI6MjEwMTUxNzAxM30.wmjIY1YBAAKXyCbAm4SWQJSuTYUINVQ4JQod6S5uLXw';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker Active'))
      .catch((err) => console.error('SW Error:', err));
  });
}

// 3. Audio Recorder Logic
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

function handleMicClick() {
  if (!isRecording) {
    startRecording();
    isRecording = true;
    if (typeof updateMicUI === 'function') updateMicUI(true);
  } else {
    stopRecording();
    isRecording = false;
    if (typeof updateMicUI === 'function') updateMicUI(false);
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
    // 1. Create audio blob and set filename
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const fileName = `rec_${Date.now()}.webm`;

    // 2. Automatically download recording to user's device
    const downloadUrl = URL.createObjectURL(audioBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up temporary local link
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);

    // 3. Upload to Supabase Storage
    try {
        const { data, error } = await supabase.storage
            .from('audio-recordings')
            .upload(fileName, audioBlob, { contentType: 'audio/webm' });

        if (error) throw error;
        alert('Recording saved to device & uploaded to cloud!');
    } catch (err) {
        alert('Upload Error: ' + err.message);
    }
};

    mediaRecorder.start();
  } catch (err) {
    alert('Microphone access error: ' + err.message);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

// 4. Trigger SOS SMS via Vercel Backend
function sendSOS(phone) {
  if (!navigator.geolocation) return alert('GPS unavailable');

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const res = await fetch('/api/send-sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        contactNumber: phone
      })
    });

    const data = await res.json();
    if (data.success) alert('SOS SMS Dispatched!');
    else alert('SOS Error: ' + data.error);
  });
}