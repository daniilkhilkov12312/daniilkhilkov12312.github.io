// Координаты Нэводари
const lat = 44.3167;
const lon = 28.6;

// Элементы виджета
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const widget = document.getElementById("widget");

// Декоративные элементы (если подключишь потом)
const sunEl = document.getElementById("sun");
const cloudEl = document.getElementById("clouds");
const lightningEl = document.getElementById("lightning");

// Обновление времени
function updateTime() {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes().toString().padStart(2,'0');
    const sec = now.getSeconds().toString().padStart(2,'0');

    // Вставка времени в отдельный div (если добавишь в HTML)
    if(document.getElementById("time")) {
        document.getElementById("time").innerText = ${hour}:${min}:${sec};
    }

    // Смена фона день/ночь
    if(hour >= 19 || hour < 6) {
        widget.classList.add("night");
        if(!document.querySelectorAll(".star").length) createStars(50);
    } else {
        widget.classList.remove("night");
    }
}

// Создание звёзд ночью
function createStars(count) {
    for(let i=0;i<count;i++){
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random()*100 + "%";
        star.style.top = Math.random()*100 + "%";
        star.style.animationDuration = (1 + Math.random()*2) + "s";
        widget.appendChild(star);
    }
}

// Основная функция обновления погоды
function updateWeather() {
    fetch(https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;

            tempEl.innerText = temp + "°C";

            let description = "Ясно";

            // Сбрасываем декоративные элементы
            if(sunEl) sunEl.style.display = "none";
            if(cloudEl) cloudEl.style.display = "none";
            if(lightningEl) lightningEl.style.display = "none";

            // Разбор кодов погоды
            if([1,2,3].includes(code)){
                description = "Ясно";
                if(sunEl) sunEl.style.display = "block";
            }
            else if([45,48].includes(code)){
                description = "Облачно";
                if(cloudEl) cloudEl.style.display = "block";
            }
            else if([51,53,55,61,63,65,95,96,99].includes(code)){
                description = "Гроза / дождь";
                if(cloudEl) cloudEl.style.display = "block";
                if(lightningEl) lightningEl.style.display = "block";
                makeRain();
            }
            else if([71,73,75,77,85,86].includes(code)){
                description = "Снег";
                if(cloudEl) cloudEl.style.display = "block";
                makeSnow();
            }

            descEl.innerText = description;
        })
        .catch(err => {
            console.error("Ошибка fetch:", err);
            descEl.innerText = "Ошибка загрузки погоды";
        });
}

// Создание дождя
function makeRain(){
    for(let i=0;i<25;i++){
        const d = document.createElement("div");
        d.className = "rain";
        d.style.left = Math.random()*100 + "%";
        d.style.animationDuration = 0.5 + Math.random() + "s";
        widget.appendChild(d);
    }
}

// Создание снега
function makeSnow(){
    for(let i=0;i<18;i++){
        const s = document.createElement("div");
        s.className = "snow";
        s.style.left = Math.random()*100 + "%";
        s.style.animationDuration = 3 + Math.random()*3 + "s";
        widget.appendChild(s);
    }
}

// Инициализация
updateTime();
setInterval(updateTime, 1000); // время каждую секунду
updateWeather();
setInterval(updateWeather, 5*60*1000); // обновление погоды каждые 5 минут
