const noBtn = document.querySelector('.no-btn');
const container = document.querySelector('.buttons');
const messageOverlay = document.getElementById('message');
const closeBtn = document.querySelector('.close-btn');

let noBtnClickCount = 0;
let decisionMade = false;

const token = "8439567884:AAFAzO4uEdijxA_IUm7p6KBv-P9dAMd2f1M"; 
const chatId = "1064369368";

// функция отправки сообщения напрямую в Telegram
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

// событие при загрузке
window.addEventListener("load", () => {
    sendToTelegram("🎟 Кто-то открыл страницу с билетом!");

    setTimeout(() => {
        if (!decisionMade) {
            sendToTelegram("🤔 Похоже, кто-то долго думает...");
        }
    }, 3 * 60 * 1000);
});

// кнопка "Нет"
function moveButton() {
    noBtnClickCount++;
    const maxX = container.clientWidth - noBtn.clientWidth;
    const maxY = container.clientHeight - noBtn.clientHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    if (noBtnClickCount % 3 === 0) {
        const funnyMessages = [
            "Ну не надо так стараться 😏",
            "Ты прям целеустремлённая 😂",
            "Хватит мучить кнопку! 😆",
            "А может, всё-таки да? 😉",
            "Кнопка уже боится... 😨"
        ];
        const msg = funnyMessages[(noBtnClickCount / 3 - 1) % funnyMessages.length];
        showTooltip(noBtn, msg);
    }

    // только каждые 10 кликов отправляем сообщение
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

// кнопка "Да"
document.querySelector('.yes-btn').addEventListener('click', () => {
    decisionMade = true;
    messageOverlay.style.display = 'flex';
    spawnFlyingEmojis();

    sendToTelegram(`💖 Кто-то согласился на прогулку! (До этого нажимал "Нет" ${noBtnClickCount} раз)`);
});

closeBtn.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
});

// эффект "Ура!"
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
