const SharedArrayBuffer = window.SharedArrayBuffer;

import SortWorker from './worker';
import WorkerWrapper from './WorkerWrapper';

import Queue from './Queue';


export default class Sortable {
  constructor(count, c, audio) {
    this.ctx = c.getContext('2d');
    this.max = parseInt(count);

    this.sab = new SharedArrayBuffer(this.max*4);
    this.arr = new Uint32Array(this.sab);

    let i=this.max;
    while(!!i--) this.arr[i] = Math.floor(Math.random()*count)+1;
    this.width = c.width;
    this.boardWidth = c.width;
    this.height = c.height;
    this.sorted = false;
    this.draw();
    this.audio = audio;
  }

  playSound = (a,b) => {
    let avg = b ? (a+b)/2 : a;
    let freq = ((1100/Math.pow(this.max, 2))*Math.pow(avg, 2))+150;
    this.audio.playSound(freq);
  }

  draw = (...args) => {
    const { ctx, arr } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,this.boardWidth,this.height);
    let width = this.width/arr.length;
    arr.map((v, i) => {
      const height = (v/arr.length)*this.height;
      ctx.fillStyle = args.includes(i) ? ctx.fillStyle = 'red' : 'blue';
      ctx.fillRect(width*i, this.height-height, width, height);
    });
  }

  flatten = (arr=this.arr) => arr.reduce((a, b) => {
    if(!Array.isArray(b) || !Array.isArray(b[0])) return a.concat(b);
    else return a.concat(this.flatten(b));
  }, []);

  drawFlat = () => {
    const arr = this.flatten();
    this.draw(-1, -1, arr);
  }

  bubbleSort = () => {
    const worker = new SortWorker();
    const sab = new SharedArrayBuffer(8);
    const ind = new Uint32Array(sab);

    worker.postMessage({
      type: 'setup',
      buffer: this.sab,
      callbuffer: sab
    });

    const start = performance.now();

    worker.onmessage = ({data}) => {
      if(data == 'sorted') {
        this.sorted == true;
        console.log(performance.now()-start);
        worker.terminate();
      }
    };

    worker.postMessage({type: 'bubbleSort'});

    const animate = () => {
      this.draw(ind[0], ind[1]);
      this.playSound(ind[0], ind[1]);
      if(this.sorted == false) window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }

  quickSort = () => {
    let sab = new SharedArrayBuffer(8),
        ind = new Uint32Array(sab),
        worker = new SortWorker();

    worker.postMessage({
      type: 'setup',
      buffer: this.sab,
      callbuffer: sab
    });

    const start = performance.now();

    worker.onmessage = ({data}) => {
      if(data == 'done') {
        this.sorted = true;
        worker.terminate();
        console.log(performance.now()-start);
      }
    };

    worker.postMessage({type:'quickSort'});

    const animate = () => {
      this.draw(...ind);
      this.playSound(ind[0], ind[1]);
      if(!this.sorted) window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
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
        } else {
          arr = arr[0];
          window.clearInterval(clock);
          this.confirmSort();
        }
      }
    }, 0);
  }

  radixLSD = () => {
    let { arr, playSound, drawFlat, isSortedFlat } = this;
    let i=10, l=1;
    while(!!i--) arr.unshift([]);
    arr.push(arr.splice(10, arr.length-10));
    let clock = window.setInterval(() => {
      let test = arr[10][0].toString();
      test = test.length>=l ? parseInt(test[test.length-l]) : 0;
      playSound(arr[10][0]);
      arr[test].push(arr[10].shift());
      drawFlat();
      if(!arr[10].length) {
        if(arr.length>11) {
          arr.splice(10, 1);
        }
        else if(isSortedFlat()) {
          this.arr = arr.reduce((a, b) => a.concat(b), []);
          window.clearInterval(clock);
        }
        else {
          i=10;
          ++l;
          arr.splice(10, 1);
          while(!!i--) arr.unshift([]);
        }
      }
    }, 0);
  }

  radixMSD = (arr=this.arr, l) => {
    if(l===0) {
      arr=arr.reduce((a,b) => a.concat(b), []);
      return arr;
    }
    let { playSound, drawFlat } = this;
    let i=10;
    while(!!i--) arr.unshift([]);
    if(!l) l=this.max.toString().length;
    // debugger;
    let clock = window.setInterval(() => {
      if(arr[10]) {
        playSound(arr[10]);
        let test = arr[10].toString();
        test = test.length>=l ? parseInt(test[test.length-l]) : 0;
        arr[test].push(arr.splice(10, 1));
        drawFlat();
      }
      if(arr.length<11) {
        window.clearInterval(clock);
        if(l>1) arr.forEach(step => this.radixMSD(step, l-1));
      }
    }, 0);
  }

  insertionSort = () => {
    let { arr, playSound, draw, swap } = this;
    let next=2, left=0, right=1;
    if(arr[left]>arr[right]) swap(left, right);
    const clock = window.setInterval(() => {
      playSound(arr[right], arr[next]);
      draw(right, next);
      if(left<0) {
        arr.unshift(arr.splice(next, 1));
        draw(left, next);
        ++next;
        right=next-1;
        left=right-1;
      } else if(arr[next]>=arr[left]&&arr[next]<=arr[right]) {
        arr.splice(right, 0, arr.splice(next, 1));
        draw(right, left);
        ++next;
        right=next-1;
        left=right-1;
      } else if(arr[next]>arr[right]) {
        draw(right, next);
        ++next;
        right=next-1;
        left=right-1;
      } else {
        --left;
        --right;
      }
      if(next>=arr.length) {
        window.clearInterval(clock);
      }
    }, 0);
  }

  selectionSort = () => {
    let { arr, playSound, draw, swap } = this;
    let sorted=0, i=0, min=0;
    const clock = window.setInterval(() => {
      draw(sorted+1, i);
      playSound(arr[i]);
      if(arr[i]<arr[min]) min=i;
      ++i;
      if(i>=arr.length) {
        swap(sorted, min);
        draw(sorted);
        ++sorted;
        min=i=sorted;
      }
      if(sorted>=arr.length) {
        window.clearInterval(clock);
      }
    }, 0);
  }

  heapsort = () => {
    let { arr, draw, playSound, swap } = this;
    let built = false, heapified=false;
    let length=arr.length-1;
    let i=Math.floor(arr.length/2);
    let j=i;
    let l=i*2+1;
    let r=l+1;
    let large=i;
    const clock = window.setInterval(() => {
      draw(l,r);
      if(l<length&&arr[l]>arr[large]) large=l;
      if(r<length&&arr[r]>arr[large]) large=r;
      if(large!==j) {
        draw(large, j);
        playSound(arr[large], arr[j]);
        swap(large, j);
        j=large;
        l=j*2+1;
        r=l+1;
        large=j;
      } else if(!built) {
        j=--i;
        if(i<0) {
          draw(length, 0);
          playSound(arr[length], arr[0]);
          swap(length, 0);
          j=0;
          built=true;
        }
        l=j*2+1;
        r=l+1;
        large=j;
      } else if (length>0) {
        swap(--length, 0);
        playSound(length, 0);
        draw(length, 0);
        j=0;
        l=j*2+1;
        r=l+1;
        large=j;
      } else {
        window.clearInterval(clock);
      }
    }, 0);
  }

  isSorted = (arr=this.arr) => {
    let i = arr.length;
    while(!!--i) if(arr[i]<arr[i-1]) return false;
    return true;
  }

  isSortedFlat = () => {
    let arr = this.arr.reduce((a,b)=>a.concat(b),[]);
    return this.isSorted(arr);
  }

  confirmSort = () => {
    let i=0;
    const { arr, playSound, draw } = this;
    let clock = window.setInterval(() => {
      if(arr[i]>arr[i+1]) window.clearInterval(clock);
      playSound(arr[i], arr[i]);
      draw(i, i+1);
      if(i>=arr.length-2) window.clearInterval(clock);
    }, 10);
  }

  swap = (a, b) => {
    const { arr, draw } = this;
    [arr[a], arr[b]] = [arr[b], arr[a]];
    draw(a, b);
  }
}
