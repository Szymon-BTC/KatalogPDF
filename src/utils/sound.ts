/**
 * Web Audio API synthesized paper page turn sound effect
 */
let audioCtx: AudioContext | null = null;

export function playPageTurnSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    if (audioCtx.state !== 'running') return;

    const duration = 0.28;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    if (bufferSize <= 0) return;

    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Create realistic paper rustle noise
    for (let i = 0; i < bufferSize; i++) {
      // White noise with subtle modulation
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * Math.pow(envelope, 1.8);
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    // Filter to sound like soft paper sliding / flexing
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    const now = audioCtx.currentTime;
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Gain envelope
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start(now);
  } catch (err) {
    // Ignore audio context errors gracefully
  }
}

