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
  }
}


document.getElementById('bubble').addEventListener('click', () => showSort('bubble'));
document.getElementById('quick').addEventListener('click', () => showSort('quick'));
document.getElementById('cocktail').addEventListener('click', () => showSort('cocktail'));