// Элементы на странице
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const body = document.body;

// Координаты Нэводари
const latitude = 44.3167;
const longitude = 28.6;

// Очистка анимаций
function clearAnimations() {
  body.className = ''; // убираем все классы
  const oldCanvas = document.getElementById('weather-canvas');
  if (oldCanvas) oldCanvas.remove();
}

// Создание canvas для анимаций
function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'weather-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  body.appendChild(canvas);
  return canvas;
}

// Основная функция обновления погоды
function updateWeather() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`)
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) return;

      const temp = data.current_weather.temperature;
      const code = data.current_weather.weathercode;

      tempEl.innerText = temp + '°C';

      let desc = '';
      clearAnimations();

      // Ясно
      if ([0,1,2,3].includes(code)) {
        desc = 'Ясно';
        body.style.background = 'linear-gradient(to top, #4facfe, #00f2fe)'; // голубой фон
        // Можно добавить солнце через CSS
      }
      // Облачно
      else if ([45,48,3].includes(code)) {
        desc = 'Облачно';
        body.style.background = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
      }
      // Дождь
      else if ([51,53,55,61,63,65,56,57].includes(code)) {
        desc = 'Дождь';
        body.style.background = 'linear-gradient(to top, #4e5d6c, #1c1c1c)';
        createRain();
      }
      // Снег
      else if ([71,73,75,77].includes(code)) {
        desc = 'Снег';
        body.style.background = 'linear-gradient(to top, #a8c0ff, #3f2b96)';
        createSnow();
      }
      // Гроза
      else if ([95,96,99].includes(code)) {
        desc = 'Гроза';
        body.style.background = 'linear-gradient(to top, #2c3e50, #000000)';
        createRain();
        // Можно добавить молнии позже
      }
      else {
        desc = 'Облачно';
        body.style.background = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
      }

      descEl.innerText = desc;
    })
    .catch(err => console.log('Ошибка при запросе погоды:', err));
}

// ===================== Анимация дождя =====================
function createRain() {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const drops = [];
  for (let i=0;i<200;i++){
    drops.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      length: Math.random()*20+10,
      speed: Math.random()*5+4
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    for (let i=0;i<drops.length;i++){
      const d = drops[i];
      ctx.beginPath();
      ctx.moveTo(d.x,d.y);
      ctx.lineTo(d.x,d.y+d.length);
      ctx.stroke();
      d.y += d.speed;
      if(d.y>canvas.height) d.y = -20;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ===================== Анимация снега =====================
function createSnow() {
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const flakes = [];
  for (let i=0;i<200;i++){
    flakes.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*4+1,
      speed: Math.random()*1+0.5
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    for (let i=0;i<flakes.length;i++){
      const f = flakes[i];
      ctx.moveTo(f.x,f.y);
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2,true);
    }
    ctx.fill();

    for (let i=0;i<flakes.length;i++){
      const f = flakes[i];
      f.y += f.speed;
      if(f.y>canvas.height) f.y = -5;
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// ===================== Запуск =====================
updateWeather(); // сразу при загрузке
setInterval(updateWeather, 5*60*1000); // каждые 5 минут
