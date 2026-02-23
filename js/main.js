/* ============================================================
   ギャラリー自動読み込み（GitHub API版 / フル機能）
============================================================ */

let galleryImages = [];  // {src, type, caption}
let currentLightboxIndex = 0;

/* ファイル名 → 説明文に変換 */
function filenameToCaption(name) {
    return name
        .replace(/\.[^/.]+$/, "")   // 拡張子削除
        .replace(/[_-]/g, " ")      // _ と - をスペースに
        .replace(/\s+/g, " ")       // 連続スペース削除
        .trim();
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
                caption: filenameToCaption(item.name)
            }));

        /* ランダム表示 */
        galleryImages.sort(() => Math.random() - 0.5);

        renderGallery();
    } catch (e) {
        console.error("画像読み込みエラー:", e);
    }
}

function renderGallery() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    galleryImages.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.onclick = () => openLightbox(index);

        if (item.type === "image") {
            const img = document.createElement("img");
            img.src = item.src;
            div.appendChild(img);
        } else {
            const vid = document.createElement("video");
            vid.src = item.src;
            vid.muted = true;
            vid.loop = true;
            vid.autoplay = true;
            div.appendChild(vid);
        }

        /* 説明文 */
        const cap = document.createElement("div");
        cap.className = "caption";
        cap.textContent = item.caption;
        div.appendChild(cap);

        gallery.appendChild(div);
    });
}

loadGalleryImages();

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
    document.getElementById("lightbox").style.display = "none";
}

function prevLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentLightboxIndex);
}

function nextLightbox(event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
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
   ギャラリービュー切替
============================================================ */

function setGalleryView(mode) {
    const g = document.getElementById("gallery");
    if (!g) return;
    g.classList.remove("gallery-grid", "gallery-list", "gallery-slide");
    if (mode === "grid") g.classList.add("gallery-grid");
    if (mode === "list") g.classList.add("gallery-list");
    if (mode === "slide") g.classList.add("gallery-slide");
}
