const canvas = document.createElement("canvas");
canvas.id = "weather-canvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener('resize', ()=>{
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

// Звёзды
function createStars(count){
  const arr = [];
  for(let i=0;i<count;i++){
    arr.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.5+0.5,
      phase: Math.random()*Math.PI*2
    });
  }
  return arr;
}

let stars = createStars(200);

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(s=>{
    const alpha = 0.5 + 0.5*Math.sin(Date.now()/1000 + s.phase); // медленное мерцание
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

// Вызов
drawStars();

// При обновлении страницы звезды создаются заново, меняя своё положение
