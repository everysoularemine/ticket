const noBtn = document.querySelector('.no-btn');
const yesBtn = document.querySelector('.yes-btn');
const container = document.querySelector('.buttons');
const messageOverlay = document.getElementById('message');
const closeBtn = document.querySelector('.close-btn');
const fallingBlurLayer = document.querySelector('.falling-blurred');

let noBtnClickCount = 0;
let decisionMade = false;

const funnyMessages = [
    "Ну не надо так стараться 😏",
    "Ты прям целеустремлённая 😂",
    "Хватит мучить кнопку! 😆",
    "А может, всё-таки да? 😉",
    "Кнопка уже боится... 😨"
];

// --- Telegram ---
const token = "8439567884:AAFAzO4uEdijxA_IUm7p6KBv-P9dAMd2f1M"; 
const chatId = "1064369368";

function sendToTelegram(text) {
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text })
    })
    .then(res => res.json())
    .then(data => console.log("Сообщение отправлено:", data))
    .catch(err => console.error("Ошибка отправки:", err));
}

// --- Таймер "долго думает" ---
window.addEventListener("load", () => {
    sendToTelegram("🎟 Кто-то открыл страницу с билетом!");

    setTimeout(() => {
        if (!decisionMade) {
            sendToTelegram("🤔 Похоже, кто-то долго думает...");
        }
    }, 3 * 60 * 1000);
});

// --- Кнопка "Нет" ---
function moveButton() {
    noBtnClickCount++;
    const maxX = container.clientWidth - noBtn.clientWidth;
    const maxY = container.clientHeight - noBtn.clientHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    // Подсказки каждые 3 клика
    if (noBtnClickCount % 3 === 0) {
        const msg = funnyMessages[(noBtnClickCount / 3 - 1) % funnyMessages.length];
        showTooltip(noBtn, msg);
    }

    // Telegram каждые 10 кликов
    if (noBtnClickCount % 10 === 0) {
        sendToTelegram(`🙅 Нажали на "Нет" уже ${noBtnClickCount} раз!`);
    }
}

function showTooltip(button, text) {
    let tooltip = button.querySelector('.no-btn-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.classList.add('no-btn-tooltip');
        button.appendChild(tooltip);
    }
    tooltip.textContent = text;
    button.classList.add('show-tooltip');
    setTimeout(() => button.classList.remove('show-tooltip'), 1500);
}

noBtn.addEventListener('click', moveButton);
noBtn.addEventListener('touchstart', moveButton);

// --- Кнопка "Да" ---
yesBtn.addEventListener('click', () => {
    decisionMade = true;
    messageOverlay.style.display = 'flex';
    spawnFlyingEmojis();

    sendToTelegram(`💖 Кто-то согласился на прогулку! (До этого нажимал "Нет" ${noBtnClickCount} раз)`);
});

// Закрытие сообщения
closeBtn.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
});

// --- Печать текста ---
const text = "Вы приглашены на незабываемую прогулку 🌸";
let i = 0;
function typeText() {
    if (i < text.length) {
        document.getElementById("typed-text").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeText, 80);
    }
}
typeText();

// --- Лепестки ---
function createPetal(layer) {
    const petal = document.createElement('div');
    petal.textContent = "🌸";
    petal.classList.add('petal');
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.top = Math.random() * window.innerHeight + 'px';
    petal.style.fontSize = Math.random() * 20 + 20 + 'px';
    const moveX = (Math.random() - 0.5) * 300;
    const moveY = (Math.random() - 0.5) * 300;
    petal.style.setProperty('--move-x', moveX + 'px');
    petal.style.setProperty('--move-y', moveY + 'px');
    petal.style.animation = `floatPetal ${4 + Math.random() * 4}s linear forwards, sway 4s ease-in-out infinite`;
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
}

setInterval(() => createPetal(fallingBlurLayer), 300);

// --- Летающие сердечки ---
function spawnFlyingEmojis() {
    const emojis = ["💖", "😍", "🥰", "🎉", "💐", "Ура!"];
    for (let j = 0; j < 15; j++) {
        const span = document.createElement('span');
        span.className = 'fly';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = window.innerWidth / 2 + 'px';
        span.style.top = window.innerHeight / 2 + 'px';
        span.style.setProperty('--x', (Math.random() - 0.5) * 500 + 'px');
        span.style.setProperty('--y', (Math.random() - 0.5) * 500 + 'px');
        document.body.appendChild(span);
        setTimeout(() => span.remove(), 1500);
    }
}
