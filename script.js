const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const timeEl = document.getElementById("time");
const body = document.body;

// Удаляет старую анимацию
function clearCanvas(){
  const c = document.getElementById("weather-canvas");
  if(c) c.remove();
}

// Создаёт canvas для анимаций
function makeCanvas(){
  const cv = document.createElement("canvas");
  cv.id = "weather-canvas";
  document.body.appendChild(cv);
  return cv.getContext("2d");
}

// ЗВЁЗДЫ
function starsAnim(){
  const ctx = makeCanvas();
  const canvas = ctx.canvas;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const stars = [];
  for(let i=0;i<150;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.5+0.5,
      tw: Math.random()*Math.PI*2
    });
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    stars.forEach(s=>{
      const flick = 0.5 + 0.5*Math.sin(Date.now()/300 + s.tw);
      ctx.globalAlpha = flick;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ДОЖДЬ
function rainAnim(){
  const ctx = makeCanvas();
  const canvas = ctx.canvas;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let drops = [];
  for(let i=0;i<200;i++){
    drops.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      l:Math.random()*15+10,
      s:Math.random()*4+4
    });
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "rgba(174,194,224,0.5)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    drops.forEach(d=>{
      ctx.beginPath();
      ctx.moveTo(d.x,d.y);
      ctx.lineTo(d.x,d.y+d.l);
      ctx.stroke();
      d.y += d.s;
      if(d.y>canvas.height) d.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// СНЕГ
function snowAnim(){
  const ctx = makeCanvas();
  const canvas = ctx.canvas;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  let flakes = [];
  for(let i=0;i<150;i++){
    flakes.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*3+2,
      s:Math.random()*1+0.5
    });
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    flakes.forEach(f=>{
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fill();
      f.y += f.s;
      if(f.y>canvas.height) f.y=-5;
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
setInterval(updateTime, 1000);
updateTime();

// Погода через wttr.in
function updateWeather(){
  fetch("https://wttr.in/Nevodari?format=j1")
    .then(r=>r.json())
    .then(data=>{
      const cur = data.current_condition && data.current_condition[0];
      if(!cur) return;

      const temp = cur.temp_C;
      const desc = cur.weatherDesc[0].value.toLowerCase();

      tempEl.innerText = `${temp}°C`;
      descEl.innerText = cur.weatherDesc[0].value;

      clearCanvas();

      if(desc.includes("sun") || desc.includes("ясно")){
        body.style.background = "linear-gradient(to top,#0b3d91,#58a0ff)";
        starsAnim();
      }
      else if(desc.includes("cloud") || desc.includes("облачно")){
        body.style.background = "linear-gradient(to top,#888,#444)";
      }
      else if(desc.includes("rain") || desc.includes("дождь")){
        body.style.background = "linear-gradient(to top,#4e5d6c,#1c1c1c)";
        rainAnim();
      }
      else if(desc.includes("snow") || desc.includes("снег")){
        body.style.background = "linear-gradient(to top,#a8c0ff,#3f2b96)";
        snowAnim();
      }
      else {
        body.style.background = "linear-gradient(to top,#0c1220,#1a1a40)";
      }
    })
    .catch(e=>console.log("Ошибка погоды:",e));
}

updateWeather();
setInterval(updateWeather, 5*60*1000);

function updateBackgroundByTime() {
  const hour = new Date().getHours();

  if (hour >= 19 || hour < 6) {
    // НОЧЬ
    document.body.style.background =
      "linear-gradient(to top, #020111, #0b1d3a)";
    startStars(); // звезды
  } 
  else if (hour >= 6 && hour < 12) {
    // УТРО
    document.body.style.background =
      "linear-gradient(to top, #fbc2eb, #a6c1ee)";
  } 
  else if (hour >= 12 && hour < 15) {
    // ДЕНЬ
    document.body.style.background =
      "linear-gradient(to top, #4facfe, #00f2fe)";
  } 
  else {
    // ВЕЧЕР
    document.body.style.background =
      "linear-gradient(to top, #fa709a, #fee140)";
  }
}

updateBackgroundByTime();
setInterval(updateBackgroundByTime, 60 * 1000);

