/* ============================================================
   1. 言語設定（localStorage + ブラウザ自動判定）
============================================================ */

let currentLang = localStorage.getItem("lang");

if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith("ja") ? "jp" : "en";
    localStorage.setItem("lang", currentLang);
}

function applyLang() {
    const jp = document.querySelectorAll(".lang-jp");
    const en = document.querySelectorAll(".lang-en");

    if (currentLang === "jp") {
        jp.forEach(e => e.style.display = "block");
        en.forEach(e => e.style.display = "none");
    } else {
        jp.forEach(e => e.style.display = "none");
        en.forEach(e => e.style.display = "block");
    }
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    applyLang();
}

applyLang();


/* ============================================================
   2. ダークモード（localStorage + ネオモダンデザイン）
============================================================ */

function applyDarkMode() {
    const link = document.getElementById("theme-style");
    const mode = localStorage.getItem("darkmode");

    if (mode === "on") {
        link.setAttribute("href", "css/dark.css");
    } else {
        link.setAttribute("href", "css/style.css");
    }
}

function toggleDarkMode() {
    const mode = localStorage.getItem("darkmode");
    localStorage.setItem("darkmode", mode === "on" ? "off" : "on");
    applyDarkMode();
}

applyDarkMode();


/* ============================================================
   3. ハンバーガーメニュー
============================================================ */

function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}


/* ============================================================
   4. 動く背景（ランダム画像）
============================================================ */

const bgImages = [
    "img/bg1.jpg",
    "img/bg2.jpg",
    "img/bg3.jpg"
];
let bgIndex = 0;

function changeBackground() {
    const bg = document.getElementById("background");
    bgIndex = (bgIndex + 1) % bgImages.length;
    bg.style.backgroundImage = `url(${bgImages[bgIndex]})`;
}

changeBackground();
setInterval(changeBackground, 8000);


/* ============================================================
   5. カウントダウン（index のみ）
============================================================ */

function updateCountdown() {
    const eventDate = new Date("2026-09-20T09:00:00");
    const now = new Date();
    const diff = eventDate - now;

    const jpEl = document.getElementById("countdown-jp");
    const enEl = document.getElementById("countdown-en");

    if (!jpEl || !enEl) return;

    if (diff <= 0) {
        jpEl.innerText = "文化祭開催中！";
        enEl.innerText = "Festival is happening now!";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    jpEl.innerText = `文化祭まで：${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
    enEl.innerText = `Until festival: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();


/* ============================================================
   6. ページ遷移アニメーション
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fade-in");
});

document.querySelectorAll("a.nav-link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const url = link.getAttribute("href");
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    });
});


/* ============================================================
   7. AIチャット（返答増量版）
============================================================ */

const assistantJP = {
    "こんにちは": "こんにちは！文化祭2026について何を知りたいですか？",
    "いつ": "文化祭は 2026年9月20日 に開催予定です！",
    "場所": "文化祭は学校のメインキャンパスで開催されます。",
    "時間": "午前9時〜午後4時の予定です。",
    "アクセス": "最寄り駅から徒歩10分です。",
    "入場料": "入場は無料です！",
    "企画": "クラス企画、ステージ企画、展示、飲食などがあります。",
    "default": "ご質問ありがとうございます！文化祭について知りたいことを入力してみてください。"
};

const assistantEN = {
    "hello": "Hello! How can I help you with Bunkasai 2026?",
    "when": "The festival will be held on September 20, 2026!",
    "where": "It will take place at the main school campus.",
    "time": "It is scheduled from 9:00 AM to 4:00 PM.",
    "access": "It's a 10-minute walk from the nearest station.",
    "fee": "Admission is free!",
    "events": "There will be class events, stage shows, exhibitions, and food stalls.",
    "default": "Ask me anything about the festival!"
};

function assistantSend() {
    const inputEl = document.getElementById("assistant-input");
    const chat = document.getElementById("assistant-chat");

    const text = inputEl.value.trim();
    if (!text) return;

    const key = text.toLowerCase();
    let response;

    if (currentLang === "jp") {
        response = assistantJP[key] || assistantJP["default"];
    } else {
        response = assistantEN[key] || assistantEN["default"];
    }

    chat.innerHTML += `<div class="user-msg">${text}</div>`;
    chat.innerHTML += `<div class="bot-msg">${response}</div>`;

    inputEl.value = "";
    chat.scrollTop = chat.scrollHeight;
}

function toggleAssistant() {
    const box = document.getElementById("assistant-box");
    box.style.display = (box.style.display === "block") ? "none" : "flex";
}
