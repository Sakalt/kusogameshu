const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const crabImage = new Image();
crabImage.src = 'i/kani.png';

const sweetPersimmonImage = new Image();
sweetPersimmonImage.src = 'i/kaki.png';

const bitterPersimmonImage = new Image();
bitterPersimmonImage.src = 'i/bitter_kaki.png';

const persimmonSize = 70; // 700x600 の 70x60 に縮小
const crabSize = 70; // 700x600 の 70x60 に縮小
const persimmonSpeed = 2;
const crabSpeed = 5;
let persimmons = [];
let crab = { x: canvas.width / 2 - crabSize / 2, y: canvas.height - crabSize - 10, width: crabSize, height: crabSize };

function init() {
    document.addEventListener('keydown', moveCrab);
    gameLoop();
}

function moveCrab(e) {
    switch(e.key) {
        case 'ArrowLeft':
            crab.x -= crabSpeed;
            break;
        case 'ArrowRight':
            crab.x += crabSpeed;
            break;
    }
    crab.x = Math.max(0, Math.min(canvas.width - crab.width, crab.x));
}

function spawnPersimmon() {
    const x = Math.random() * (canvas.width - persimmonSize);
    const y = -persimmonSize;
    const isBitter = Math.random() < 0.2; // 20%の確率で渋い柿
    persimmons.push({ x, y, isBitter });
}

function update() {
    if (Math.random() < 0.01) spawnPersimmon();
    
    persimmons.forEach(p => {
        p.y += persimmonSpeed;
        
        if (p.y > canvas.height) {
            const index = persimmons.indexOf(p);
            if (index > -1) persimmons.splice(index, 1);
        }
        
        if (p.y + persimmonSize > crab.y &&
            p.x < crab.x + crab.width &&
            p.x + persimmonSize > crab.x) {
            if (p.isBitter) {
                alert('ゲームオーバー！');
                window.location.reload();
            }
            const index = persimmons.indexOf(p);
            if (index > -1) persimmons.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(crabImage, crab.x, crab.y, crab.width, crab.height);
    
    persimmons.forEach(p => {
        const image = p.isBitter ? bitterPersimmonImage : sweetPersimmonImage;
        ctx.drawImage(image, p.x, p.y, persimmonSize, persimmonSize);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

init();
