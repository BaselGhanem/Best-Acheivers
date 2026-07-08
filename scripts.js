// ============================================================
//  تشغيل الموقع
//  لا تحتاج عادةً لتعديل هذا الملف شهريًا.
// ============================================================

const DATA = window.APP_DATA;

function generateAvatarDataURL(name, size = 250) {
  const canvas = document.createElement(`canvas`);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext(`2d`);

  const palettes = [
    { bg: `#00A693`, fg: `#ffffff` },
    { bg: `#042320`, fg: `#D4AF37` },
    { bg: `#007D6E`, fg: `#ffffff` },
    { bg: `#1A6B62`, fg: `#FBF5E6` }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palette = palettes[Math.abs(hash) % palettes.length];
  const gradBg = ctx.createLinearGradient(0, 0, size, size);
  gradBg.addColorStop(0, palette.bg);
  gradBg.addColorStop(1, `#00000022`);

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = gradBg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(212, 175, 55, 0.4)`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
  ctx.stroke();

  const words = name.trim().split(/\s+/);
  const initials = `${words[0]?.[0] ?? ``}${words[1]?.[0] ?? ``}`;

  ctx.fillStyle = palette.fg;
  ctx.font = `bold ${Math.round(size * 0.35)}px Almarai, sans-serif`;
  ctx.textAlign = `center`;
  ctx.textBaseline = `middle`;
  ctx.fillText(initials, size / 2, size / 2 + size * 0.04);

  return canvas.toDataURL(`image/png`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#039;`);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setImage(id, src) {
  const image = document.getElementById(id);
  if (image) image.src = src;
}

function renderPageInfo() {
  document.title = DATA.pageTitle;
  setImage(`company-logo`, DATA.logoUrl);
  setImage(`footer-logo`, DATA.logoUrl);
  setText(`footer-text`, DATA.footerText);
  setText(`month-label`, DATA.monthLabel);
  setText(`hero-title-main`, DATA.hero.titleMain);
  setText(`hero-title-accent`, DATA.hero.titleAccent);
  setText(`hero-tagline`, DATA.hero.tagline);
}

function renderNav() {
  const navMenu = document.getElementById(`nav-menu`);
  if (!navMenu) return;

  navMenu.innerHTML = ``;

  DATA.navLinks.forEach((item) => {
    const link = document.createElement(`a`);
    link.href = item.url;
    link.className = item.active ? `nav-link active` : `nav-link`;
    link.textContent = item.label;
    navMenu.appendChild(link);
  });
}

function getEmployeePhotoUrl(emp) {
  if (emp.photo) return emp.photo;
  if (emp.photoFile) return `${DATA.photoBaseUrl}${emp.photoFile}`;
  return generateAvatarDataURL(emp.name, 250);
}

function createEmployeeCard(emp, index) {
  const fallbackSrc = generateAvatarDataURL(emp.name, 250);

  const card = document.createElement(`div`);
  card.className = `employee-card`;

  const avatarWrapper = document.createElement(`div`);
  avatarWrapper.className = `avatar-wrapper`;

  const avatarRing = document.createElement(`div`);
  avatarRing.className = `avatar-ring`;

  const avatar = document.createElement(`img`);
  avatar.src = getEmployeePhotoUrl(emp);
  avatar.className = `employee-avatar`;
  avatar.alt = emp.name;
  avatar.crossOrigin = `anonymous`;
  avatar.onerror = () => {
    avatar.onerror = null;
    avatar.src = fallbackSrc;
  };

  avatarWrapper.appendChild(avatarRing);
  avatarWrapper.appendChild(avatar);

  const name = document.createElement(`h3`);
  name.className = `employee-name`;
  name.textContent = emp.name;

  const department = document.createElement(`p`);
  department.className = `employee-dept`;
  department.textContent = emp.department;

  const badge = document.createElement(`div`);
  badge.className = `badge`;
  badge.innerHTML = `<i class="fa-solid fa-award"></i> ${escapeHtml(DATA.badges[index % DATA.badges.length])}`;

  const button = document.createElement(`button`);
  button.className = `action-download-btn`;
  button.title = `تنزيل تهنئة`;
  button.innerHTML = `تنزيل البطاقة <i class="fa-solid fa-arrow-down"></i>`;
  button.addEventListener(`click`, (event) => handleDownload(event, button));

  card.appendChild(avatarWrapper);
  card.appendChild(name);
  card.appendChild(department);
  card.appendChild(badge);
  card.appendChild(button);

  return card;
}

function renderEmployees() {
  const container = document.getElementById(`employees-container`);
  if (!container) return;

  container.innerHTML = ``;

  const uniqueDepts = new Set(DATA.employees.map((employee) => employee.department)).size;
  animateCounter(`total-count`, DATA.employees.length);
  animateCounter(`dept-count`, uniqueDepts);

  DATA.employees.forEach((employee, index) => {
    container.appendChild(createEmployeeCard(employee, index));
  });
}

async function handleDownload(event, button) {
  event.stopPropagation();

  const originalText = button.innerHTML;
  button.innerHTML = `جاري التجهيز... <i class="fa-solid fa-spinner fa-spin"></i>`;
  button.style.pointerEvents = `none`;

  const card = button.closest(`.employee-card`);
  const name = card.querySelector(`.employee-name`).textContent.trim();
  const dept = card.querySelector(`.employee-dept`).textContent.trim();
  const badgeText = card.querySelector(`.badge`).textContent.trim();
  const avatarSrc = card.querySelector(`.employee-avatar`).src;
  const wallpaper = createWallpaperElement({ name, dept, badgeText, avatarSrc });

  document.body.appendChild(wallpaper);

  try {
    const dataUrl = await htmlToImage.toPng(wallpaper, {
      backgroundColor: `#042320`,
      pixelRatio: 1
    });

    const downloadLink = document.createElement(`a`);
    downloadLink.download = `نجم-الإنجاز-${name.split(` `)[0]}.png`;
    downloadLink.href = dataUrl;
    downloadLink.click();

    showToast(`تم تنزيل بطاقة ${name.split(` `)[0]} بنجاح ✨`);
  } catch (err) {
    console.error(`Download error:`, err);
    showToast(`❌ حدث خطأ أثناء التنزيل`);
  } finally {
    document.body.removeChild(wallpaper);
    button.innerHTML = originalText;
    button.style.pointerEvents = `auto`;
  }
}

function createWallpaperElement({ name, dept, badgeText, avatarSrc }) {
  const wallpaper = document.createElement(`div`);
  wallpaper.setAttribute(`dir`, `rtl`);

  Object.assign(wallpaper.style, {
    position: `fixed`,
    left: `-9999px`,
    top: `0`,
    width: `1080px`,
    height: `1920px`,
    background: `linear-gradient(135deg, #042320 0%, #004D44 100%)`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    fontFamily: `'Almarai', sans-serif`,
    direction: `rtl`,
    overflow: `hidden`
  });

  wallpaper.innerHTML = `
    <div style="position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);border-radius:50%;"></div>
    <div style="position:absolute;bottom:-300px;left:-200px;width:800px;height:800px;background:radial-gradient(circle, rgba(0,166,147,0.2) 0%, transparent 70%);border-radius:50%;"></div>

    <div style="
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 60px;
      width: 860px;
      padding: 100px 60px;
      text-align: center;
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
      position: relative;
      z-index: 10;
    ">
      <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:300px;height:8px;background:linear-gradient(90deg, transparent, #D4AF37, transparent);"></div>

      <div style="margin-bottom:60px;">
        <h2 style="color: #fff; font-size: 3.2rem; font-weight: 800; margin: 0; opacity: 0.9;">دار الدواء</h2>
      </div>

      <div style="position:relative; width:340px; height:340px; margin:0 auto 50px;">
        <div style="position:absolute; inset:-15px; border-radius:50%; background:linear-gradient(135deg, #00A693, #D4AF37); opacity:0.8; filter:blur(10px);"></div>
        <img src="${escapeHtml(avatarSrc)}" style="
          position:relative;
          width:340px;height:340px;border-radius:50%;
          display:block;
          border:8px solid #042320;
          box-shadow:0 20px 50px rgba(0,0,0,0.6);
          object-fit:cover;
        " crossorigin="anonymous">
      </div>

      <div style="font-size:3.5rem;font-weight:800;color:#FFFFFF;margin-bottom:20px;letter-spacing:-0.02em;">${escapeHtml(name)}</div>
      <div style="font-size:1.8rem;color:#4DB6AC;font-weight:600;margin-bottom:40px;">${escapeHtml(dept)}</div>

      <div style="
        display:inline-block;
        background:linear-gradient(135deg, #D4AF37, #9C7D1C);
        color:#FFFFFF;
        font-weight:800;font-size:1.6rem;
        padding:15px 50px;border-radius:100px;
        box-shadow: 0 10px 30px rgba(212,175,55,0.3);
        margin-bottom:60px;
      ">${escapeHtml(badgeText)}</div>

      <div style="width:100px;height:2px;background:rgba(255,255,255,0.2);margin:0 auto 40px;"></div>

      <div style="font-size:1.5rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:4px;">
        موظف الشهر • ${escapeHtml(DATA.monthLabel)}
      </div>
    </div>
  `;

  return wallpaper;
}

function animateCounter(id, target) {
  const element = document.getElementById(id);
  if (!element) return;

  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    element.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

function showToast(msg) {
  const toast = document.getElementById(`toast`);
  const toastMessage = document.getElementById(`toast-msg`);
  if (!toast || !toastMessage) return;

  toastMessage.textContent = msg;
  toast.classList.add(`show`);
  setTimeout(() => toast.classList.remove(`show`), 4000);
}

document.addEventListener(`DOMContentLoaded`, () => {
  if (!DATA) {
    console.error(`APP_DATA is missing. تأكد أن ملف data.js موجود قبل scripts.js`);
    return;
  }

  renderPageInfo();
  renderNav();
  renderEmployees();
});
