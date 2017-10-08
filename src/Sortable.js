export default class Sortable {
  constructor(count, c) {
    this.ctx = c.getContext('2d');
    this.arr = new Array(count);
    let i=count;
    while(!!i--) this.arr.push(Math.floor(Math.random()*count));
    this.width = c.width;
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
    let avg = b ? (a+b)/2 : a;
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

  draw = (a, b, arr=this.arr) => {
    const { ctx } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,this.boardWidth,this.height);
    let width = this.width/arr.length;
    arr.map((v, i) => {
      const height = (v/arr.length)*this.height;
      ctx.fillStyle = i===a||i===b ? ctx.fillStyle = 'red' : 'blue';
      ctx.fillRect(width*i, this.height-height, width, height);
    });
  }

  drawFlat = () => {
    const arr = this.arr.reduce((a, b) => a.concat(b),[]);
    this.draw(-1, -1, arr);
  }

  bubbleSort = () => {
    let { arr, sorted, draw } = this;
    let i=0, j=1;
    let clock = window.setInterval(()=> {
      draw(i, i+1);
      if(i===0) sorted = true;
      if(arr[i]>arr[i+1]) {
        sorted = false;
        this.playSound(arr[i], arr[i+1]);
        this.swap(i, i+1);
      }
      if(i>=arr.length-j) {
        i=0;
        j++;
        if(j>=arr.length-1||sorted) window.clearInterval(clock);
      } else i++;

    }, 0);
  }

  quickSort = (s=0, e) => {
    if(!e) e=this.arr.length-1;
    if(this.isSorted()) return;
    if(e-s<1) return;
    let oe = e;
    const { arr, draw, swap } = this;
    let pivot = arr[e];
    if(e-s>5) {
      if(arr[e]>arr[e-1]&&arr[e]>arr[e-2]) {
        if(arr[e-2]>arr[e-1]) swap(e-2, e-1);
        swap(e, e-1);
        pivot=arr[e];
      } else if(arr[e]<arr[e-1]&&arr[e]<arr[e-2]) {
        if(arr[e-2]>arr[e-1]) swap(e-1, e-2);
        swap(e, e-1);
        pivot=arr[e];
      }
    }
    let i=s;
    let clock = window.setInterval(()=> {
      draw(i, e);
      if(arr[i]>pivot) {
        this.playSound(arr[i], pivot);
        swap(i,e-1);
        swap(e-1,e);
        --e;
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
    let i=0, h=arr.length-2, l=0;
    let rev = false;
    sorted=true;
    let clock = window.setInterval(() => {
      draw(i, i+1);
      if(arr[i]>arr[i+1]) {
        swap(i, i+1);
        this.playSound(arr[i], arr[i+1]);
        sorted=false;
      }
      if(i>=h&&!rev) {
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

  mergeSort = () => {
    let { arr, drawFlat, playSound } = this;
    for(let i=0;i<arr.length;++i) arr[i] = [arr[i]];
    let j=0;
    arr.unshift([]);
    let clock = window.setInterval(() => {
      if(!arr[j+1].length) {
        arr[j].push(arr[j+2].shift());
      } else if(!arr[j+2].length) {
        arr[j].push(arr[j+1].shift());
      } else if(arr[j+1][0]<arr[j+2][0]) {
        arr[j].push(arr[j+1].shift());
      } else {
        arr[j].push(arr[j+2].shift());
      }
      drawFlat();
      playSound(arr[j][arr[j].length-1]);
      if(!(arr[j+1].length||arr[j+2].length)) {
        if(j<arr.length-4) {
          arr.splice(++j, 1);
        } else if(arr.length>3) {
          arr.splice(j+1, 2);
          j=0;
          arr.unshift([]);
          // console.log(arr);
          // window.clearInterval(clock);
        } else {
          arr = arr[0];
          window.clearInterval(clock);
        }
      }
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
