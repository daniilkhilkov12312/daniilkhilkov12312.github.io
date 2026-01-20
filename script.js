// Координаты Нэводари
const lat = 44.3167;
const lon = 28.6;

// Элементы
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const timeEl = document.getElementById("time");
const widget = document.getElementById("widget");

const sunEl = document.getElementById("sun");
const cloudEl = document.getElementById("clouds");
const lightningEl = document.getElementById("lightning");

// Обновление времени и фона
function updateTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2,'0');
  const s = now.getSeconds().toString().padStart(2,'0');
  timeEl.innerText = `${h}:${m}:${s}`;

  // День/ночь
  if(h >= 19 || h < 6) {
    widget.classList.add("night");
    if(!document.querySelectorAll(".star").length) createStars(50);
  } else {
    widget.classList.remove("night");
  }
}

// Звёзды ночью
function createStars(count){
  for(let i=0;i<count;i++){
    const star=document.createElement("div");
    star.className="star";
    star.style.left=Math.random()*100+"%";
    star.style.top=Math.random()*100+"%";
    star.style.animationDuration=(1+Math.random()*2)+"s";
    widget.appendChild(star);
  }
}

// Погода
function updateWeather() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
  .then(res=>res.json())
  .then(data=>{
    const temp=Math.round(data.current_weather.temperature);
    const code=data.current_weather.weathercode;

    tempEl.innerText = temp + "°C";

    // Сброс анимаций
    sunEl.style.display = cloudEl.style.display = lightningEl.style.display = "none";

    let description = "Ясно";
    if([0].includes(code)){
      description="Ясно";
      sunEl.style.display="block";
    }
    else if([1,2,3,45,48].includes(code)){
      description="Облачно";
      cloudEl.style.display="block";
    }
    else if([51,53,55,61,63,65,95,96,99].includes(code)){
      description="Гроза / дождь";
      cloudEl.style.display="block";
      lightningEl.style.display="block";
      makeRain();
    }
    else if([71,73,75,77,85,86].includes(code)){
      description="Снег";
      cloudEl.style.display="block";
      makeSnow();
    }

    descEl.innerText = description;
  })
  .catch(err=>{
    console.error("Ошибка fetch:", err);
    descEl.innerText="Ошибка загрузки";
  });
}

// Дождь
function makeRain(){
  for(let i=0;i<25;i++){
    const d=document.createElement("div");
    d.className="rain";
    d.style.left=Math.random()*100+"%";
    d.style.animationDuration=(0.5+Math.random())+"s";
    widget.appendChild(d);
  }
}

// Снег
function makeSnow(){
  for(let i=0;i<18;i++){
    const s=document.createElement("div");
    s.className="snow";
    s.style.left=Math.random()*100+"%";
    s.style.animationDuration=(3+Math.random()*3)+"s";
    widget.appendChild(s);
  }
}

// Инициализация
updateTime();
setInterval(updateTime,1000);
updateWeather();
setInterval(updateWeather,5*60*1000);
