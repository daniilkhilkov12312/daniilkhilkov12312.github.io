const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const timeEl = document.getElementById("time");
const body = document.body;

// Удалить предыдущие анимации
function clearCanvas(){
  const c = document.getElementById("weather-canvas");
  if (c) c.remove();
}

// Создать canvas для анимации
function makeCanvas(){
  const cv = document.createElement("canvas");
  cv.id = "weather-canvas";
  document.body.appendChild(cv);
  return cv.getContext("2d");
}

// Дождь
function rainAnim(){
  const ctx = makeCanvas();
  const canvas = ctx.canvas;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let drops = [];
  for(let i=0;i<150;i++){
    drops.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, l:Math.random()*20+10, s:Math.random()*4+4});
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "rgba(174,194,224,0.5)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y+d.l);
      ctx.stroke();
      d.y += d.s;
      if(d.y > canvas.height) d.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Снег
function snowAnim(){
  const ctx = makeCanvas();
  const canvas = ctx.canvas;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let flakes = [];
  for(let i=0;i<120;i++){
    flakes.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*3+2, s:Math.random()*1+0.5});
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    flakes.forEach(f=>{
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fill();
      f.y += f.s;
      if(f.y>canvas.height) f.y = -5;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Обновление времени
function updateTime(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  timeEl.innerText = `${hh}:${mm}`;
}

setInterval(updateTime,1000);
updateTime();

// Запрос погоды wttr.in JSON
function updateWeather(){
  fetch("https://wttr.in/Nevodari?format=j1")
    .then(r=>r.json())
    .then(data=>{
      const cur = data.current_condition && data.current_condition[0];
      if(!cur) return;

      const temp = cur.temp_C;
      const iconDesc = cur.weatherDesc[0].value.toLowerCase();

      tempEl.innerText = temp + "°C";
      descEl.innerText = cur.weatherDesc[0].value;

      clearCanvas();

      // фон и анимация
      if(iconDesc.includes("sun") || iconDesc.includes("ясно")){
        body.style.background = "linear-gradient(to top, #4facfe, #00f2fe)";
      }
      else if(iconDesc.includes("cloud") || iconDesc.includes("облачно")){
        body.style.background = "linear-gradient(to top, #bdc3c7, #2c3e50)";
      }
      else if(iconDesc.includes("rain") || iconDesc.includes("дождь")){
        body.style.background = "linear-gradient(to top, #4e5d6c, #1c1c1c)";
        rainAnim();
      }
      else if(iconDesc.includes("snow") || iconDesc.includes("снег")){
        body.style.background = "linear-gradient(to top, #a8c0ff, #3f2b96)";
        snowAnim();
      }
      else {
        body.style.background = "linear-gradient(to top, #bdc3c7, #2c3e50)";
      }
    })
    .catch(e=>{
      console.log("Ошибка погоды:", e);
    });
}

updateWeather();
setInterval(updateWeather,5*60*1000); // обновлять каждые 5 минут
