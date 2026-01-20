const lat = 44.3167;
const lon = 28.6;
const widget = document.getElementById("widget");

// элементы декоративные
const sunEl = document.getElementById("sun");
const cloudEl = document.getElementById("clouds");
const lightningEl = document.getElementById("lightning");

function updateTime() {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes().toString().padStart(2,'0');
  const sec = now.getSeconds().toString().padStart(2,'0');

  document.getElementById("time").innerText = ${hour}:${min}:${sec};

  if (hour >= 19 || hour < 6) {
    widget.classList.add("night");
    if (!document.querySelectorAll(".star").length) createStars(50);
  } else {
    widget.classList.remove("night");
  }
}

function createStars(count) {
  for(let i=0;i<count;i++){
    const star = document.createElement("div");
    star.className="star";
    star.style.left=Math.random()*100+"%";
    star.style.top=Math.random()*100+"%";
    star.style.animationDuration=(1+Math.random()*2)+"s";
    widget.appendChild(star);
  }
}

setInterval(updateTime,1000);
updateTime();

// Fetch погоды
fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
.then(r=>r.json())
.then(data=>{
  const temp = Math.round(data.current_weather.temperature);
  const code = data.current_weather.weathercode;

  document.getElementById("temp").innerText = temp+"°C";

  let type="clear";
  let text="Ясно";

  // Сброс декоративных элементов
  sunEl.style.display="none";
  cloudEl.style.display="none";
  lightningEl.style.display="none";

  if([1,2,3].includes(code)){
    type="clear";
    text="Ясно";
    sunEl.style.display="block";
  }
  if([45,48].includes(code)){ // облачно
    type="clouds";
    text="Облачно";
    cloudEl.style.display="block";
  }
  if([51,53,55,61,63,65,95,96,99].includes(code)){ // дождь и гроза
    type="rainy";
    text="Гроза";
    cloudEl.style.display="block";
    lightningEl.style.display="block";
    makeRain();
  }
  if([71,73,75,77,85,86].includes(code)){ // снег
    type="snowy";
    text="Снег";
    cloudEl.style.display="block";
    makeSnow();
  }

  widget.className="widget "+type;
  document.getElementById("desc").innerText=text;
})
.catch(err=>{
  console.log("Ошибка fetch:",err);
  document.getElementById("desc").innerText="Ошибка загрузки";
});

// Дождь
function makeRain(){
  for(let i=0;i<25;i++){
    const d=document.createElement("div");
    d.className="rain";
    d.style.left=Math.random()*100+"%";
    d.style.animationDuration=0.5+Math.random()+"s";
    widget.appendChild(d);
  }
}

// Снег
function makeSnow(){
  for(let i=0;i<18;i++){
    const s=document.createElement("div");
    s.className="snow";
    s.style.left=Math.random()*100+"%";
    s.style.animationDuration=3+Math.random()*3+"s";
    widget.appendChild(s);
  }
}
