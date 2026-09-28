// ============================================================
//  ملف التعديل الشهري
//  عدّل هذا الملف فقط عند تغيير الشهر أو الموظفين.
// ============================================================

const APP_DATA = {
  monthLabel: `July 2026`,
  pageTitle: `موظف الشهر | دار الدواء`,
  logoUrl: `assets/dar-al-dawa-logo.png`,
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
        { name: `ابراهيم قاسم صالح ضمره`, department: `دائرة المالية`, photoFile: `4137.png` },
    { name: `احمد علي عبد الغني مبارك`, department: `دائرة المالية`, photoFile: `3102.png` },
    { name: `اديب غالب اديب ابوجابر`, department: `البحث والتطوير`, photoFile: `4134.png` },
    { name: `انس احمد سعيد النمروطي`, department: `الإنتاج`, photoFile: `3610.png` },
    { name: `ايهاب وائل احمد ابو زينه`, department: `دائرة المالية`, photoFile: `2314.png` },
    { name: `حازم حسن موسى ابراهيم`, department: `دائرة المالية`, photoFile: `2881.png` },
    { name: `حمزه احمد ابراهيم ناصر`, department: `الهندسة`, photoFile: `3090.png` },
    { name: `ساتيا اسامه تحسين صيام`, department: `الشؤون التنظيمية والعلمية`, photoFile: `3719.png` },
    { name: `قيس فوزي عيسى حسبان`, department: `دائرة المالية`, photoFile: `4011.png` },
    { name: `مجد ضياء الدين منير ابو شعلة`, department: `دائرة المالية`, photoFile: `4086.png` },
    { name: `محمد خليل محمد العماوي`, department: `الإنتاج`, photoFile: `3531.png` },
    { name: `محمد مجاهد محمود ردايده`, department: `البحث والتطوير`, photoFile: `3970.png` },
    { name: `محمد مجدي محمد زاهر سعاده`, department: `البحث والتطوير`, photoFile: `4091.png` },
    { name: `محمد محمود خليل ظاهر`, department: `دائرة المالية`, photoFile: `2040.png` },
    { name: `معاذ خالد خليل ابراهيم`, department: `البحث والتطوير`, photoFile: `3705.png` },
    { name: `مهند عطاالله حسن طه`, department: `دائرة المالية`, photoFile: `3209.png` },
    { name: `هاني نهاد طايع صلاحات`, department: `دائرة المالية`, photoFile: `3297.png` },
    { name: `وائل صابر عطيه ياسين`, department: `دائرة المالية`, photoFile: `2433.png` },
    { name: `يزن نزار ابراهيم النسور`, department: `البحث والتطوير`, photoFile: `3828.png` }

  ]
};

window.APP_DATA = APP_DATA;

