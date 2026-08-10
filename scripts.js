const DATA = window.APP_DATA;
let currentIndex = 0;
let touchStartX = 0;
let toastTimer;
let transitionLocked = false;

const elements = {};

function employeePhotoUrl(employee) {
  if (employee.photo) return employee.photo;
  if (employee.photoFile) return `${DATA.photoBaseUrl}${employee.photoFile}`;
  return null;
}

function preloadImage(src, useCors = true) {
  return new Promise((resolve) => {
    const image = new Image();
    if (useCors) image.crossOrigin = `anonymous`;
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

async function resolveEmployeeImage(employee) {
  const employeeSrc = employeePhotoUrl(employee);

  if (employeeSrc && await preloadImage(employeeSrc)) {
    return { src: employeeSrc, isFallback: false };
  }

  await preloadImage(DATA.logoUrl, false);
  return { src: DATA.logoUrl, isFallback: true };
}

function applyEmployeeImage(employee, imageData) {
  const fallback = imageData ?? {
    src: employeePhotoUrl(employee) || DATA.logoUrl,
    isFallback: !employeePhotoUrl(employee)
  };

  if (fallback.isFallback) {
    elements.photo.removeAttribute(`crossorigin`);
  } else {
    elements.photo.crossOrigin = `anonymous`;
  }
  elements.photo.classList.toggle(`is-logo-fallback`, fallback.isFallback);
  elements.photo.src = fallback.src;
  elements.photo.alt = fallback.isFallback ? `شعار دار الدواء` : employee.name;
  elements.photo.onerror = () => {
    elements.photo.onerror = null;
    elements.photo.classList.add(`is-logo-fallback`);
    elements.photo.removeAttribute(`crossorigin`);
    elements.photo.src = DATA.logoUrl;
    elements.photo.alt = `شعار دار الدواء`;
  };
}

function formatNumber(number) {
  return String(number).padStart(2, `0`);
}

function buildNavigation() {
  elements.slideNumbers.innerHTML = ``;
  DATA.employees.forEach((employee, index) => {
    const button = document.createElement(`button`);
    button.className = `slide-number`;
    button.type = `button`;
    button.textContent = formatNumber(index + 1);
    button.setAttribute(`aria-label`, `عرض ${employee.name}`);
    button.addEventListener(`click`, () => goToSlide(index));
    elements.slideNumbers.appendChild(button);
  });
}

function updateSlide(imageData = null) {
  const employee = DATA.employees[currentIndex];
  applyEmployeeImage(employee, imageData);
  elements.name.textContent = employee.name;
  elements.department.textContent = employee.department;
  elements.badgeText.textContent = DATA.badges[currentIndex % DATA.badges.length];
  elements.counter.textContent = `${formatNumber(currentIndex + 1)} / ${formatNumber(DATA.employees.length)}`;
  elements.mobileCounter.textContent = `${currentIndex + 1} من ${DATA.employees.length}`;
  elements.progress.style.width = `${((currentIndex + 1) / DATA.employees.length) * 100}%`;

  let activeButton;
  elements.slideNumbers.querySelectorAll(`.slide-number`).forEach((button, index) => {
    button.classList.toggle(`is-active`, index === currentIndex);
    button.setAttribute(`aria-current`, index === currentIndex ? `true` : `false`);
    if (index === currentIndex) activeButton = button;
  });
  activeButton?.scrollIntoView({ behavior: `smooth`, block: `nearest`, inline: `center` });
}

async function goToSlide(index) {
  const nextIndex = (index + DATA.employees.length) % DATA.employees.length;
  if (nextIndex === currentIndex || transitionLocked) return;

  transitionLocked = true;
  elements.slide.classList.add(`is-changing`);
  elements.slide.setAttribute(`aria-busy`, `true`);

  try {
    const [imageData] = await Promise.all([
      resolveEmployeeImage(DATA.employees[nextIndex]),
      new Promise((resolve) => window.setTimeout(resolve, 140))
    ]);

    currentIndex = nextIndex;
    updateSlide(imageData);

    try {
      await elements.photo.decode();
    } catch {
      // The onerror fallback in applyEmployeeImage handles failed decoding.
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  } finally {
    elements.slide.classList.remove(`is-changing`);
    elements.slide.removeAttribute(`aria-busy`);
    transitionLocked = false;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add(`is-visible`);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove(`is-visible`), 3200);
}

async function imageToDataUrl(image) {
  if (image.src.startsWith(`data:`)) return () => {};
  const original = image.src;
  try {
    const response = await fetch(original, { cache: `no-store` });
    if (!response.ok) throw new Error(`Image request failed`);
    const blob = await response.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    image.removeAttribute(`crossorigin`);
    image.src = dataUrl;
    await image.decode();
    return () => {
      image.crossOrigin = `anonymous`;
      image.src = original;
    };
  } catch (error) {
    console.warn(`Could not inline employee image`, error);
    return () => {};
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement(`a`);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function downloadCurrentCard() {
  const employee = DATA.employees[currentIndex];
  const originalText = elements.download.innerHTML;
  elements.download.disabled = true;
  elements.download.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>جاري التجهيز...</span>`;
  let restoreImage = () => {};

  try {
    await document.fonts.ready;
    if (!elements.photo.complete) await elements.photo.decode();
    restoreImage = await imageToDataUrl(elements.photo);

    const exportCard = document.createElement(`article`);
    exportCard.className = `export-card`;
    exportCard.dir = `rtl`;
    exportCard.style.cssText = `position:fixed;inset:0 auto auto 0;width:1080px;height:1350px;z-index:9999;background:#032f2b;color:#fff8e9;font-family:Almarai,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:90px;text-align:center;`;
    exportCard.innerHTML = `<div style="color:#f2ce70;font-size:34px;font-weight:800;margin-bottom:48px;">نجوم الإنجاز</div><img crossorigin="anonymous" src="${elements.photo.src}" style="width:430px;height:430px;border-radius:50%;object-fit:cover;object-position:center top;border:12px solid #fff8e9;box-shadow:0 0 0 8px #d8ad43;margin-bottom:60px;"><h2 style="font-size:58px;line-height:1.35;margin:0 0 28px;">${employee.name}</h2><div style="font-size:28px;color:#4cb6a9;margin-bottom:34px;">${employee.department}</div><div style="font-size:28px;font-weight:800;color:#6a4b05;background:#f2ce70;border-radius:999px;padding:20px 48px;">${DATA.badges[currentIndex % DATA.badges.length]}</div><p style="font-size:25px;line-height:1.8;color:rgba(255,248,233,.74);margin:50px 0 0;">نقدّر تفانيك وإسهاماتك المتميزة التي تصنع فرقًا حقيقيًا في نجاحنا المشترك.</p>`;
    document.body.appendChild(exportCard);
    const exportImage = exportCard.querySelector(`img`);
    if (!exportImage.complete) await exportImage.decode();
    const blob = await htmlToImage.toBlob(exportCard, { pixelRatio: 1, width: 1080, height: 1350, backgroundColor: `#032f2b`, skipFonts: true });
    exportCard.remove();
    if (!blob) throw new Error(`Export failed`);
    triggerDownload(blob, `نجم-الإنجاز-${employee.name.split(` `)[0]}.png`);
    showToast(`تم تنزيل بطاقة ${employee.name.split(` `)[0]} بنجاح`);
  } catch (error) {
    console.error(error);
    showToast(`تعذر تنزيل البطاقة`);
  } finally {
    restoreImage();
    elements.download.disabled = false;
    elements.download.innerHTML = originalText;
  }
}

document.addEventListener(`DOMContentLoaded`, () => {
  if (!DATA?.employees?.length) return;
  Object.assign(elements, {
    slide: document.getElementById(`slide`),
    photo: document.getElementById(`employee-photo`),
    name: document.getElementById(`employee-name`),
    department: document.getElementById(`employee-department`),
    badgeText: document.querySelector(`#employee-badge b`),
    counter: document.getElementById(`slide-counter`),
    mobileCounter: document.getElementById(`mobile-slide-counter`),
    progress: document.getElementById(`footer-progress-fill`),
    slideNumbers: document.getElementById(`slide-numbers`),
    download: document.getElementById(`download`),
    toast: document.getElementById(`toast`)
  });

  document.getElementById(`brand-logo`).src = DATA.logoUrl;
  buildNavigation();
  updateSlide();

  document.getElementById(`previous`).addEventListener(`click`, () => goToSlide(currentIndex - 1));
  document.getElementById(`jump-previous`).addEventListener(`click`, () => goToSlide(currentIndex - 1));
  document.getElementById(`next`).addEventListener(`click`, () => goToSlide(currentIndex + 1));
  document.getElementById(`jump-next`).addEventListener(`click`, () => goToSlide(currentIndex + 1));
  elements.download.addEventListener(`click`, downloadCurrentCard);

  document.addEventListener(`keydown`, (event) => {
    if (event.key === `ArrowRight`) goToSlide(currentIndex - 1);
    if (event.key === `ArrowLeft`) goToSlide(currentIndex + 1);
  });

  elements.slide.addEventListener(`touchstart`, (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  elements.slide.addEventListener(`touchend`, (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 55) return;
    goToSlide(currentIndex + (distance > 0 ? 1 : -1));
  }, { passive: true });
});
