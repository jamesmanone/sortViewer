import Sortable from './Sortable';
import WorkerSortable from './WorkerSortable';
import Audio from './Audio';


const audio = new Audio();
const board = document.getElementById('board');


function showSort(sortType) {
  board.width = window.innerWidth-5;
  board.height = window.innerHeight-30;
  let arr;
  if(!window.SharedArrayBuffer) arr = new Sortable(
    document.getElementById('count').value,
    board,
    audio
  );
  else arr = new WorkerSortable(
    document.getElementById('count').value,
    board,
    audio
  );
  switch(sortType) {
    case 'bubble':
      arr.bubbleSort();
      break;
    case 'quick':
      arr.quickSort();
      break;
    case 'cocktail':
      arr.coctailShaker();
      break;
    case 'merge':
      arr.mergeSort();
      break;
    case 'radixLSD':
      arr.radixLSD();
      break;
    case 'radixMSD':
      arr.radixMSD();
      break;
    case 'insertion':
      arr.insertionSort();
      break;
    case 'selection':
      arr.selectionSort();
      break;
    case 'heap':
      arr.heapsort();
      break;
  }
}


document.getElementById('bubble').addEventListener('click', () => showSort('bubble'));
document.getElementById('quick').addEventListener('click', () => showSort('quick'));
document.getElementById('cocktail').addEventListener('click', () => showSort('cocktail'));
document.getElementById('merge').addEventListener('click', () => showSort('merge'));
document.getElementById('radix-lsd').addEventListener('click', () => showSort('radixLSD'));
document.getElementById('radix-msd').addEventListener('click', () => showSort('radixMSD'));
document.getElementById('insertion').addEventListener('click', () => showSort('insertion'));
document.getElementById('selection').addEventListener('click', () => showSort('selection'));
document.getElementById('heap').addEventListener('click', () => showSort('heap'));
document.getElementById('count').addEventListener('click', () => showSort('count'));
