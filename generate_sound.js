const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'sounds');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const sampleRate = 44100;
const duration = 0.025; 
const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20); // AudioFormat
buffer.writeUInt16LE(1, 22); // NumChannels
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
buffer.writeUInt16LE(2, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

const volume = 15000;
for (let i = 0; i < numSamples; i++) {
  const decay = Math.exp(-i / (sampleRate * 0.006));
  const freq = 1500 * Math.exp(-i / (sampleRate * 0.015));
  const val = Math.floor(volume * decay * Math.sin(2 * Math.PI * freq * (i / sampleRate)));
  // Ensure within 16-bit range
  const boundedVal = Math.max(-32768, Math.min(32767, val));
  buffer.writeInt16LE(boundedVal, 44 + i * 2);
}

fs.writeFileSync(path.join(dir, 'click.wav'), buffer);
console.log('click.wav generated in assets/sounds');
