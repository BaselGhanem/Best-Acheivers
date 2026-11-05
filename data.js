// ============================================================
//  ملف التعديل الشهري
//  عدّل هذا الملف فقط عند تغيير الشهر أو الموظفين.
// ============================================================

const APP_DATA = {
  monthLabel: `July 2026`,
  pageTitle: `موظف الشهر | دار الدواء`,
  logoUrl: `assets/dar-al-dawa-logo.png`,
  photoBaseUrl: `Mar/`,
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
    { name: `عبدالله حسام توفيق البلبول`, department: `الإنتاج`, photoFile: `3126.png` },
    { name: `عبدالله ابراهيم خليل ابو مكسر`, department: `الإنتاج`, photoFile: `3800.png` },
    { name: `علي حسن حسين حسين`, department: `الإنتاج`, photoFile: `3883.png` },
    { name: `علي صلاح عبدالله ابو التين`, department: `الإنتاج`, photoFile: `3769.png` },
    { name: `امل خلف سالم السواعير`, department: `الإنتاج`, photoFile: `1785.png` },
    { name: `امل محمود داود السواعير`, department: `الإنتاج`, photoFile: `1390.png` },
    { name: `اماني سميح عبدالله نافع`, department: `الإنتاج`, photoFile: `4077.png` },
    { name: `انس خالد ذياب نجار`, department: `الإنتاج`, photoFile: `2220.png` },
    { name: `ايوب محمد اسماعيل الخطيب`, department: `الإنتاج`, photoFile: `2012.png` },
    { name: `داوود صالح عبدالله المراهفة`, department: `الإنتاج`, photoFile: `3028.png` },
    { name: `ايهاب وائل احمد ابو زينه`, department: `دائرة المالية`, photoFile: `2314.png` },
    { name: `اياد موسى محمد ابو صعيليك`, department: `الإنتاج`, photoFile: `3526.png` },
    { name: `حازم محمد علي عبدالله`, department: `الإنتاج`, photoFile: `3758.png` },
    { name: `هبه هاني محمود العطار`, department: `الشؤون التنظيمية والعلمية`, photoFile: `3540.png` },
    { name: `حسام محمد سليم المساعفة`, department: `الإنتاج`, photoFile: `2916.png` },
    { name: `حسين محمد حسين داوود`, department: `البحث والتطوير`, photoFile: `4041.png` },
    { name: `ابراهيم محمد علي جاد الحق`, department: `الإنتاج`, photoFile: `4235.png` },
    { name: `اياد جمال حسن دويدار`, department: `الإنتاج`, photoFile: `1989.png` },
    { name: `جمال فايز جمال نافع`, department: `دائرة المالية`, photoFile: `2583.png` },
    { name: `جهاد محمد عواد الحيارات`, department: `دائرة الموارد البشرية`, photoFile: `3582.png` },
    { name: `كريم حمدان طاهر ابو رمان`, department: `الإنتاج`, photoFile: `3928.png` },
    { name: `ختام يوسف عبدالرحمن السليحات`, department: `الإنتاج`, photoFile: `1796.png` },
    { name: `ليلى احمد صالح الهلالات`, department: `الإنتاج`, photoFile: `1428.png` },
    { name: `مريم محمد احمد الفنش`, department: `الإنتاج`, photoFile: `3805.png` },
    { name: `محمد عيد ايوب الفار`, department: `الإنتاج`, photoFile: `4030.png` },
    { name: `مهند احمد موسى السواعير`, department: `الإنتاج`, photoFile: `3138.png` },
    { name: `مصعب امين صبري الخواجا`, department: `الإنتاج`, photoFile: `1772.png` },
    { name: `علا عمر محمد العلي`, department: `الإنتاج`, photoFile: `1522.png` },
    { name: `اسامه عصام محمود ابو الرب`, department: `الإنتاج`, photoFile: `3984.png` },
    { name: `رضوان مصطفى حسن ابو عقل`, department: `الإنتاج`, photoFile: `4006.png` },
    { name: `رهف عبد الرحمن عبد الحليم ابو صلاح`, department: `البحث والتطوير`, photoFile: `3953.png` },
    { name: `ريما خلف حامد السواعير`, department: `الشؤون التنظيمية والعلمية`, photoFile: `3480.png` },
    { name: `صدام محمد خليل السنوار`, department: `الإنتاج`, photoFile: `1269.png` },
    { name: `سماح عبدالكريم عبدالعزيز السواعير`, department: `الإنتاج`, photoFile: `2361.png` },
    { name: `سامي عبد الفتاح احمد محمد جرار`, department: `البحث والتطوير`, photoFile: `3020.png` },
    { name: `ساميه رضوان خلف المرايحه`, department: `الإنتاج`, photoFile: `2353.png` },
    { name: `طارق مازن محمد الخطيب`, department: `الإنتاج`, photoFile: `3301.png` },
    { name: `تيسير اسماعيل محمد ابوزيد`, department: `الإنتاج`, photoFile: `2055.png` },
    { name: `وائل لطفي محمد عودة الله`, department: `الإنتاج`, photoFile: `1466.png` },
    { name: `وائل صابر عطيه ياسين`, department: `دائرة المالية`, photoFile: `2433.png` },
    { name: `يوسف نواف يوسف عبدالجابر`, department: `دائرة الإدارية`, photoFile: `2210.png` },

  ]
};

window.APP_DATA = APP_DATA;

