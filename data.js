// ============================================================
//  ملف التعديل الشهري
//  عدّل هذا الملف فقط عند تغيير الشهر أو الموظفين.
// ============================================================

const APP_DATA = {
  monthLabel: `June 2026`,
  pageTitle: `موظف الشهر | دار الدواء`,
  logoUrl: `https://www.dadgroup.com/wp-content/uploads/2023/11/uplift-dad-website-05.png`,
  photoBaseUrl: `https://raw.githubusercontent.com/BaselGhanem/Best-Acheivers/refs/heads/main/Mar/`,
  footerText: `جميع الحقوق محفوظة © 2026 مجموعة دار الدواء`,

  hero: {
    titleMain: `نجوم`,
    titleAccent: `الإنجاز`,
    tagline: `نحتفي اليوم بمن صنعوا الفارق، بجهودهم الاستثنائية وإبداعهم الذي يرتقي بطموحات دار الدواء نحو القمة.`
  },

  navLinks: [
    { label: `الرئيسية`, url: `https://dadgroup.sharepoint.com/sites/Main/SitePages/Human-Resources.aspx`, active: true },
    { label: `الإعلانات`, url: `https://dadgroup.sharepoint.com/:u:/r/sites/Main/SitePages/HR-Announcmnets.aspx`, active: false },
    { label: `العروض`, url: `https://dadgroup.sharepoint.com/:u:/r/sites/Main/SitePages/Offers.aspx`, active: false },
    { label: `السياسات`, url: `https://dadgroup.sharepoint.com/:u:/r/sites/Main/SitePages/HR%20Policies.aspx`, active: false },
    { label: `النشاطات`, url: `https://dadgroup.sharepoint.com/sites/Main/SitePages/HR-Activities.aspx`, active: false }
  ],

  badges: [
    `نجم الفريق`,
    `أداء استثنائي`,
    `شعلة طاقة`,
    `بصمة إبداع`,
    `تميز مستدام`,
    `روح المبادرة`,
    `إنجاز مبهر`,
    `مثال يحتذى`,
    `عطاء بلا حدود`,
    `تفكير مبتكر`
  ],

  employees: [
    {name: `الهام علي صالح السواعير`, department: `عمليات الجودة`, photoFile: `2765.png` },
    { name: `روان زكريا عبد الرحمن الديب`, department: `الموارد البشرية`, photoFile: `3992.png` },
    { name: `ضياء الدين محمد محمود المغربي`, department: `سلسلة التوريد`, photoFile: `3307.png` },
    { name: `عبد الكريم احمد عبد الصويص`, department: `الموارد البشرية`, photoFile: `3997.png` },
    { name: `عصام حازم حافظ سقف الحيط`, department: `الإنتاج`, photoFile: `4083.png` },
    { name: `عمر خلف غنايم غيظان`, department: `الشؤون الإدارية`, photoFile: `1290.png` },
    { name: `عنود عبدالناصر محمد عزمي عاصي`, department: `عمليات الجودة`, photoFile: `3770.png` },
    { name: `مياده جمال عبد الفتاح الحياري`, department: `الموارد البشرية`, photoFile: `3902.png` }

  ]
};

window.APP_DATA = APP_DATA;
