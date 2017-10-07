export default class Sortable {
  constructor(count, c) {
    this.ctx = c.getContext('2d');
    this.arr = new Array(count);
    let i=count;
    while(!!i--) this.arr.push(Math.floor(Math.random()*count));
    this.width = c.width/this.arr.length;
    this.boardWidth = c.width;
    this.height = c.height;
    this.sorted = false;
    this.draw();
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audio = new AudioContext();
    this.lowpass = this.audio.createBiquadFilter();
    this.lowpass.type = 'lowpass';
    this.lowpass.frequency.value = 5000;
    this.highpass = this.audio.createBiquadFilter();
    this.highpass.type = 'highpass';
    this.highpass.frequency.value = 100;
    this.highpass.connect(this.audio.destination);
    this.lowpass.connect(this.highpass);
  }

  playSound = (a,b) => {
    let avg = (a+b)/2;
    let osc = this.audio.createOscillator();
    let gain = this.audio.createGain();
    gain.gain.value=1;
    gain.connect(this.lowpass);
    osc.connect(gain);
    osc.frequency.value = ((3000/this.arr.length)*avg)+150;
    osc.start();
    window.setTimeout(()=>{
      let clock = window.setInterval(()=>{
        if(gain.gain.value > 0) gain.gain.value-=0.05;
        else {
          osc.stop();
          window.clearInterval(clock);
        }
      }, 3);
    }, 4);
  }

  draw = (a, b) => {
    const { ctx, width, arr } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,this.boardWidth,this.height);
    arr.map((v, i) => {
      const height = (v/arr.length)*this.height;
      ctx.fillStyle = i===a||i===b ? ctx.fillStyle = 'red' : 'blue';
      ctx.fillRect(width*i, this.height-height, width, height);
    });
  }

  bubbleSort = () => {
    let { arr, sorted, draw } = this;
    let i=0, j=0;
    let clock = window.setInterval(()=> {
      draw( i, i+1);
      if(i===0) sorted = true;
      if(arr[i]>arr[i+1]) {
        sorted = false;
        this.playSound(arr[i], arr[i+1]);
        this.swap(i, i+1);
      }
      if(i>=arr.length-1-j) {
        i=0;
        j++;
        if(j>=arr.length-1||sorted) window.clearInterval(clock);
      }
      i = i>arr.length-2 ? 0 : i+1;

    }, 0);
  }

  quickSort = (s=0, e) => {
    if(this.isSorted()) return;
    if(!e) e = this.arr.length-1;
    if(e-s<1) return;
    let oe = e;
    const { arr, draw, swap } = this;
    let pivot = arr[e];
    let i=s;
    let clock = window.setInterval(()=> {
      draw(i, e);
      if(arr[i]>pivot) {
        this.playSound(arr[i], arr[e]);
        swap(i,e-1);
        swap(e, e-1);
        e--;
      }
      else ++i;
      if(i>=e) {
        window.clearInterval(clock);
        this.quickSort(s, e-1);
        if(e<arr.length-1) this.quickSort(e+1, oe);
      }
    }, 0);
    return;
  }

  coctailShaker = () => {
    let { arr, sorted, draw, swap } = this;
    let i=0, h=arr.length-1, l=0;
    let rev = false;
    sorted=true;
    let clock = window.setInterval(() => {
      draw(i, i+1);
      if(arr[i]>arr[i+1]) {
        swap(i, i+1);
        this.playSound(arr[i], arr[i+1]);
        sorted=false;
      }
      if(i>=h-1&&!rev) {
        if(sorted) window.clearInterval(clock);
        rev=true;
        sorted=true;
        --h;
      }
      if(i<=l&&rev) {
        if(sorted) window.clearInterval(clock);
        rev=false;
        sorted=true;
        ++l;
      }
      if(rev) --i;
      else ++i;
    }, 0);
  }

  isSorted = () => {
    let { arr } = this;
    let i = arr.length;
    while(!!--i) if(arr[i]<arr[i-1]) return false;
    return true;
  }

  swap = (a, b) => {
    const { arr, draw } = this;
    [arr[a], arr[b]] = [arr[b], arr[a]];
    draw(a, b);
  }
}
