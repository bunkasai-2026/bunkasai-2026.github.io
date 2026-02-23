/* 言語設定 */
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

/* ダークモード */
function applyDarkMode() {
    const link = document.getElementById("theme-style");
    const mode = localStorage.getItem("darkmode");
    link.setAttribute("href", mode === "on" ? "css/dark.css" : "css/style.css");
}
function toggleDarkMode() {
    const mode = localStorage.getItem("darkmode");
    localStorage.setItem("darkmode", mode === "on" ? "off" : "on");
    applyDarkMode();
}
applyDarkMode();

/* ハンバーガー */
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    if (!menu) return;
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

/* カウントダウン */
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
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    jpEl.innerText = `文化祭まで：${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
    enEl.innerText = `Until festival: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ページ遷移アニメ */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fade-in");
});
document.querySelectorAll("a.nav-link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const url = link.getAttribute("href");
        document.body.classList.add("fade-out");
        setTimeout(() => { window.location.href = url; }, 300);
    });
});

/* ギャラリー自動読み込み（GitHub Pages） */
let galleryImages = [];
async function loadGalleryImages() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    const folderUrl = "img/";
    try {
        const res = await fetch(folderUrl);
        const text = await res.text();
        const regex = /href="([^"]+\.(jpg|jpeg|png|gif|webp))"/gi;
        let match;
        galleryImages = [];
        while ((match = regex.exec(text)) !== null) {
            galleryImages.push(folderUrl + match[1]);
        }
        renderGallery();
    } catch (e) {
        console.error("画像フォルダの読み込みに失敗:", e);
    }
}
function renderGallery() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    gallery.innerHTML = "";
    galleryImages.forEach((src, index) => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.onclick = () => openLightbox(index);
        const img = document.createElement("img");
        img.src = src;
        div.appendChild(img);
        gallery.appendChild(div);
    });
}
loadGalleryImages();

/* ギャラリービュー切替 */
function setGalleryView(mode) {
    const g = document.getElementById("gallery");
    if (!g) return;
    g.classList.remove("gallery-grid", "gallery-list", "gallery-slide");
    if (mode === "grid") g.classList.add("gallery-grid");
    if (mode === "list") g.classList.add("gallery-list");
    if (mode === "slide") g.classList.add("gallery-slide");
}

/* Lightbox */
let currentLightboxIndex = 0;
function openLightbox(index) {
    currentLightboxIndex = index;
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (!lb || !img) return;
    img.src = galleryImages[currentLightboxIndex];
    lb.style.display = "flex";
}
function closeLightbox(event) {
    if (event) event.stopPropagation();
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.style.display = "none";
}
function prevLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById("lightbox-img").src = galleryImages[currentLightboxIndex];
}
function nextLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    document.getElementById("lightbox-img").src = galleryImages[currentLightboxIndex];
}

/* AIチャット */
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
function appendBubble(text, who) {
    const chat = document.getElementById("assistant-chat");
    if (!chat) return;
    const row = document.createElement("div");
    row.className = "chat-row " + (who === "user" ? "user" : "bot");
    const bubble = document.createElement("div");
    bubble.className = "bubble " + (who === "user" ? "user" : "bot");
    bubble.textContent = text;
    row.appendChild(bubble);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
}
function assistantSend() {
    const inputEl = document.getElementById("assistant-input");
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    appendBubble(text, "user");
    const key = text.toLowerCase();
    const response = (currentLang === "jp")
        ? (assistantJP[key] || assistantJP["default"])
        : (assistantEN[key] || assistantEN["default"]);
    appendBubble(response, "bot");
    inputEl.value = "";
}
function sendSample(text) {
    const inputEl = document.getElementById("assistant-input");
    if (!inputEl) return;
    inputEl.value = text;
    assistantSend();
}
function toggleAssistant() {
    const box = document.getElementById("assistant-box");
    if (!box) return;
    box.style.display = (box.style.display === "block") ? "none" : "flex";
}
