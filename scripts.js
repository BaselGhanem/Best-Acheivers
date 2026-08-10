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

async function waitForExportAssets(element) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = Array.from(element.querySelectorAll(`img`));
  await Promise.all(images.map(async (image) => {
    if (image.complete && image.naturalWidth > 0) return;

    try {
      await image.decode();
    } catch {
      await new Promise((resolve) => {
        image.addEventListener(`load`, resolve, { once: true });
        image.addEventListener(`error`, resolve, { once: true });
      });
    }
  }));
}

function createExportCard(card) {
  const exportCard = card.cloneNode(true);
  const exportButton = exportCard.querySelector(`.action-download-btn`);
  if (exportButton) exportButton.remove();

  exportCard.classList.add(`export-card`);
  Object.assign(exportCard.style, {
    position: `fixed`,
    left: `-10000px`,
    top: `0`,
    width: `360px`,
    maxWidth: `none`,
    minWidth: `360px`,
    boxSizing: `border-box`,
    margin: `0`,
    transform: `none`,
    transition: `none`,
    animation: `none`,
    opacity: `1`,
    background: `#ffffff`,
    zIndex: `-1`
  });

  exportCard.querySelectorAll(`*`).forEach((element) => {
    element.style.animation = `none`;
    element.style.transition = `none`;
    element.style.transform = `none`;
  });

  const avatarRing = exportCard.querySelector(`.avatar-ring`);
  if (avatarRing) avatarRing.style.opacity = `0`;

  return exportCard;
}

function triggerImageDownload(blob, fileName) {
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement(`a`);
  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  downloadLink.style.display = `none`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
}

async function handleDownload(event, button) {
  event.stopPropagation();

  const originalText = button.innerHTML;
  button.innerHTML = `جاري التجهيز... <i class="fa-solid fa-spinner fa-spin"></i>`;
  button.disabled = true;

  const card = button.closest(`.employee-card`);
  const name = card.querySelector(`.employee-name`).textContent.trim();
  const exportCard = createExportCard(card);
  document.body.appendChild(exportCard);

  try {
    await waitForExportAssets(exportCard);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const blob = await htmlToImage.toBlob(exportCard, {
      backgroundColor: `#ffffff`,
      cacheBust: true,
      pixelRatio: 3,
      width: 360,
      height: Math.ceil(exportCard.getBoundingClientRect().height),
      style: {
        transform: `none`,
        margin: `0`
      }
    });

    if (!blob) throw new Error(`تعذر إنشاء صورة البطاقة`);

    triggerImageDownload(blob, `نجم-الإنجاز-${name.split(` `)[0]}.png`);
    showToast(`تم تنزيل بطاقة ${name.split(` `)[0]} بنجاح ✨`);
  } catch (err) {
    console.error(`Download error:`, err);
    showToast(`❌ حدث خطأ أثناء تنزيل البطاقة`);
  } finally {
    exportCard.remove();
    button.innerHTML = originalText;
    button.disabled = false;
  }
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
