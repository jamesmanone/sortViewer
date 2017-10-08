import Sortable from './Sortable';

function showSort(sortType) {
  const arr = new Sortable(
    document.getElementById('count').value,
    document.getElementById('board')
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
  }
}


document.getElementById('bubble').addEventListener('click', () => showSort('bubble'));
document.getElementById('quick').addEventListener('click', () => showSort('quick'));
document.getElementById('cocktail').addEventListener('click', () => showSort('cocktail'));
document.getElementById('merge').addEventListener('click', () => showSort('merge'));
document.getElementById('radix-lsd').addEventListener('click', () => showSort('radixLSD'));
document.getElementById('radix-msd').addEventListener('click', () => showSort('radixMSD'));
