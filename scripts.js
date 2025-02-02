const canvas = document.getElementById('sortingCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let arr = [];

function drawArray() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / arr.length;

  arr.forEach((value, i) => {
    ctx.fillStyle = '#3498db';
    ctx.fillRect(i * barWidth, canvas.height, barWidth - 1, -value * 2);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(value, i * barWidth + 5, canvas.height - value * 2 - 5);
  });
}

function resetArray() {
  arr = [];
  drawArray();
}

function applyInput() {
  const inputArray = document.getElementById('inputArray').value;
  arr = inputArray.split(',').map(num => {
    const parsed = parseInt(num.trim(), 10);
    return isNaN(parsed) ? 0 : parsed;
  });
  drawArray();
}

async function startSorting(sortType) {
  const startTime = performance.now();
  switch (sortType) {
    case 'bubbleSort':
      await bubbleSort();
      break;
    case 'quickSort':
      await quickSort(0, arr.length - 1);
      break;
    case 'mergeSort':
      await mergeSort(0, arr.length - 1);
      break;
    case 'selectionSort':
      await selectionSort();
      break;
    case 'insertionSort':
      await insertionSort();
      break;
    default:
      break;
  }
  const endTime = performance.now();
  document.getElementById('timeValue').innerText = (endTime - startTime).toFixed(2);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        drawArray();
        await delay(100); // Adjust the delay as needed
      }
    }
  }
}

async function partition(low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      drawArray();
      await delay(100); // Adjust the delay as needed
    }
  }

  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  drawArray();
  await delay(100); // Adjust the delay as needed

  return i + 1;
}

async function quickSort(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await Promise.all([
      quickSort(low, pivotIndex - 1),
      quickSort(pivotIndex + 1, high)
    ]);
  }
}

async function merge(start, mid, end) {
  const n1 = mid - start + 1;
  const n2 = end - mid;
  const left = new Array(n1);
  const right = new Array(n2);

  for (let i = 0; i < n1; i++) {
    left[i] = arr[start + i];
  }
  for (let j = 0; j < n2; j++) {
    right[j] = arr[mid + 1 + j];
  }

  let i = 0;
  let j = 0;
  let k = start;

  while (i < n1 && j < n2) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    drawArray();
    await delay(100); // Adjust the delay as needed
  }

  while (i < n1) {
    arr[k] = left[i];
    i++;
    k++;
    drawArray();
    await delay(100); // Adjust the delay as needed
  }

  while (j < n2) {
    arr[k] = right[j];
    j++;
    k++;
    drawArray();
    await delay(100); // Adjust the delay as needed
  }
}

async function mergeSort(start, end) {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);
    await Promise.all([
      mergeSort(start, mid),
      mergeSort(mid + 1, end),
      merge(start, mid, end)
    ]);
  }
}

async function selectionSort() {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
      drawArray();
      await delay(100); // Adjust the delay as needed
    }
  }
}

async function insertionSort() {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
    drawArray();
    await delay(100); // Adjust the delay as needed
  }
}

resetArray();
