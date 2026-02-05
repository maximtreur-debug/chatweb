// ----------------------- MISSIES -----------------------
const missies = [
  "Doe 20 squats + 10 push-ups!",
  "Ren op de plek voor 2 minuten!",
  "Doe een plank van 1 minuut!",
  "Spring 50 keer op en neer!",
  "Maak een mini-dansroutine van 30 seconden!",
  "Doe 15 burpees!",
  "Doe 20 lunges per been!",
  "Sprint 100 meter of rond je kamer 5 keer!",
  "Doe 25 jumping jacks + 15 sit-ups!",
  "Ren op de plek voor 1 minuut, daarna 10 push-ups!",
  "Doe 1 minuut high knees (heupen hoog!)",
  "Plank met arm- en beenheffen voor 45 seconden!",
  "10 burpees + 20 squats + 10 push-ups!",
  "Maak een mini circuit: 15 jumping jacks, 10 lunges, 10 push-ups",
  "Ren op de plek en tik je knieën 30 keer hoog op!"
];

// ----------------------- ELEMENTEN -----------------------
const missieDiv = document.getElementById('missie');
const knop = document.getElementById('nieuweMissie');
const timerDiv = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// ----------------------- RESPONSIVE CANVAS -----------------------
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ----------------------- LOCAL STORAGE -----------------------
const storageKey = 'miniMissies';
const maxClicks = 5;
const cooldownHours = 12;

let data = JSON.parse(localStorage.getItem(storageKey)) || {
  clicks: 0,
  lastReset: Date.now()
};

// ----------------------- PROGRESS BAR -----------------------
function updateProgress() {
  const percent = (data.clicks / maxClicks) * 100;
  progressBar.style.width = percent + '%';
}
updateProgress();

// ----------------------- RESET LOGICA -----------------------
function checkReset() {
  const now = Date.now();
  if (data.clicks >= maxClicks && now - data.lastReset >= cooldownHours * 60 * 60 * 1000) {
    data.clicks = 0;
    data.lastReset = now;
    updateLocalStorage();
    updateProgress();
    knop.disabled = false;
    missieDiv.textContent = "Klik op de knop voor je missie!";
  }
}
checkReset();

// ----------------------- LOCAL STORAGE UPDATE -----------------------
function updateLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// ----------------------- TIMER -----------------------
function startCooldown() {
  knop.disabled = true;
  const endTime = data.lastReset + cooldownHours * 60 * 60 * 1000;

  const interval = setInterval(() => {
    const now = Date.now();
    let diff = endTime - now;

    if (diff <= 0) {
      clearInterval(interval);
      checkReset();
      timerDiv.textContent = "";
      return;
    }

    const hours = Math.floor(diff / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);

    timerDiv.textContent = `Nieuwe missie beschikbaar over ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// ----------------------- CONFETTI -----------------------
const confettiParticles = [];
function createConfetti() {
  for(let i=0;i<150;i++){
    confettiParticles.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*confettiCanvas.height- confettiCanvas.height,
      r: Math.random()*6+2,
      d: Math.random()*150+50,
      color: `hsl(${Math.random()*360}, 70%, 50%)`,
      tilt: Math.random()*10-10
    });
  }
}
createConfetti();

function drawConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p=>{
    ctx.beginPath();
    ctx.lineWidth = p.r;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt, p.y);
    ctx.lineTo(p.x + p.tilt + p.r/2, p.y + p.r);
    ctx.stroke();
  });
  updateConfetti();
  requestAnimationFrame(drawConfetti);
}

function updateConfetti(){
  confettiParticles.forEach(p=>{
    p.y += 2;
    if(p.y>confettiCanvas.height){ 
      p.y = -10;
      p.x = Math.random()*confettiCanvas.width;
    }
  });
}
drawConfetti();

// ----------------------- NIEUWE MISSIE -----------------------
knop.addEventListener('click', () => {
  checkReset();
  if (data.clicks < maxClicks) {
    const index = Math.floor(Math.random() * missies.length);
    missieDiv.textContent = missies[index];
    data.clicks += 1;
    data.lastReset = Date.now();
    updateLocalStorage();
    updateProgress();
    triggerConfetti();

    if (data.clicks >= maxClicks) {
      startCooldown();
    }
  }
});

// ----------------------- CONFETTI TRIGGER -----------------------
function triggerConfetti(){
  confettiParticles.forEach(p=>{
    p.y -= Math.random()*20;
  });
}

// ----------------------- START TIMER ALS MAX GEBRUIKT -----------------------
if (data.clicks >= maxClicks) {
  startCooldown();
}
