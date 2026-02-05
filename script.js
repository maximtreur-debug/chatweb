// MISSIES
const missies = [
  "Spring 10 keer op en neer!",
  "Doe 15 squats!",
  "Loop 5 minuten rond!",
  "Maak een mini-dansje van 20 seconden!",
  "Doe 10 push-ups!",
  "Strek je armen en benen gedurende 1 minuut!",
  "Ren op de plek voor 1 minuut!",
  "Doe 10 jumping jacks!",
  "Doe een plank van 30 seconden!",
  "Drink een groot glas water en rek je daarna uit!"
];

// ELEMENTEN
const missieDiv = document.getElementById('missie');
const knop = document.getElementById('nieuweMissie');
const timerDiv = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// RESPONSIVE CANVAS
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// LOCAL STORAGE
const storageKey = 'miniMissies';
const maxClicks = 5;
const cooldownHours = 12;
let data = JSON.parse(localStorage.getItem(storageKey)) || {
  clicks: 0,
  lastReset: Date.now()
};

// UPDATE PROGRESS BAR
function updateProgress() {
  const percent = (data.clicks / maxClicks) * 100;
  progressBar.style.width = percent + '%';
}
updateProgress();

// RESET LOGICA
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

// LOCAL STORAGE UPDATE
function updateLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// TIMER
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

// CONFETTI
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

// NIEUWE MISSIE
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

// CONFETTI TRIGGER
function triggerConfetti(){
  // korte burst effect
  confettiParticles.forEach(p=>{
    p.y -= Math.random()*20;
  });
}

// START TIMER ALS MAX GEBRUIKT
if (data.clicks >= maxClicks) {
  startCooldown();
}
