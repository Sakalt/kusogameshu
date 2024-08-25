const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const crabImage = new Image();
crabImage.src = 'crab_image_url';

const sweetPersimmonImage = new Image();
sweetPersimmonImage.src = 'sweet_persimmon_image_url';

const bitterPersimmonImage = new Image();
bitterPersimmonImage.src = 'bitter_persimmon_image_url';

const stageCount = 3;
const persimmonSpeed = 2;
const crabSpeed = 5;
let persimmons = [];
let crab = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 50 };

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
    const x = Math.random() * (canvas.width - 50);
    const y = -50;
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
        
        if (p.y + 50 > crab.y &&
            p.x < crab.x + crab.width &&
            p.x + 50 > crab.x) {
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
        ctx.drawImage(image, p.x, p.y, 50, 50);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

init();
