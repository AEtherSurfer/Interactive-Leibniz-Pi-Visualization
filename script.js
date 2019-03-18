const canvas1 = document.querySelector('#canvas1');
const piTxt = document.querySelector('#pi');
const fpsSlider = document.querySelector('#speedInput');
const fpsTxt = document.querySelector('#speed');
const restartBtn = document.querySelector('#restartBtn');
const maxY = document.querySelector('#maxY');
const minY = document.querySelector('#minY');

const c1 = canvas1.getContext('2d');
const iw = 500;
const ih = 400;

let loop;
let frameRate = 10;
let pi = 4;
let iterations = 0;
let denominator;
let history = [];
let piY;
let vertex = {
  x: null,
  y: null
};
let yConstrain = {
  min: Math.PI - 1,
  max: Math.PI + 1
};

canvas1.width = iw;
canvas1.height = ih;
c1.strokeStyle = 'black';

function yLabelsUpdate() {
  minY.innerText = Math.round(100 * yConstrain.min)/100;
  maxY.innerText = Math.round(100 * yConstrain.max)/100;
}

function zoom(e) {
  if (e.wheelDelta < 0) {
    if (yConstrain.max < Math.PI + 0.1) {
      yConstrain.min -= 0.005;
      yConstrain.max += 0.005;
    } else {
      yConstrain.min -= 0.1;
      yConstrain.max += 0.1;
    }
  } else {
    if (yConstrain.max > 0.1 && yConstrain.min < Math.PI - 0.1) {
      yConstrain.min += 0.1;
      yConstrain.max -= 0.1;
    } else if(yConstrain.max > 0.1 && yConstrain.min < Math.PI - 0.001) {
      yConstrain.min += 0.005;
      yConstrain.max -= 0.005;
    }
  }
  yLabelsUpdate();
}

function changeFPS() {
  frameRate = fpsSlider.value;
  fpsTxt.innerText = 'Speed: ' + frameRate;
  clearInterval(loop);
  loop = setInterval(animate, 1000/frameRate);
}

function restart() {
  pi = 4;
  iterations = 0;
  yConstrain.min = Math.PI - 1;
  yConstrain.max = Math.PI + 1;
  history = [];
}

function scale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function calcPI() {
  denominator = iterations * 2 + 3;
  if (iterations % 2 == 0) {
    pi -= (4 / denominator);
  } else {
    pi += (4 / denominator);
  }
}

function animate() {
  c1.clearRect(0, 0, iw, ih);
  
  calcPI();
  piTxt.innerText = pi;
  
  history.push(pi);
  if (history.length > iw/10) {
    history.shift();
  }
  
  piY = scale(Math.PI, yConstrain.min, yConstrain.max, ih, 0);
  c1.beginPath();
  c1.moveTo(0, piY);
  c1.lineTo(iw, piY);
  c1.stroke();
  c1.closePath();
  
  c1.beginPath();
  for (let i = 1; i < history.length; i++) {
    vertex.x = i * (iw/history.length);
    vertex.y = scale(history[i], yConstrain.min, yConstrain.max, ih, 0);
    if (i == 0) {
      c1.moveTo(vertex.x, vertex.y);
    } else {
      c1.lineTo(vertex.x, vertex.y);
    }
  }
  c1.stroke();
  c1.closePath();
  
  iterations++;
}

console.clear();
yLabelsUpdate();
window.addEventListener('wheel', zoom);
fpsSlider.addEventListener('input', changeFPS);
restartBtn.addEventListener('click', restart);
loop = setInterval(animate, 1000/frameRate);