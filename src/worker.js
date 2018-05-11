/* eslint no-constant-condition: 0*/

let buffer, arr, callbuffer, callback;

const sleep = (ms) => {
  const start = performance.now();
  while (1 < 2) {
    if ((performance.now() - start) > ms){
      break;
    }
  }
}

const setup = data => {
  buffer = data.buffer;
  callbuffer = data.callbuffer;
  arr = new Uint32Array(buffer);
  callback = new Uint32Array(callbuffer);
};

const swap = (a, b) => [arr[a], arr[b]] = [arr[b], arr[a]];

const isSorted = (s=0, e) => {
  if(!e) e = arr.length;
  while(--e > s) if(arr[e]<arr[e-1]) return false;
  return true;
};

const bubbleSort = () => {
  let sorted, j=2;
  while(!sorted) {
    sorted = true;
    for(let i=0;i<arr.length-j;++i) {
      callback[0] = i;
      callback[1] = i+1;
      if(arr.length<5000) sleep(.000001)
      if(arr[i]>arr[i+1]) {
        swap(i, i+1);
        sorted = false;
      }
    }
    ++j;
  }
  self.postMessage('sorted');
};

const coctailShaker = () => {
  let s = 0,
      e = arr.length - 1,
      sorted = false;

  while(!sorted && s < e) {
    sorted = true;
    let i = s;

    for(;i<e-1;i++) {
      callback[0] = i;
      callback[1] = i+1;
      // sleep(.00001);
      if(arr[i]>arr[i+1]) {
        sorted = false;
        swap(i, i+1);
      }
    }

    e--;

    for(;i>s;i--) {
      callback[0] = i-1;
      callback[1] = i;
      if(arr.length<5000) sleep(.00001);
      if(arr[i]<arr[i-1]) {
        sorted = false;
        swap(i, i-1);
      }
    }

    s++;
  }
  self.postMessage('done');
}

const qsBubble = (s, e) => {
  e++;
  while(--e>s) {
    for(let i=s;i<e;i++) {
      callback[0] = i;
      callback[1] = i+1;
      if(arr[i]>arr[i+1]) {
        swap(i, i+1);
      }
    }
  }
};

const quickSort = (s=0, e) => {
  if(!e) e=arr.length-1;
  //if(isSorted(s, e)) return;
  if(e-s<1) return;

  let pivot = arr[e];
  if(e-s<25) return qsBubble(s, e);

  let oe = e;
  let i=s;
  while(i<e) {
    callback[0] = i;
    callback[1] = e;
    if(arr.length<30000) sleep(.000001);  // slow down so I can see
    if(arr[i]>pivot) {
      swap(i,e-1);
      swap(e-1,e);
      --e;
    }
    else ++i;
  }

  if(e>1) quickSort(s, e-1);
  if(e<oe) quickSort(e+1, oe);
  if(s==0 && oe == arr.length-1) self.postMessage('done');
};



self.addEventListener('message', ({data}) => {
  switch(data.type) {
    case 'setup':
      setup(data);
      break;
    case 'bubbleSort':
      bubbleSort();
      break;
    case 'coctailShaker':
      coctailShaker();
      break;
    case 'quickSort':
      quickSort(data.s, data.e);
      break;
  }
})
