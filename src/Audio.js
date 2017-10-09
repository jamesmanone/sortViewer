export default class Audio {
  constructor() {
    this.audio = new (window.AudioContext || window.webkitAudioContext);
    this.highpass = this.audio.createBiquadFilter();
    this.highpass.type = 'highpass';
    this.highpass.frequency.value = 100;
    this.highpass.connect(this.audio.destination);
    this.lowpass = this.audio.createBiquadFilter();
    this.lowpass.type = 'lowpass';
    this.lowpass.frequency.value = 2200;
    this.lowpass.connect(this.highpass);
  }

  playSound = freq => {
    let oscillator = this.audio.createOscillator();
    let gain = this.audio.createGain();
    oscillator.connect(gain);
    gain.connect(this.lowpass);
    gain.gain.value = 1;
    oscillator.frequency.value = freq;
    oscillator.type = 'triangle';
    oscillator.start();
    let clock = window.setInterval(() => {
      if(gain.gain.value<0.01) {
        oscillator.stop();
        window.clearInterval(clock);
      } else {
        gain.gain.value *= 0.85;
      }
    }, 4);
  }
}
