/* ============================================================
   多言語設定
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
   ダークモード
============================================================ */
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

/* ============================================================
   ハンバーガーメニュー
============================================================ */
function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    if (!menu) return;
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

/* ============================================================
   ページ遷移アニメーション
============================================================ */
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
/* ============================================================
   AIチャット
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
/* ============================================================
   ギャラリー（GitHub から自動読み込み＋タグ＋動画＋説明文）
============================================================ */

let galleryImages = [];  // {src, type, caption, tags}
let currentLightboxIndex = 0;

/* ファイル名 → 説明文に変換 */
function filenameToCaption(name) {
    return name
        .replace(/\.[^/.]+$/, "")   // 拡張子削除
        .replace(/#.*/g, "")        // タグ部分削除
        .replace(/[_-]/g, " ")      // _ と - をスペースに
        .replace(/\s+/g, " ")       // 連続スペース削除
        .trim();
}

/* ファイル名 → タグ抽出 (#tag1#tag2...) */
function extractTags(filename) {
    const base = filename.replace(/\.[^/.]+$/, "");
    const parts = base.split("#");
    return parts.slice(1); // 1個目は名前、2個目以降がタグ
}

async function loadGalleryImages() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    const apiUrl = "https://api.github.com/repos/bunkasai-2026/bunkasai-2026.github.io/contents/img";

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        galleryImages = data
            .filter(item => item.type === "file")
            .filter(item => /\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(item.name))
            .map(item => ({
                src: item.download_url,
                type: /\.(mp4|webm)$/i.test(item.name) ? "video" : "image",
                caption: filenameToCaption(item.name),
                tags: extractTags(item.name)
            }));

        // ランダム表示
        galleryImages.sort(() => Math.random() - 0.5);

        renderTagButtons();
        renderGallery();
    } catch (e) {
        console.error("画像読み込みエラー:", e);
    }
}

/* タグボタン生成 */
function renderTagButtons() {
    const container = document.getElementById("tag-filter");
    if (!container) return;

    const tagSet = new Set();
    galleryImages.forEach(img => img.tags.forEach(t => tagSet.add(t)));

    container.innerHTML = "";

    // ALL ボタン
    const allBtn = document.createElement("button");
    allBtn.textContent = "ALL";
    allBtn.onclick = () => filterByTag(null);
    container.appendChild(allBtn);

    // タグボタン
    tagSet.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag;
        btn.onclick = () => filterByTag(tag);
        container.appendChild(btn);
    });
}

/* タグフィルター */
function filterByTag(tag) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    const filtered = galleryImages.filter(img => !tag || img.tags.includes(tag));

    filtered.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.onclick = () => openLightbox(index);

        if (item.type === "image") {
            const img = document.createElement("img");
            img.src = item.src;
            img.draggable = false;
            div.appendChild(img);
        } else {
            const vid = document.createElement("video");
            vid.src = item.src;
            vid.muted = true;
            vid.loop = true;
            vid.autoplay = true;
            vid.playsInline = true;
            vid.draggable = false;
            div.appendChild(vid);
        }

        const cap = document.createElement("div");
        cap.className = "caption";
        cap.textContent = item.caption;
        div.appendChild(cap);

        gallery.appendChild(div);
    });
}

/* 通常ギャラリー描画 */
function renderGallery() {
    filterByTag(null); // ALL 表示
}

/* ページ読み込み時にギャラリー読み込み */
document.addEventListener("DOMContentLoaded", loadGalleryImages);
/* ============================================================
   Lightbox（画像＋動画対応）
============================================================ */

function openLightbox(index) {
    currentLightboxIndex = index;

    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const vid = document.getElementById("lightbox-video");

    if (!lb) return;

    lb.style.display = "flex";

    const item = galleryImages[currentLightboxIndex];

    if (item.type === "image") {
        img.style.display = "block";
        vid.style.display = "none";
        img.src = item.src;
    } else {
        img.style.display = "none";
        vid.style.display = "block";
        vid.src = item.src;
    }
}

function closeLightbox(event) {
    if (event) event.stopPropagation();
    const lb = document.getElementById("lightbox");
    if (!lb) return;

    lb.style.display = "none";
}

function prevLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex =
        (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentLightboxIndex);
}

function nextLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex =
        (currentLightboxIndex + 1) % galleryImages.length;
    openLightbox(currentLightboxIndex);
}

/* ============================================================
   スライドショー自動再生（スライドモード時のみ）
============================================================ */

setInterval(() => {
    const g = document.getElementById("gallery");
    if (g && g.classList.contains("gallery-slide")) {
        nextLightbox();
    }
}, 3000);

/* ============================================================
   ギャラリービュー切替（Grid / List / Slide）
============================================================ */

function setGalleryView(mode) {
    const g = document.getElementById("gallery");
    if (!g) return;

    g.classList.remove("gallery-grid", "gallery-list", "gallery-slide");

    if (mode === "grid") g.classList.add("gallery-grid");
    if (mode === "list") g.classList.add("gallery-list");
    if (mode === "slide") g.classList.add("gallery-slide");
}
