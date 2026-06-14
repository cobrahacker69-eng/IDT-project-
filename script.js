/* ================================================================
   CLDAS — Child Labour Detection & Awareness System
   script.js v2.0 — Complete Interactive Dashboard
   ================================================================ */

'use strict';

const STORAGE_KEYS = {
  theme: 'cldas-theme',
  page: 'cldas-active-page',
  sidebar: 'cldas-sidebar-collapsed',
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function applyChartTheme() {
  const isLight = document.documentElement.dataset.theme === 'light';
  Chart.defaults.color = isLight ? 'rgba(59,29,15,0.92)' : 'rgba(250,247,242,0.9)';
  Chart.defaults.borderColor = isLight ? 'rgba(194,65,12,0.12)' : 'rgba(255,255,255,0.08)';
  Chart.defaults.plugins.legend.labels.color = Chart.defaults.color;
  Chart.defaults.plugins.tooltip.backgroundColor = isLight ? '#fffaf4' : '#1c1917';
  Chart.defaults.plugins.tooltip.borderColor = isLight ? 'rgba(194,65,12,0.16)' : 'rgba(255,255,255,0.08)';
  Object.values(charts).forEach(chart => chart?.update?.());
}

/* ─── EMBEDDED DATA ─────────────────────────────────────────── */
const DB = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  cases2024:   [3100,2900,3400,3800,4100,3600,3200,2800,3000,3300,3700,4200],
  rescued2024: [1800,1600,2100,2200,2600,2300,2000,1700,1900,2100,2400,2800],
  cases2025:   [2800,2600,3100,3500,3900,3300,2900,2500,2700,3000,3400,3800],
  rescued2025: [1700,1500,2000,2100,2500,2200,1900,1600,1800,2000,2300,2700],

  sectors: {
    labels: ['Factories','Construction','Agriculture','Domestic Work','Shops','Street Vendors','Hotels','Mining'],
    values: [22,18,26,14,8,6,4,2],
    colors: ['#f97316','#fb923c','#f59e0b','#dc2626','#fdba74','#ea580c','#c2410c','#7c2d12']
  },

  states: {
    'Uttar Pradesh':     {cases:9840, rescued:6210, enrolled:4820, programs:124, ngos:28, risk:'high',   lat:26.85, lng:80.90},
    'Bihar':             {cases:8720, rescued:5430, enrolled:3980, programs:98,  ngos:22, risk:'high',   lat:25.09, lng:85.31},
    'Rajasthan':         {cases:6540, rescued:4120, enrolled:3100, programs:87,  ngos:18, risk:'high',   lat:27.02, lng:74.21},
    'Madhya Pradesh':    {cases:5810, rescued:3890, enrolled:2940, programs:76,  ngos:16, risk:'high',   lat:22.97, lng:78.65},
    'Maharashtra':       {cases:4920, rescued:3240, enrolled:2710, programs:112, ngos:31, risk:'high',   lat:19.75, lng:75.71},
    'West Bengal':       {cases:4380, rescued:2980, enrolled:2340, programs:68,  ngos:14, risk:'high',   lat:22.98, lng:87.85},
    'Jharkhand':         {cases:3420, rescued:2180, enrolled:1760, programs:48,  ngos:11, risk:'high',   lat:23.61, lng:85.27},
    'Odisha':            {cases:3760, rescued:2340, enrolled:1980, programs:54,  ngos:13, risk:'high',   lat:20.94, lng:84.80},
    'Chhattisgarh':      {cases:3190, rescued:2010, enrolled:1640, programs:42,  ngos:10, risk:'high',   lat:21.27, lng:81.86},
    'Assam':             {cases:2870, rescued:1780, enrolled:1420, programs:38,  ngos:9,  risk:'high',   lat:26.20, lng:92.93},
    'Andhra Pradesh':    {cases:2540, rescued:1690, enrolled:1380, programs:61,  ngos:15, risk:'medium', lat:15.91, lng:79.74},
    'Telangana':         {cases:2310, rescued:1680, enrolled:1290, programs:71,  ngos:17, risk:'medium', lat:17.12, lng:79.01},
    'Karnataka':         {cases:2940, rescued:2010, enrolled:1710, programs:93,  ngos:24, risk:'medium', lat:15.31, lng:75.71},
    'Gujarat':           {cases:2180, rescued:1540, enrolled:1260, programs:84,  ngos:21, risk:'medium', lat:22.25, lng:71.19},
    'Haryana':           {cases:1920, rescued:1380, enrolled:1120, programs:56,  ngos:12, risk:'medium', lat:29.05, lng:76.08},
    'Tamil Nadu':        {cases:1640, rescued:1240, enrolled:1050, programs:102, ngos:26, risk:'medium', lat:11.12, lng:78.65},
    'Punjab':            {cases:1380, rescued:1060, enrolled:870,  programs:64,  ngos:14, risk:'medium', lat:31.14, lng:75.34},
    'Uttarakhand':       {cases:980,  rescued:780,  enrolled:630,  programs:34,  ngos:8,  risk:'medium', lat:30.06, lng:79.01},
    'Manipur':           {cases:640,  rescued:480,  enrolled:390,  programs:22,  ngos:5,  risk:'medium', lat:24.66, lng:93.90},
    'Meghalaya':         {cases:520,  rescued:390,  enrolled:310,  programs:19,  ngos:4,  risk:'medium', lat:25.46, lng:91.36},
    'Nagaland':          {cases:410,  rescued:310,  enrolled:250,  programs:16,  ngos:3,  risk:'medium', lat:26.15, lng:94.56},
    'Tripura':           {cases:380,  rescued:290,  enrolled:230,  programs:14,  ngos:3,  risk:'medium', lat:23.94, lng:91.98},
    'Kerala':            {cases:420,  rescued:380,  enrolled:340,  programs:89,  ngos:19, risk:'low',    lat:10.85, lng:76.27},
    'Himachal Pradesh':  {cases:310,  rescued:290,  enrolled:260,  programs:42,  ngos:8,  risk:'low',    lat:31.10, lng:77.17},
    'Goa':               {cases:120,  rescued:115,  enrolled:108,  programs:28,  ngos:6,  risk:'low',    lat:15.29, lng:74.12},
    'Sikkim':            {cases:80,   rescued:76,   enrolled:70,   programs:18,  ngos:4,  risk:'low',    lat:27.53, lng:88.51},
    'Arunachal Pradesh': {cases:290,  rescued:220,  enrolled:175,  programs:12,  ngos:3,  risk:'low',    lat:28.21, lng:94.72},
    'Mizoram':           {cases:180,  rescued:165,  enrolled:145,  programs:15,  ngos:4,  risk:'low',    lat:23.16, lng:92.93},
  },

  ngos: [
    {rank:1, name:'Bachpan Bachao Andolan',      loc:'New Delhi', cases:342, helped:4820, states:12, rate:94, status:'active'},
    {rank:2, name:'Child Rights and You (CRY)',  loc:'Mumbai',    cases:281, helped:3940, states:19, rate:89, status:'active'},
    {rank:3, name:'UNICEF India',                loc:'Pan India', cases:198, helped:7200, states:28, rate:96, status:'active'},
    {rank:4, name:'Pratham Education Foundation',loc:'Mumbai',    cases:167, helped:2810, states:21, rate:91, status:'active'},
    {rank:5, name:'Save the Children India',     loc:'New Delhi', cases:143, helped:2340, states:15, rate:87, status:'active'},
    {rank:6, name:'Childline India Foundation',  loc:'Mumbai',    cases:412, helped:8900, states:28, rate:93, status:'active'},
    {rank:7, name:'Don Bosco Tech Society',      loc:'Bangalore', cases:98,  helped:1240, states:9,  rate:82, status:'active'},
    {rank:8, name:'Smile Foundation',            loc:'New Delhi', cases:124, helped:1870, states:13, rate:85, status:'active'},
    {rank:9, name:'iPartner India',              loc:'Hyderabad', cases:76,  helped:980,  states:6,  rate:78, status:'pending'},
    {rank:10,name:'Aide et Action India',        loc:'Chennai',   cases:89,  helped:1120, states:8,  rate:81, status:'active'},
    {rank:11,name:'CINI India',                  loc:'Kolkata',   cases:105, helped:1560, states:7,  rate:84, status:'active'},
    {rank:12,name:'Concern India Foundation',    loc:'Mumbai',    cases:62,  helped:740,  states:5,  rate:76, status:'inactive'},
  ],

  timeline: [
    {color:'blue',   time:'10:32 AM', text:'3 children rescued from brick kiln in Bihar — Operation Shield'},
    {color:'green',  time:'09:15 AM', text:'Awareness camp in Jharkhand — 450 attendees, 12 families counselled'},
    {color:'red',    time:'08:47 AM', text:'New complaint registered — domestic worker, South Delhi'},
    {color:'purple', time:'Yesterday',text:'CRY Foundation submitted quarterly report — 1,240 cases documented'},
    {color:'orange', time:'2 days ago',text:'Court convicted factory owner in Kanpur — ₹50,000 fine + 1 yr imprisonment'},
  ],

  news: [
    {tag:'Alert',   cls:'nt-alert',  title:'Bihar reports 15% rise in child labour — task force deployed',      src:'Ministry of Labour · 2h ago'},
    {tag:'Success', cls:'nt-success',title:'Operation Smile rescues 42 children from mica mines in Jharkhand',  src:'NCPCR · 5h ago'},
    {tag:'Policy',  cls:'nt-policy', title:'New amendment to Child Labour Act to include digital exploitation',  src:'Lok Sabha · 1d ago'},
    {tag:'Campaign',cls:'nt-camp',   title:'World Day Against Child Labour — 200 rallies held across India',     src:'UNICEF India · 2d ago'},
  ],

  laws: [
    {icon:'fa-gavel',       cls:'ai-blue',  title:'Child Labour (P&R) Act, 1986', desc:'Prohibits employment of children below 14 years in hazardous occupations and regulates working conditions for 14–18 year olds.',  tags:['National','Labour'],       id:1},
    {icon:'fa-book-open',   cls:'ai-purple',title:'Right to Education Act, 2009',  desc:'Guarantees free and compulsory education to all children aged 6–14 years as a Fundamental Right under Article 21A.',          tags:['Education','Constitutional'],id:2},
    {icon:'fa-shield-halved',cls:'ai-green',title:'POCSO Act, 2012',               desc:'Protection of Children from Sexual Offences — provides strong safeguards against abuse, exploitation and trafficking of minors.',tags:['Protection','Criminal'],    id:3},
    {icon:'fa-balance-scale',cls:'ai-cyan', title:'Juvenile Justice Act, 2015',    desc:'Protects children in conflict with law and those in need of care. Establishes Child Welfare Committees in every district.',     tags:['Justice','Welfare'],        id:4},
    {icon:'fa-link-slash',  cls:'ai-orange',title:'Bonded Labour Abolition Act, 1976',desc:'Abolishes the bonded labour system including child bonded labour and provides for rehabilitation of freed labourers.',        tags:['Bonded','Labour'],          id:5},
    {icon:'fa-globe',       cls:'ai-purple',title:'ILO Convention No. 182',        desc:'Requires immediate elimination of the worst forms of child labour globally. India ratified this in 2017, committing to strict enforcement.',tags:['International','ILO'],id:6},
  ],

  schemes: [
    {icon:'fa-rupee-sign', cls:'ai-blue',  title:'National Child Labour Project (NCLP)', desc:'Provides special schools, vocational training and monthly stipend of ₹150 to children withdrawn from hazardous work.', stat:{label:'Beneficiaries',val:'12.8 Lakh'}},
    {icon:'fa-graduation-cap',cls:'ai-green',title:'Sarva Shiksha Abhiyan (SSA)',         desc:'Universalization of elementary education — free textbooks, uniforms, mid-day meals and remedial coaching.',        stat:{label:'Schools Covered',val:'14.5 Lakh'}},
    {icon:'fa-phone-alt',  cls:'ai-cyan',  title:'Childline India (1098)',               desc:'24×7 emergency helpline for children in distress. Immediate rescue, shelter and legal support.',                     stat:{label:'Calls/Year',val:'80 Lakh+'}},
    {icon:'fa-home',       cls:'ai-purple',title:'Beti Bachao Beti Padhao',              desc:'Promotes girl child survival, protection and education. Targets gender-biased districts with highest child labour.',   stat:{label:'Districts Covered',val:'640+'}},
    {icon:'fa-utensils',   cls:'ai-orange',title:'PM Poshan (Mid-Day Meal)',             desc:'Provides hot cooked meals to children in government schools — reduces absenteeism and incentivises enrollment.',       stat:{label:'Children Reached',val:'11.8 Cr'}},
    {icon:'fa-hands-holding-child',cls:'ai-red',title:'Mission Vatsalya',               desc:'Integrated child protection scheme ensuring safe environment for children in difficult circumstances.',                 stat:{label:'States Covered',val:'All 28'}},
  ],

  rights: [
    {title:'Right to Education',         desc:'Free and compulsory education up to age 14 (Article 21A)'},
    {title:'Right Against Exploitation', desc:'No forced labour or trafficking (Articles 23 & 24)'},
    {title:'Right to Equality',          desc:'No discrimination based on caste, gender or religion (Article 14)'},
    {title:'Right to Life',              desc:'Right to live with dignity and personal liberty (Article 21)'},
    {title:'Right to Health',            desc:'Access to nutrition, healthcare and clean environment (DPSP)'},
    {title:'Right to Play',              desc:'UN Convention on Rights of the Child — Article 31'},
    {title:'Right to Identity',          desc:'Every child has the right to a name, nationality and registration at birth'},
    {title:'Right to Family',            desc:'Children have the right to know and be cared for by their parents'},
  ],

  ngoprogs: [
    {logo:'CRY',  grad:'linear-gradient(135deg,#ff6b35,#f7931e)', name:'Child Rights and You (CRY)',     desc:'Works across 19 states to ensure lasting change in lives of underprivileged children.', stat:'2.1M children · 19 states'},
    {logo:'BBA',  grad:'linear-gradient(135deg,#f97316,#c2410c)', name:'Bachpan Bachao Andolan',          desc:'Founded by Nobel Laureate Kailash Satyarthi — has freed over 92,000 child workers.',    stat:'92K freed · Pan India'},
    {logo:'UNICEF',grad:'linear-gradient(135deg,#009edb,#0067a5)',name:'UNICEF India',                    desc:'Works with government and civil society for children\'s rights, survival and protection.',stat:'450M children · Global'},
    {logo:'PTM',  grad:'linear-gradient(135deg,#10B981,#059669)', name:'Pratham Education Foundation',   desc:'Largest NGO working on quality education for underprivileged children across India.',     stat:'5M+ children · 21 states'},
  ],

  recommendations: [
    {emoji:'🎓', title:'Increase School Enrollment',         desc:'Deploy targeted campaigns in high-risk districts. Partner with panchayats to ensure 100% enrollment of 6–14 year olds.',        priority:'Critical', color:''},
    {emoji:'💰', title:'Financial Support to Families',      desc:'Expand conditional cash transfer programs (NCLP stipend, BPL ration) to all families in hotspot states.',                          priority:'High',     color:'c-purple'},
    {emoji:'📢', title:'Intensify Awareness Campaigns',      desc:'Leverage social media, radio and Gram Sabhas to reach remote tribal areas. Train 10,000+ frontline workers annually.',               priority:'High',     color:'c-green'},
    {emoji:'⚖️', title:'Strict Law Enforcement',             desc:'Establish dedicated vigilance cells in every district. Increase penalties and fast-track courts for child labour violations.',        priority:'Critical', color:'c-orange'},
    {emoji:'🏥', title:'Healthcare & Nutrition',             desc:'Ensure rescued children get immediate medical attention, trauma counseling and nutrition through Anganwadi centers.',                 priority:'Medium',   color:'c-cyan'},
    {emoji:'🤝', title:'NGO Partnership Expansion',          desc:'Onboard 500 more grassroots NGOs in underserved states with digital case management tools and dedicated funding.',                    priority:'Medium',   color:'c-purple'},
  ],

  chatKB: {
    childline:  '📞 **Childline India: 1098** (24×7, toll-free). It provides immediate help for children in distress including rescue, shelter and legal support anywhere in India.',
    laws:       '⚖️ **Key Child Labour Laws:**\n• Child Labour (P&R) Act, 1986 — bans work below 14\n• Right to Education Act, 2009 — free education to 14\n• POCSO Act, 2012 — protection from abuse\n• Juvenile Justice Act, 2015\n• ILO Convention No. 182 (ratified 2017)',
    report:     '🚨 **To report child labour:**\n1. Call Childline: **1098** (free, 24×7)\n2. Call Police: **100**\n3. NCPCR Helpline: **1800-121-2830**\n4. Labour Dept.: **1800-180-5412**\n5. Use the Rescue page on this portal',
    rescue:     '🚁 **Rescue Process:** After a complaint, the Child Welfare Committee and Labour Department coordinate a rescue within 48h (urban) or 72h (rural). Child is then sent for medical check, rehabilitation and school re-enrollment.',
    penalty:    '🔨 **Penalties:** Employers found guilty face 6 months–2 years imprisonment and ₹20,000–50,000 fine. Repeat offenders: up to 3 years imprisonment.',
    schemes:    '📋 **Key Govt. Schemes:**\n• NCLP — special schools + ₹150 stipend\n• Sarva Shiksha Abhiyan — free education\n• PM Poshan — mid-day meals\n• Beti Bachao Beti Padhao\n• Mission Vatsalya — child protection',
    education:  '📚 Rescued children are enrolled in NCLP Special Schools with monthly stipend, mid-day meals, free uniforms and mainstream schooling support. Re-enrollment rate has reached **74%** in 2025.',
    ngo:        '🏢 **Major NGOs:** Bachpan Bachao Andolan (BBA), CRY, UNICEF India, Pratham, Save the Children, Childline Foundation. All coordinate with government for rescue and rehabilitation.',
    help:       '🤝 I can help with:\n• Child labour laws\n• How to report child labour\n• Helpline numbers\n• Rescue procedures\n• Government schemes\n• NGO information\n• Education rights',
  },
};

/* ─── CHART REGISTRY ─────────────────────────────────────── */
const charts = {};

/* ─── LOADING SCREEN ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const bootDelay = prefersReducedMotion ? 150 : 1600;
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    AOS.init({ duration: prefersReducedMotion ? 0 : 550, once: true, offset: 20, disable: prefersReducedMotion });
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleFont = {family:"'Syne',sans-serif",weight:'700',size:13};
    Chart.defaults.plugins.tooltip.bodyFont  = {family:"'DM Sans',sans-serif",size:12};
    Chart.defaults.plugins.tooltip.cornerRadius = 10;
    Chart.defaults.plugins.legend.display = false;

    initDashboard();
    buildAwarenessContent();
    buildTimeline();
    buildNews();
    initCalendar();
    buildNGOTable();
    buildRecCards();
    buildPrioMatrix();
    buildRescueTimeline();
    buildRecentReports();
    startCounters();
    setDate();
    buildStateTable();
    buildStateQuickList();
    restoreUIState();
    applyChartTheme();
  }, bootDelay);
});

/* ─── SIDEBAR ─────────────────────────────────────────────── */
const sidebar    = document.getElementById('sidebar');
const mainWrap   = document.getElementById('mainWrapper');
const backdrop   = document.getElementById('sidebarBackdrop');
const menuBtn    = document.getElementById('menuBtn');
const collapseBtn= document.getElementById('collapseBtn');

menuBtn.addEventListener('click', () => {
  if (window.innerWidth < 992) {
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('show');
  } else {
    const c = sidebar.classList.toggle('collapsed');
    mainWrap.classList.toggle('sidebar-collapsed', c);
    persistSidebarState(c);
  }
});
backdrop.addEventListener('click', () => {
  sidebar.classList.remove('mobile-open');
  backdrop.classList.remove('show');
});
if (collapseBtn) collapseBtn.addEventListener('click', () => {
  sidebar.classList.add('collapsed');
  mainWrap.classList.add('sidebar-collapsed');
  persistSidebarState(true);
});

/* ─── NAVIGATION ──────────────────────────────────────────── */
const pageMap = {
  dashboard:       {title:'Dashboard Overview',     icon:'chart-pie'},
  analytics:       {title:'Labour Analytics',       icon:'chart-bar'},
  risk:            {title:'AI Risk Predictor',      icon:'robot'},
  awareness:       {title:'Awareness Center',       icon:'book-open'},
  rescue:          {title:'Rescue & Complaints',    icon:'hands-helping'},
  map:             {title:'India Live Map',          icon:'map-marked-alt'},
  ngo:             {title:'NGO Management',          icon:'building-ngo'},
  reports:         {title:'Reports & Downloads',    icon:'file-lines'},
  recommendations: {title:'AI Recommendations',    icon:'lightbulb'},
  calendar:        {title:'Campaign Calendar',      icon:'calendar-days'},
  settings:        {title:'Settings',               icon:'gear'},
};

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
    if (window.innerWidth < 992) {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('show');
    }
  });
});

function navigateTo(pageId) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const lnk = document.querySelector(`[data-page="${pageId}"]`);
  if (lnk) lnk.classList.add('active');
  const pg = document.getElementById(`page-${pageId}`);
  if (pg) pg.classList.add('active');
  const info = pageMap[pageId] || {};
  document.getElementById('tbTitle').textContent = info.title || '';
  document.getElementById('tbIcon').className = `fas fa-${info.icon || 'home'}`;
  document.title = `${info.title || 'CLDAS'} | CLDAS`;
  localStorage.setItem(STORAGE_KEYS.page, pageId);
  // Lazy init charts
  if (pageId === 'analytics'       && !charts.ageChart)       initAnalyticsCharts();
  if (pageId === 'risk'            && !charts.radarChart)     initRiskCharts();
  if (pageId === 'rescue'          && !charts.complaintPie)   initComplaintPie();
  if (pageId === 'reports'         && !charts.forecastChart)  initForecastChart();
  if (pageId === 'recommendations' && !charts.impactChart)    initImpactChart();
  if (pageId === 'map')            initMap();
  requestAnimationFrame(() => {
    Object.values(charts).forEach(chart => {
      chart?.resize?.();
      chart?.update?.('none');
    });
    if (mapRendered) renderCustomMap();
  });
  AOS.refresh();
}

/* ─── THEME TOGGLE ────────────────────────────────────────── */
let isDark = true;
function applyTheme(dark) {
  isDark = dark;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.getElementById('themeIcon').className = dark ? 'fas fa-moon' : 'fas fa-sun';
  if (document.getElementById('darkToggle')) document.getElementById('darkToggle').checked = dark;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f172a' : '#f8fafc');
  localStorage.setItem(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
  applyChartTheme();
  applyMapTheme();
  if (mapRendered) renderCustomMap();
  requestAnimationFrame(() => Object.values(charts).forEach(chart => {
    chart?.resize?.();
    chart?.update?.('none');
  }));
}
document.getElementById('themeToggle').addEventListener('click', () => applyTheme(!isDark));
function toggleThemeSettings() { applyTheme(!isDark); }

/* ─── NOTIFICATIONS ───────────────────────────────────────── */
document.getElementById('notifBtn').addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = document.getElementById('notifPanel').classList.toggle('show');
  document.getElementById('notifPanel').setAttribute('aria-hidden', String(!isOpen));
  document.getElementById('notifBtn').setAttribute('aria-expanded', String(isOpen));
});
document.addEventListener('click', () => {
  document.getElementById('notifPanel').classList.remove('show');
  document.getElementById('notifPanel').setAttribute('aria-hidden', 'true');
  document.getElementById('notifBtn').setAttribute('aria-expanded', 'false');
});

/* ─── DATE ────────────────────────────────────────────────── */
function setDate() {
  const el = document.getElementById('currentDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const calTitle = document.getElementById('calTitle');
  if (calTitle && calTitle.textContent.includes('2025')) {
    calTitle.textContent = calTitle.textContent.replace('2025', String(new Date().getFullYear()));
  }
}

function persistSidebarState(collapsed) {
  localStorage.setItem(STORAGE_KEYS.sidebar, collapsed ? '1' : '0');
}

function restoreUIState() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  if (savedTheme) applyTheme(savedTheme === 'dark');

  const savedSidebar = localStorage.getItem(STORAGE_KEYS.sidebar);
  if (savedSidebar === '1' && window.innerWidth >= 992) {
    sidebar.classList.add('collapsed');
    mainWrap.classList.add('sidebar-collapsed');
  }

  const savedPage = localStorage.getItem(STORAGE_KEYS.page);
  if (savedPage && pageMap[savedPage]) navigateTo(savedPage);
}

/* ─── ANIMATED COUNTERS ───────────────────────────────────── */
function startCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target._counted) {
        e.target._counted = true;
        animCount(e.target);
      }
    });
  }, {threshold: 0.4});
  document.querySelectorAll('.counter').forEach(c => io.observe(c));
}
function animCount(el) {
  const target = +el.dataset.target;
  const dur = 1600, step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur).toLocaleString('en-IN');
  }, 16);
}

/* ─── PROGRESS BARS ───────────────────────────────────────── */
function animateProgressBars() {
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-w]').forEach(bar => {
      bar.style.width = bar.dataset.w;
    });
  }, 400);
}
// observe first page
const pgDashboard = document.getElementById('page-dashboard');
const pbObserver = new MutationObserver(() => {
  if (pgDashboard.classList.contains('active')) animateProgressBars();
});
pbObserver.observe(pgDashboard, {attributes: true, attributeFilter: ['class']});
setTimeout(animateProgressBars, 3000); // initial load

/* ─── DASHBOARD CHARTS ────────────────────────────────────── */
function initDashboard() {
  buildLineChart('2024');
  buildDoughnutChart();
  buildBarChart();
  buildPieChart();
}

function buildLineChart(yr) {
  const cases   = yr === '2024' ? DB.cases2024   : DB.cases2025;
  const rescued = yr === '2024' ? DB.rescued2024 : DB.rescued2025;
  const ctx = document.getElementById('lineChart');
  if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.06)';
  if (charts.lineChart) charts.lineChart.destroy();
  charts.lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DB.months,
      datasets: [
        {label:'Cases Detected', data: cases,
         borderColor:'#ea580c', backgroundColor:'rgba(249,115,22,0.10)',
         fill: true, tension: 0.4, borderWidth: 2.5,
         pointBackgroundColor:'#ea580c', pointRadius: 3, pointHoverRadius: 7},
        {label:'Children Rescued', data: rescued,
         borderColor:'#10B981', backgroundColor:'rgba(16,185,129,0.07)',
         fill: true, tension: 0.4, borderWidth: 2.5,
         pointBackgroundColor:'#10B981', pointRadius: 3, pointHoverRadius: 7},
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: {mode:'index', intersect: false},
      plugins: {legend:{display:true, labels:{color:tickColor, usePointStyle:true, pointStyleWidth:20, font:{size:12}}}},
      scales: {
        x: {grid:{color:gridColor}, ticks:{font:{size:11}, color: tickColor}},
        y: {grid:{color:gridColor}, ticks:{font:{size:11}, color: tickColor}}
      }
    }
  });
}

// Year filter buttons
document.querySelectorAll('.chart-yr-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chart-yr-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildLineChart(btn.dataset.yr);
  });
});

function buildDoughnutChart() {
  const ctx = document.getElementById('doughnutChart');
  if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  charts.doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: DB.sectors.labels,
      datasets: [{data: DB.sectors.values, backgroundColor: DB.sectors.colors, borderWidth: 0, hoverOffset: 10}]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {legend:{display:true, position:'bottom', labels:{color:tickColor, usePointStyle:true, font:{size:11}}}, tooltip:{callbacks:{label: c => ` ${c.label}: ${c.raw}%`}}}
    }
  });
  const leg = document.getElementById('doughnutLegend');
  if (leg) {
    leg.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
      DB.sectors.labels.slice(0,4).map((l,i) =>
        `<div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--text-2)">
           <div style="width:10px;height:10px;border-radius:3px;background:${DB.sectors.colors[i]};flex-shrink:0"></div>${l}: ${DB.sectors.values[i]}%
         </div>`
      ).join('') + '</div>';
  }
}

function buildBarChart() {
  const ctx = document.getElementById('barChart');
  if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  const top10 = Object.entries(DB.states).slice(0,10);
  charts.barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(([k]) => k.split(' ')[0]),
      datasets: [
        {label:'Cases',   data: top10.map(([,v]) => v.cases),   backgroundColor:'rgba(239,68,68,0.72)',   borderRadius: 5},
        {label:'Rescued', data: top10.map(([,v]) => v.rescued), backgroundColor:'rgba(16,185,129,0.72)',  borderRadius: 5},
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {legend:{display:true, labels:{color:tickColor, usePointStyle:true, font:{size:11}}}},
      scales: {
        x: {grid:{display:false}, ticks:{font:{size:10}, color:tickColor}},
        y: {grid:{color:gridColor}, ticks:{font:{size:10}, color:tickColor}}
      }
    }
  });
}

function buildPieChart() {
  const ctx = document.getElementById('pieChart');
  if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  charts.pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Rescued','Awaiting Rescue','In Rehab','Re-enrolled'],
      datasets: [{data:[29415,9327,14208,21836], backgroundColor:['#22c55e','#ef4444','#f59e0b','#f97316'], borderWidth:0}]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend:{display:true, position:'bottom', labels:{color:tickColor, usePointStyle:true, font:{size:11}, padding:16}},
        tooltip:{callbacks:{label: c => ` ${c.label}: ${c.raw.toLocaleString('en-IN')}`}}
      }
    }
  });
}

/* ─── ANALYTICS CHARTS ────────────────────────────────────── */
function initAnalyticsCharts() {
  buildAgeChart(); buildGenderChart(); buildSectorChart(); buildYOYChart(); buildHeatmap();
}

function buildAgeChart() {
  const ctx = document.getElementById('ageChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  charts.ageChart = new Chart(ctx, {
    type: 'bar', data: {
      labels: ['5–8 yrs','9–12 yrs','13–15 yrs','15–18 yrs'],
      datasets: [{data:[14,32,38,16], backgroundColor:['rgba(249,115,22,0.85)','rgba(251,146,60,0.85)','rgba(239,68,68,0.8)','rgba(245,158,11,0.8)'], borderRadius:8, borderWidth:0}]
    }, 
    options: {responsive:true, maintainAspectRatio:false, indexAxis:'y',
      scales:{x:{grid:{color:gridColor},ticks:{callback:v=>v+'%', color:tickColor}},y:{grid:{display:false},ticks:{color:tickColor}}},
      plugins:{tooltip:{callbacks:{label:c=>` ${c.raw}% of total cases`}}}}
  });
}

function buildGenderChart() {
  const ctx = document.getElementById('genderChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  charts.genderChart = new Chart(ctx, {
    type: 'doughnut', data: {
      labels:['Male','Female','Others'],
      datasets:[{data:[58,40,2],backgroundColor:['#f97316','#fdba74','#7c2d12'],borderWidth:0,cutout:'65%'}]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:true,position:'bottom',labels:{color:tickColor,usePointStyle:true,font:{size:12},padding:20}},tooltip:{callbacks:{label:c=>` ${c.label}: ${c.raw}%`}}}}
  });
}

function buildSectorChart() {
  const ctx = document.getElementById('sectorChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  charts.sectorChart = new Chart(ctx, {
    type:'bar', data:{
      labels: DB.sectors.labels,
      datasets:[{data:DB.sectors.values, backgroundColor:DB.sectors.colors.map(c=>c+'cc'), borderRadius:8, borderWidth:0}]
    },
    options:{responsive:true,maintainAspectRatio:false,
      scales:{x:{grid:{display:false},ticks:{color:tickColor}},y:{grid:{color:gridColor},ticks:{callback:v=>v+'%', color:tickColor}}},
      plugins:{tooltip:{callbacks:{label:c=>` ${c.raw}% of child labour`}}}}
  });
}

function buildYOYChart() {
  const ctx = document.getElementById('yoyChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  charts.yoyChart = new Chart(ctx, {
    type:'line',
    data:{
      labels:['2019','2020','2021','2022','2023','2024','2025'],
      datasets:[
        {label:'Cases',    data:[54200,61000,48000,45800,43100,38700,34000], borderColor:'#ea580c', backgroundColor:'rgba(249,115,22,0.10)', fill:true, tension:0.4, borderWidth:2.5},
        {label:'Rescued',  data:[18000,21000,22500,24000,26500,29400,32000], borderColor:'#10B981', backgroundColor:'rgba(16,185,129,0.08)', fill:true, tension:0.4, borderWidth:2.5},
        {label:'Enrolled', data:[9000,11000,13000,15200,18000,21800,25000],  borderColor:'#7c2d12', backgroundColor:'rgba(124,45,18,0.10)',  fill:true, tension:0.4, borderWidth:2.5},
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{display:true,labels:{color:tickColor,usePointStyle:true,font:{size:12},padding:20}}},
      scales:{x:{grid:{color:gridColor},ticks:{color:tickColor}},y:{grid:{color:gridColor},ticks:{color:tickColor}}}}
  });
}

function buildHeatmap() {
  const c = document.getElementById('heatmapGrid'); if (!c) return;
  const days = ['S','M','T','W','T','F','S'];
  const risks = ['empty','empty','low','low','med','med','low','low','med','high','high','med','low','low','med','high','high','high','med','low','low','low','med','med','low','low','low','med','high','high','low','low','med','med','low','low','low','med','high','high','med','low','low','empty','empty','empty','empty','empty'];
  const colorMap = {high:'rgba(239,68,68,0.75)',med:'rgba(245,158,11,0.55)',low:'rgba(16,185,129,0.3)',empty:'rgba(255,255,255,0.04)'};
  let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px">${days.map(d=>`<div style="text-align:center;font-size:.62rem;color:var(--text-3)">${d}</div>`).join('')}</div>`;
  html += `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">${risks.map(r=>`<div style="aspect-ratio:1;border-radius:3px;background:${colorMap[r]||colorMap.empty};transition:all .2s" title="Risk: ${r}"></div>`).join('')}</div>`;
  c.innerHTML = html;
}

/* ─── RISK PREDICTION ─────────────────────────────────────── */
function initRiskCharts() {
  const ctx = document.getElementById('radarChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  charts.radarChart = new Chart(ctx, {
    type:'radar',
    data:{
      labels:['Age Risk','Income Risk','Education Risk','Work Hours','Employment Risk','Location Risk'],
      datasets:[{label:'Risk Factors',data:[0,0,0,0,0,0],
        backgroundColor:'rgba(249,115,22,0.12)',borderColor:'#f97316',borderWidth:2,
        pointBackgroundColor:'#f97316',pointRadius:4}]
    },
    options:{responsive:true,maintainAspectRatio:false,
      scales:{r:{min:0,max:100,grid:{color: document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.06)'},angleLines:{color: document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.06)'},
        pointLabels:{font:{size:11},color:tickColor},ticks:{display:false}}}}
  });
}

function predictRisk() {
  const age  = parseInt(document.getElementById('riskAge').value)        || 0;
  const inc  = parseInt(document.getElementById('riskIncome').value)     || 0;
  const edu  = parseInt(document.getElementById('riskEducation').value)  || 0;
  const hrs  = parseInt(document.getElementById('riskHours').value)      || 0;
  const emp  = parseInt(document.getElementById('riskEmployment').value) || 0;
  const loc  = parseInt(document.getElementById('riskLocation').value)   || 0;
  if (!age||!inc||!edu||!hrs||!emp||!loc) { showToast('Please fill all 6 fields.','error'); return; }

  const ageScore = age===5?90:age===9?72:age===13?54:30;
  const incScore = Math.min(100,(5-inc)*22);
  const eduScore = Math.min(100,(5-edu)*22);
  const hrsScore = Math.min(100,(5-hrs)*22);
  const empScore = Math.min(100,(5-emp)*22);
  const locScore = Math.min(100,(5-loc)*22);
  const factors  = [ageScore,incScore,eduScore,hrsScore,empScore,locScore];
  const score    = Math.min(100, Math.round(factors.reduce((a,b)=>a+b,0)/6));

  let level, cls, actions;
  if (score>=70) {
    level='HIGH RISK'; cls='rl-high';
    actions=['Immediate intervention required within 48 hours','File FIR under Child Labour (P&R) Act','Contact Child Welfare Committee','Arrange rescue operation urgently','Ensure immediate medical assessment'];
  } else if (score>=40) {
    level='MEDIUM RISK'; cls='rl-medium';
    actions=['Schedule home visit within 1 week','Counsel parents on education benefits','Link to NCLP scheme for enrollment','Provide BPL ration card assistance','Monthly monitoring for 6 months'];
  } else {
    level='LOW RISK'; cls='rl-low';
    actions=['No immediate intervention needed','Maintain quarterly monitoring','Ensure school attendance is maintained','Provide awareness materials to family','Offer vocational skill training'];
  }

  // Animated gauge SVG
  const col = score>=70?'#EF4444':score>=40?'#F59E0B':'#10B981';
  const dash = score*1.884; // ~(100% of 120deg arc = 188.4)
  document.getElementById('riskResult').innerHTML = `
    <div class="risk-output" style="animation:pageIn .4s ease">
      <svg class="gauge-svg" width="170" height="100" viewBox="0 0 170 100">
        <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10B981"/><stop offset="50%" style="stop-color:#F59E0B"/><stop offset="100%" style="stop-color:#EF4444"/>
        </linearGradient></defs>
        <path d="M 20 90 A 65 65 0 0 1 150 90" stroke="rgba(255,255,255,0.06)" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M 20 90 A 65 65 0 0 1 150 90" stroke="url(#g1)" stroke-width="14" fill="none" stroke-linecap="round"
          stroke-dasharray="${dash} 1000" style="transition:stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"/>
        <text x="85" y="86" text-anchor="middle" fill="white" font-family="Syne,sans-serif" font-size="24" font-weight="800">${score}%</text>
      </svg>
      <div class="risk-level ${cls}">${level}</div>
      <p style="font-size:.78rem;color:var(--text-2);margin:8px 0 14px">AI assessment based on 6 socioeconomic parameters</p>
      <ul class="risk-actions">${actions.map(a=>`<li>${a}</li>`).join('')}</ul>
    </div>`;

  // Update radar
  if (charts.radarChart) {
    charts.radarChart.data.datasets[0].data = factors;
    charts.radarChart.data.datasets[0].borderColor = col;
    charts.radarChart.data.datasets[0].backgroundColor = col==='#EF4444'?'rgba(239,68,68,0.12)':col==='#F59E0B'?'rgba(245,158,11,0.12)':'rgba(16,185,129,0.12)';
    charts.radarChart.data.datasets[0].pointBackgroundColor = col;
    charts.radarChart.update();
  }
  showToast('Risk assessment completed!','success');
}

/* ─── COMPLAINT PIE ───────────────────────────────────────── */
function initComplaintPie() {
  const ctx = document.getElementById('complaintPie'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  charts.complaintPie = new Chart(ctx, {
    type:'doughnut',
    data:{labels:['Resolved','In Progress','Pending','Escalated'],
      datasets:[{data:[6241,1823,678,0],backgroundColor:['#22c55e','#f97316','#f59e0b','#ef4444'],borderWidth:0,cutout:'62%'}]},
    options:{responsive:true,plugins:{legend:{display:true,position:'bottom',labels:{color:tickColor,usePointStyle:true,padding:16}}}}
  });
}

/* ─── RESCUE TIMELINE ─────────────────────────────────────── */
function buildRescueTimeline() {
  const el = document.getElementById('rescueTimeline'); if (!el) return;
  const steps = [
    {icon:'fa-file-alt',          label:'Complaint Received',  done:true,  active:false},
    {icon:'fa-search',            label:'Verification',        done:true,  active:false},
    {icon:'fa-users',             label:'Team Assigned',       done:true,  active:false},
    {icon:'fa-hands-holding-child',label:'Child Rescued',      done:false, active:true},
    {icon:'fa-stethoscope',       label:'Medical Check',       done:false, active:false},
    {icon:'fa-school',            label:'Re-enrollment',       done:false, active:false},
    {icon:'fa-check-circle',      label:'Case Closed',         done:false, active:false},
  ];
  el.innerHTML = steps.map(s => `
    <div class="rt-step ${s.done?'done':''} ${s.active?'active':''}">
      <div class="rt-icon"><i class="fas ${s.icon}"></i></div>
      <div class="rt-label">${s.label}</div>
    </div>`).join('');
}

/* ─── COMPLAINT FORM ──────────────────────────────────────── */
const uploadZone = document.getElementById('uploadZone');
const fileIn     = document.getElementById('fileIn');
if (uploadZone && fileIn) {
  uploadZone.addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', e => { if (e.target.files[0]) showToast(`Attached: ${e.target.files[0].name}`,'success'); });
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); showToast('File attached successfully.','success'); });
}

function submitComplaint() {
  const loc  = document.getElementById('cLoc')?.value;
  const type = document.getElementById('cType')?.value;
  const desc = document.getElementById('cDesc')?.value;
  if (!loc || !type || !desc) { showToast('Please fill location, type and description.','error'); return; }
  const id = 'CL-2025-' + Math.floor(Math.random()*90000+10000);
  showToast(`Complaint submitted successfully. Reference: ${id}`,'success');
  ['cName','cLoc','cDesc'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('cType').value='';
}

function trackComplaint() {
  const id = prompt('Enter Complaint Reference ID (e.g. CL-2025-XXXXX):');
  if (id) {
    const statuses = ['Under Investigation','Rescue Team Deployed','Resolved','Pending Verification'];
    showToast(`${id}: ${statuses[Math.floor(Math.random()*statuses.length)]}. Check rescue tracker for details.`,'info');
  }
}

/* ─── INDIA MAP ───────────────────────────────────────────── */
let mapRendered = false, mapActiveState = null;
let leafletMapInstance = null;
let tileLayerInstance = null;
let mapMarkers = {};
let heatLayerGroup = null;
let isHeatmapActive = false;

function applyMapTheme() {
  if (!mapRendered || !leafletMapInstance || !tileLayerInstance) return;
  const isLight = document.documentElement.dataset.theme === 'light';
  const newUrl = isLight
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  tileLayerInstance.setUrl(newUrl);
}

function initMap() {
  const mapEl = document.getElementById('indiaMap');
  if (!mapEl) return;
  
  if (!leafletMapInstance) {
    mapRendered = true;
    renderCustomMap();
  } else {
    setTimeout(() => {
      leafletMapInstance.invalidateSize();
    }, 50);
  }
}

function buildPopupHTML(name, d) {
  const col = d.risk==='high'?'#EF4444':d.risk==='medium'?'#F59E0B':'#10B981';
  return `<div class="map-popup">
    <div class="mp-head">
      <div class="mp-state">${name}</div>
      <div class="mp-risk"><span style="color:${col};font-weight:700;text-transform:uppercase;font-size:.72rem">${d.risk} Risk</span></div>
    </div>
    <div class="mp-body">
      <div class="mp-stat"><label>Cases</label><strong style="color:#EF4444">${d.cases.toLocaleString('en-IN')}</strong></div>
      <div class="mp-stat"><label>Rescued</label><strong style="color:#10B981">${d.rescued.toLocaleString('en-IN')}</strong></div>
      <div class="mp-stat"><label>Enrolled</label><strong style="color:#7c2d12">${d.enrolled.toLocaleString('en-IN')}</strong></div>
      <div class="mp-stat"><label>Programs</label><strong style="color:#fb923c">${d.programs}</strong></div>
      <div class="mp-stat"><label>NGOs</label><strong style="color:#ea580c">${d.ngos}</strong></div>
      <div class="mp-stat"><label>Rescue %</label><strong style="color:#F59E0B">${Math.round(d.rescued/d.cases*100)}%</strong></div>
    </div>
  </div>`;
}

function renderCustomMap() {
  const mapEl = document.getElementById('indiaMap');
  if (!mapEl) return;
  const isLight = document.documentElement.dataset.theme === 'light';
  const states = Object.entries(DB.states);
  const boardTone = isLight ? 'light' : 'dark';

  mapEl.innerHTML = `
    <div class="map-board ${boardTone}">
      <div class="map-board-main">
        <div class="map-board-title">
          <div>
            <span class="map-kicker">India Overview</span>
            <h3 id="mapFocusTitle">India Overview</h3>
          </div>
          <button class="btn btn-ghost btn-sm" type="button" onclick="resetMap()"><i class="fas fa-crosshairs"></i> Reset View</button>
        </div>
        <div class="map-surface" style="padding:0; overflow:hidden;">
          <div id="leafletMap" style="width: 100%; height: 100%; border-radius: 22px;"></div>
        </div>
      </div>
      <aside class="map-board-side">
        <div class="map-stat">
          <span>States covered</span>
          <strong>${states.length}</strong>
        </div>
        <div class="map-stat">
          <span>High-risk states</span>
          <strong>${states.filter(([,d]) => d.risk === 'high').length}</strong>
        </div>
        <div class="map-stat">
          <span>Total children</span>
          <strong>${Object.values(DB.states).reduce((a, d) => a + d.cases, 0).toLocaleString('en-IN')}</strong>
        </div>
        <div class="map-focus-card" id="mapFocusCard">
          <span class="map-focus-label">Focused State</span>
          <h4 id="sidebarStateName">Uttar Pradesh</h4>
          <div class="map-focus-metrics" id="sidebarStateMetrics">
            <div><label>Cases</label><strong>9,840</strong></div>
            <div><label>Rescued</label><strong>6,210</strong></div>
            <div><label>Enrolled</label><strong>4,820</strong></div>
            <div><label>Risk</label><strong style="color:#EF4444;text-transform:uppercase;">high</strong></div>
          </div>
        </div>
      </aside>
    </div>`;

  const tileUrl = isLight
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Bounds for India
  const indiaBounds = L.latLngBounds([5.0, 65.0], [38.5, 98.5]);

  leafletMapInstance = L.map('leafletMap', {
    zoomControl: false,
    minZoom: 4.5,
    maxZoom: 8,
    maxBounds: indiaBounds,
    maxBoundsViscosity: 1.0,
    scrollWheelZoom: false,
    doubleClickZoom: true
  }).setView([20.5937, 78.9629], 5);

  tileLayerInstance = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(leafletMapInstance);

  L.control.zoom({ position: 'bottomright' }).addTo(leafletMapInstance);

  heatLayerGroup = L.layerGroup().addTo(leafletMapInstance);

  mapMarkers = {};
  states.forEach(([name, d]) => {
    const col = d.risk === 'high' ? '#ef4444' : d.risk === 'medium' ? '#f59e0b' : '#10b981';
    const size = d.risk === 'high' ? 24 : d.risk === 'medium' ? 20 : 16;
    
    const markerIcon = L.divIcon({
      html: `<div class="map-marker" style="background:${col}; --pulse-color: ${col}55;"><span></span></div>`,
      className: `custom-leaflet-marker-${name.replace(/\s+/g, '-')}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    const marker = L.marker([d.lat, d.lng], { icon: markerIcon }).addTo(leafletMapInstance);
    
    marker.bindPopup(buildPopupHTML(name, d), {
      closeButton: false,
      offset: L.point(0, -size / 4)
    });

    marker.on('mouseover', function () {
      this.openPopup();
    });
    marker.on('mouseout', function () {
      if (mapActiveState !== name) {
        this.closePopup();
      }
    });

    marker.on('click', () => {
      focusMapState(name);
    });

    mapMarkers[name] = marker;
  });

  if (mapActiveState) {
    updateMapDisplay(mapActiveState);
  } else {
    resetMapElements();
  }
}

function updateMapDisplay(name) {
  const state = DB.states[name];
  if (!state) return;

  const titleEl = document.getElementById('mapFocusTitle');
  if (titleEl) titleEl.textContent = name;

  const sidebarName = document.getElementById('sidebarStateName');
  if (sidebarName) sidebarName.textContent = name;

  const col = state.risk === 'high' ? '#EF4444' : state.risk === 'medium' ? '#F59E0B' : '#10B981';
  const metricsEl = document.getElementById('sidebarStateMetrics');
  if (metricsEl) {
    metricsEl.innerHTML = `
      <div><label>Cases</label><strong>${state.cases.toLocaleString('en-IN')}</strong></div>
      <div><label>Rescued</label><strong>${state.rescued.toLocaleString('en-IN')}</strong></div>
      <div><label>Enrolled</label><strong>${state.enrolled.toLocaleString('en-IN')}</strong></div>
      <div><label>Risk</label><strong style="color:${col};text-transform:uppercase;">${state.risk}</strong></div>
    `;
  }

  if (leafletMapInstance) {
    leafletMapInstance.flyTo([state.lat, state.lng], 6, {
      animate: true,
      duration: 1.2
    });
  }

  Object.entries(mapMarkers).forEach(([mName, marker]) => {
    if (mName === name) {
      setTimeout(() => {
        marker.openPopup();
      }, 600);
    } else {
      marker.closePopup();
    }
  });
}

function resetMapElements() {
  const titleEl = document.getElementById('mapFocusTitle');
  if (titleEl) titleEl.textContent = 'India Overview';

  const sidebarName = document.getElementById('sidebarStateName');
  if (sidebarName) sidebarName.textContent = 'Uttar Pradesh';

  const featured = DB.states['Uttar Pradesh'];
  const metricsEl = document.getElementById('sidebarStateMetrics');
  if (metricsEl && featured) {
    metricsEl.innerHTML = `
      <div><label>Cases</label><strong>${featured.cases.toLocaleString('en-IN')}</strong></div>
      <div><label>Rescued</label><strong>${featured.rescued.toLocaleString('en-IN')}</strong></div>
      <div><label>Enrolled</label><strong>${featured.enrolled.toLocaleString('en-IN')}</strong></div>
      <div><label>Risk</label><strong style="color:#EF4444;text-transform:uppercase;">${featured.risk}</strong></div>
    `;
  }
}

function resetMap() {
  mapActiveState = null;
  resetMapElements();
  highlightStateRow(null);

  const input = document.getElementById('mapSearch');
  if (input) input.value = '';

  if (leafletMapInstance) {
    leafletMapInstance.flyTo([20.5937, 78.9629], 5, {
      animate: true,
      duration: 1.2
    });
  }

  Object.values(mapMarkers).forEach(marker => {
    marker.closePopup();
  });
}

function toggleHeatmap() {
  isHeatmapActive = !isHeatmapActive;
  const btn = document.getElementById('heatmapToggle');
  if (btn) {
    btn.style.borderColor = isHeatmapActive ? 'var(--danger)' : '';
    btn.style.color = isHeatmapActive ? 'var(--danger)' : '';
  }

  if (heatLayerGroup) {
    heatLayerGroup.clearLayers();
    if (isHeatmapActive) {
      Object.entries(DB.states).forEach(([name, state]) => {
        if (state.risk === 'high') {
          L.circle([state.lat, state.lng], {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.18,
            radius: 120000,
            weight: 1.5,
            dashArray: '4,4'
          }).addTo(heatLayerGroup);
        }
      });
    }
  }

  showToast(isHeatmapActive ? 'Hotspot heatmap enabled.' : 'Hotspot heatmap disabled.', 'info');
}

function filterMapState() {
  const q = document.getElementById('mapSearch').value.trim().toLowerCase();
  document.querySelectorAll('.state-row').forEach(row => {
    row.style.display = row.dataset.name.toLowerCase().includes(q) ? '' : 'none';
  });
  if (q) {
    const match = Object.keys(DB.states).find(name => name.toLowerCase().includes(q));
    if (match) focusMapState(match, false);
  }
}

function highlightStateRow(name) {
  document.querySelectorAll('.state-row').forEach(r => {
    r.style.background = r.dataset.name === name ? 'var(--bg-card-hover)' : '';
  });
  document.querySelectorAll('.leaflet-marker-icon .map-marker').forEach(m => {
    const parent = m.closest('.leaflet-marker-icon');
    const isTarget = name && parent && parent.className.includes(`-${name.replace(/\s+/g, '-')}`);
    m.classList.toggle('active', !!isTarget);
  });
}

function focusMapState(name, updateInput = true) {
  const state = DB.states[name];
  if (!state) return;
  mapActiveState = name;
  if (updateInput) {
    const input = document.getElementById('mapSearch');
    if (input) input.value = name;
  }
  highlightStateRow(name);
  updateMapDisplay(name);
  document.getElementById('page-map')?.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ─── STATE TABLE ─────────────────────────────────────────── */
function buildStateTable() {
  const tbody = document.getElementById('stateTableBody'); if (!tbody) return;
  const sorted = Object.entries(DB.states).sort((a,b) => b[1].cases - a[1].cases).slice(0,10);
  tbody.innerHTML = sorted.map(([name,d],i) => `
    <tr data-name="${name}" class="map-table-row" style="cursor:pointer;">
      <td><div class="rank-num">${i+1}</div></td>
      <td><strong>${name}</strong></td>
      <td><span style="color:var(--danger);font-weight:700;font-family:var(--font-mono)">${d.cases.toLocaleString('en-IN')}</span></td>
      <td><span style="color:var(--success);font-weight:700;font-family:var(--font-mono)">${d.rescued.toLocaleString('en-IN')}</span></td>
      <td><span style="color:var(--primary-light);font-weight:700;font-family:var(--font-mono)">${d.enrolled.toLocaleString('en-IN')}</span></td>
      <td>${d.ngos}</td>
      <td><span class="chip chip-${d.risk}">${d.risk}</span></td>
    </tr>`).join('');

  tbody.querySelectorAll('.map-table-row').forEach(row => {
    row.addEventListener('click', () => {
      focusMapState(row.dataset.name);
    });
  });
}

function buildStateQuickList() {
  const el = document.getElementById('stateQuickList'); if (!el) return;
  const sorted = Object.entries(DB.states).sort((a,b) => b[1].cases - a[1].cases);
  el.innerHTML = sorted.map(([name,d],i) => {
    const col = d.risk==='high'?'var(--danger)':d.risk==='medium'?'var(--warning)':'var(--success)';
    return `<div class="state-row" data-name="${name}">
      <div class="sr-rank">${i+1}</div>
      <div class="sr-name">${name}</div>
      <div class="sr-cases" style="color:${col}">${d.cases.toLocaleString('en-IN')}</div>
    </div>`;
  }).join('');
  document.querySelectorAll('.state-row').forEach(row => {
    row.addEventListener('click', () => {
      const stateName = row.dataset.name;
      const state = DB.states[stateName];
      if (!state) return;
      navigateTo('map');
      setTimeout(() => {
        initMap();
        focusMapState(stateName);
      }, 120);
    });
  });
}

/* ─── NGO TABLE ───────────────────────────────────────────── */
let ngoCurrentPage = 1;
const NGO_PER_PAGE = 5;
let filteredNGOs = null;

function buildNGOTable() { renderNGOTable(); }

function renderNGOTable(data) {
  const d = data || DB.ngos;
  filteredNGOs = d;
  const start = (ngoCurrentPage-1)*NGO_PER_PAGE;
  const slice = d.slice(start, start+NGO_PER_PAGE);
  const tbody = document.getElementById('ngoTableBody'); if (!tbody) return;
  tbody.innerHTML = slice.map(n => {
    const barCol = n.rate>=90?'pf-green':n.rate>=80?'pf-blue':'pf-warn';
    return `<tr>
      <td><div class="rank-num">${n.rank}</div></td>
      <td><strong>${n.name}</strong></td>
      <td>${n.loc}</td>
      <td><span style="font-family:var(--font-mono);color:var(--warning)">${n.cases}</span></td>
      <td><span style="font-family:var(--font-mono);color:var(--success)">${n.helped.toLocaleString('en-IN')}</span></td>
      <td>${n.states}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-track" style="flex:1;height:5px"><div class="progress-fill ${barCol}" style="width:${n.rate}%"></div></div>
          <span style="font-size:.75rem;font-weight:700;font-family:var(--font-mono)">${n.rate}%</span>
        </div>
      </td>
      <td><span class="chip chip-${n.status}">${n.status}</span></td>
    </tr>`;
  }).join('');
  const total = Math.ceil(d.length/NGO_PER_PAGE);
  const info  = document.getElementById('ngoPageInfo');
  if (info) info.textContent = `Showing ${start+1}–${Math.min(start+NGO_PER_PAGE,d.length)} of ${d.length}`;
}

function ngoPage(dir) {
  const d = filteredNGOs || DB.ngos;
  const total = Math.ceil(d.length/NGO_PER_PAGE);
  ngoCurrentPage = Math.max(1, Math.min(total, ngoCurrentPage+dir));
  renderNGOTable(d);
}

function filterNGO() {
  const q = document.getElementById('ngoSearch').value.toLowerCase();
  ngoCurrentPage = 1;
  renderNGOTable(DB.ngos.filter(n => n.name.toLowerCase().includes(q) || n.loc.toLowerCase().includes(q)));
}

/* ─── AWARENESS CONTENT ───────────────────────────────────── */
function buildAwarenessContent() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(`tab-${btn.dataset.tab}`);
      if (pane) pane.classList.add('active');
    });
  });

  // Laws
  const lawsGrid = document.getElementById('lawsGrid');
  if (lawsGrid) lawsGrid.innerHTML = DB.laws.map(l => `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
      <div class="aware-card">
        <div class="aware-icon ${l.cls}"><i class="fas ${l.icon}"></i></div>
        <h4>${l.title}</h4>
        <p>${l.desc}</p>
        <div class="aware-tags">${l.tags.map(t=>`<span class="aware-tag">${t}</span>`).join('')}</div>
        <button class="btn btn-ghost btn-sm btn-read" onclick="showLawModal(${l.id})">Read More <i class="fas fa-arrow-right ms-1"></i></button>
      </div>
    </div>`).join('');

  // Schemes
  const schemesGrid = document.getElementById('schemesGrid');
  if (schemesGrid) schemesGrid.innerHTML = DB.schemes.map(s => `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
      <div class="aware-card">
        <div class="aware-icon ${s.cls}"><i class="fas ${s.icon}"></i></div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <div style="font-size:.8rem;color:var(--text-2);margin-top:4px"><span style="color:var(--text-3)">${s.stat.label}:</span> <strong style="color:var(--text-1)">${s.stat.val}</strong></div>
        <button class="btn btn-ghost btn-sm btn-read">Learn More <i class="fas fa-external-link-alt ms-1"></i></button>
      </div>
    </div>`).join('');

  // Rights
  const rightsGrid = document.getElementById('rightsGrid');
  if (rightsGrid) rightsGrid.innerHTML = DB.rights.map(r => `
    <div class="right-item">
      <i class="fas fa-check-circle"></i>
      <div><h5>${r.title}</h5><p>${r.desc}</p></div>
    </div>`).join('');

  // NGO Programs
  const ngoProgGrid = document.getElementById('ngoProgGrid');
  if (ngoProgGrid) ngoProgGrid.innerHTML = DB.ngoprogs.map(n => `
    <div class="col-md-6 col-lg-3" data-aos="fade-up">
      <div class="aware-card" style="align-items:center;text-align:center">
        <div style="width:64px;height:64px;border-radius:16px;background:${n.grad};display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;color:white;font-size:.8rem;letter-spacing:1px;margin:0 auto">${n.logo}</div>
        <h4>${n.name}</h4>
        <p>${n.desc}</p>
        <div style="font-size:.76rem;color:var(--text-3)">${n.stat}</div>
        <button class="btn btn-ghost btn-sm">Visit Website <i class="fas fa-external-link-alt ms-1"></i></button>
      </div>
    </div>`).join('');
}

/* ─── LAW MODALS ──────────────────────────────────────────── */
const lawDetails = {
  1:{title:'Child Labour (P&R) Act, 1986',body:`<h5>Overview</h5><p>Prohibits employment of children below 14 years in hazardous occupations and regulates working conditions for adolescents aged 14–18.</p><h5>Key Provisions</h5><p><strong>Section 3:</strong> No child employed in occupations listed in the Schedule (Part A).</p><p><strong>2016 Amendment:</strong> Complete ban on work for under-14; ban on hazardous work for 14–18.</p><h5>Penalty</h5><p>6 months–2 years imprisonment and ₹20,000–₹50,000 fine. Repeat: up to 3 years.</p>`},
  2:{title:'Right to Education Act, 2009',body:`<h5>Overview</h5><p>Article 21A guarantees eight years of free and compulsory education as a fundamental right for children aged 6–14.</p><h5>Key Provisions</h5><p>• Neighbourhood schools for all children<br>• No detention up to Class 8<br>• 25% reservation for EWS in private schools<br>• Trained teachers mandatory</p>`},
  3:{title:'POCSO Act, 2012',body:`<h5>Overview</h5><p>Gender-neutral law providing strong legal safeguards for children below 18 years against sexual abuse and exploitation.</p><h5>Key Provisions</h5><p>• Mandatory reporting of offences<br>• Child-friendly court procedures<br>• Special courts for speedy trial<br>• Min. 10 years to life for aggravated offences</p>`},
  4:{title:'Juvenile Justice Act, 2015',body:`<h5>Overview</h5><p>Consolidates law relating to children in conflict with law and children needing care and protection.</p><h5>Key Provisions</h5><p>• Child Welfare Committees in every district<br>• Juvenile Justice Boards<br>• Children's Homes and Observation Homes<br>• Juveniles 16+ tried as adults for heinous offences</p>`},
  5:{title:'Bonded Labour Abolition Act, 1976',body:`<h5>Overview</h5><p>Abolishes the bonded labour system to prevent economic and physical exploitation of weaker sections.</p><h5>Key Provisions</h5><p>• All bonded labour declared illegal<br>• All debts of bonded labourers extinguished<br>• District Magistrate responsible for implementation<br>• State-funded rehabilitation of freed labourers</p>`},
  6:{title:'ILO Convention No. 182',body:`<h5>Overview</h5><p>Requires immediate action for elimination of worst forms of child labour. India ratified in 2017.</p><h5>Worst Forms Defined</h5><p>• All forms of slavery and slave trade<br>• Use of children in armed conflict<br>• Prostitution and pornography<br>• Drug trafficking<br>• Work harmful to health, safety or morals</p>`},
};

function showLawModal(id) {
  const d = lawDetails[id]; if (!d) return;
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalBody').innerHTML = d.body;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('show'); }

/* ─── TIMELINE & NEWS ─────────────────────────────────────── */
function buildTimeline() {
  const el = document.getElementById('activityTimeline'); if (!el) return;
  el.innerHTML = DB.timeline.map(item => `
    <div class="tl-item">
      <div class="tl-left">
        <div class="tl-dot ${item.color}"></div>
        <div class="tl-line"></div>
      </div>
      <div class="tl-content">
        <span class="tl-time">${item.time}</span>
        <div class="tl-text">${item.text}</div>
      </div>
    </div>`).join('');
}

function buildNews() {
  const el = document.getElementById('newsFeed'); if (!el) return;
  el.innerHTML = DB.news.map(n => `
    <div class="news-item">
      <span class="news-tag ${n.cls}">${n.tag}</span>
      <div class="news-body"><p>${n.title}</p><small>${n.src}</small></div>
    </div>`).join('');
}

/* ─── FORECAST CHART ──────────────────────────────────────── */
function initForecastChart() {
  const ctx = document.getElementById('forecastChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  charts.forecastChart = new Chart(ctx, {
    type:'line',
    data:{
      labels:['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028'],
      datasets:[
        {label:'Actual Cases',   data:[54200,61000,48000,45800,43100,38700,null,null,null,null],  borderColor:'#f97316', backgroundColor:'rgba(249,115,22,0.10)',  fill:true,tension:0.4,borderWidth:2.5,pointRadius:4},
        {label:'AI Forecast',    data:[null,null,null,null,null,38700,34000,29500,25200,21000],   borderColor:'#7c2d12', borderDash:[5,5],backgroundColor:'rgba(124,45,18,0.07)',fill:true,tension:0.4,borderWidth:2,pointRadius:4},
        {label:'Rescued Actual', data:[18000,21000,22500,24000,26500,29400,null,null,null,null],  borderColor:'#10B981', backgroundColor:'rgba(16,185,129,0.08)', fill:true,tension:0.4,borderWidth:2.5,pointRadius:4},
        {label:'Rescued Forecast',data:[null,null,null,null,null,29400,32000,34500,36800,38500], borderColor:'#fdba74', borderDash:[5,5],backgroundColor:'rgba(253,186,116,0.10)',fill:true,tension:0.4,borderWidth:2,pointRadius:4},
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{display:true,labels:{color:tickColor,usePointStyle:true,font:{size:12},padding:18}}},
      scales:{x:{grid:{color:gridColor},ticks:{color:tickColor}},y:{grid:{color:gridColor},ticks:{color:tickColor}}}}
  });
}

/* ─── IMPACT CHART ────────────────────────────────────────── */
function initImpactChart() {
  const ctx = document.getElementById('impactChart'); if (!ctx) return;
  const tickColor = getCssVar('--text-2');
  const gridColor = document.documentElement.dataset.theme === 'light' ? 'rgba(194,65,12,0.08)' : 'rgba(255,255,255,0.04)';
  charts.impactChart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Enrollment','Family Aid','Law Cases','Awareness','NGO Reach','Rescue Ops'],
      datasets:[
        {label:'2025 (Current)',data:[58,67,43,89,71,76],backgroundColor:'rgba(249,115,22,0.75)',borderRadius:6},
        {label:'2027 (Target)', data:[90,85,75,95,90,95],backgroundColor:'rgba(16,185,129,0.75)',borderRadius:6},
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      scales:{x:{grid:{display:false},ticks:{color:tickColor}},y:{grid:{color:gridColor},max:100,ticks:{callback:v=>v+'%', color:tickColor}}},
      plugins:{legend:{display:true,labels:{color:tickColor,usePointStyle:true,padding:18}}}}
  });
}

/* ─── RECOMMENDATIONS ─────────────────────────────────────── */
function buildRecCards() {
  const el = document.getElementById('recCards'); if (!el) return;
  el.innerHTML = DB.recommendations.map(r => `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
      <div class="rec-card ${r.color}">
        <span class="rec-emoji">${r.emoji}</span>
        <h5>${r.title}</h5>
        <p>${r.desc}</p>
        <span class="rec-priority chip chip-${r.priority==='Critical'?'high':r.priority==='High'?'medium':'low'}">${r.priority} Priority</span>
      </div>
    </div>`).join('');
}

function buildPrioMatrix() {
  const el = document.getElementById('prioMatrix'); if (!el) return;
  el.innerHTML = `
    <div class="prio-cell urgent"><div class="pc-label">🔴 Urgent &amp; Important</div><div class="pc-desc">Rescue high-risk children in Bihar &amp; UP. Deploy task force within 48 hours.</div></div>
    <div class="prio-cell important"><div class="pc-label">🟡 Important, Not Urgent</div><div class="pc-desc">Strengthen legal framework. Increase NCLP funding allocation for Q3 2025.</div></div>
    <div class="prio-cell plan"><div class="pc-label">🔵 Plan &amp; Schedule</div><div class="pc-desc">Expand NGO network to 150 new districts. Launch digital awareness portal by Dec 2025.</div></div>
    <div class="prio-cell delegate"><div class="pc-label">🟢 Delegate</div><div class="pc-desc">Monthly progress reports, routine data entry and social media awareness posts.</div></div>`;
}

/* ─── RECENT REPORTS ──────────────────────────────────────── */
function buildRecentReports() {
  const el = document.getElementById('recentReports'); if (!el) return;
  const items = [
    {icon:'fa-file-pdf','col':'var(--danger)',  name:'Q2 2025 Full Report',   downloads:'124'},
    {icon:'fa-file-excel','col':'var(--success)',name:'May 2025 Data Export',  downloads:'89'},
    {icon:'fa-file-pdf','col':'var(--danger)',  name:'Annual Report 2024',    downloads:'342'},
    {icon:'fa-file-excel','col':'var(--success)',name:'State Summary 2025',    downloads:'56'},
  ];
  el.innerHTML = items.map(r => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;cursor:pointer;transition:var(--transition)" onmouseenter="this.style.background='var(--bg-card-hover)'" onmouseleave="this.style.background='var(--bg-card)'">
      <i class="fas ${r.icon}" style="font-size:1.3rem;color:${r.col}"></i>
      <div style="flex:1"><div style="font-size:.83rem;font-weight:600">${r.name}</div><div style="font-size:.7rem;color:var(--text-3)">Downloaded ${r.downloads} times</div></div>
      <i class="fas fa-download" style="color:var(--text-3);font-size:.85rem"></i>
    </div>`).join('');
}

function genReport(type) {
  const labels = {'monthly-pdf':'Monthly PDF','excel':'Annual Excel','state':'State-wise','custom':'Custom report'};
  showToast(`${labels[type]||'Report'} generating. Download will start shortly.`,'info');
}

/* ─── CALENDAR ────────────────────────────────────────────── */
let calYear = new Date().getFullYear(), calMonth = 5;
const calEvents = [2,7,12,15,21,28];
const calEvData = [
  {day:2,  title:'Awareness Rally — Patna, Bihar',       color:''},
  {day:7,  title:'Child Welfare Committee Meeting',       color:'orange'},
  {day:12, title:'Rescue Operation — Kanpur, UP',        color:'red'},
  {day:15, title:'NGO Summit — New Delhi',               color:'green'},
  {day:21, title:'Training Workshop — Mumbai',           color:''},
  {day:28, title:'World Day Against Child Labour',        color:'red'},
];

function initCalendar() { renderCalendar(); renderCalEvents(); }

function renderCalendar() {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calTitle').textContent = `${months[calMonth]} ${calYear}`;
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear()===calYear && today.getMonth()===calMonth;
  const days = document.getElementById('calDays'); if (!days) return;
  const labels = document.getElementById('calDayLabels'); if (!labels) return;
  labels.innerHTML = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-day-label">${d}</div>`).join('');
  let html = '';
  for (let i=0;i<firstDay;i++) html += `<div class="cal-day other-month"></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const isToday = isThisMonth && d===today.getDate();
    const hasEv = calEvents.includes(d);
    html += `<div class="cal-day${isToday?' today':''}${hasEv?' has-event':''}" onclick="onCalDay(${d})">${d}</div>`;
  }
  days.innerHTML = html;
}

function renderCalEvents() {
  const el = document.getElementById('calEventList'); if (!el) return;
  el.innerHTML = calEvData.map(e => `
    <div class="cal-event-item ${e.color}">
      <strong>June ${e.day} — ${e.title}</strong>
      <span>Click day for details</span>
    </div>`).join('');
}

function calNav(dir) { calMonth += dir; if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function onCalDay(d) { if(calEvents.includes(d)) showToast(`June ${d}: ${calEvData.find(e=>e.day===d)?.title||'Event scheduled'}`,'info'); }

/* ─── CHATBOT ─────────────────────────────────────────────── */
document.getElementById('chatFab').addEventListener('click', () => {
  const isOpen = document.getElementById('chatWindow').classList.toggle('open');
  document.getElementById('chatWindow').setAttribute('aria-hidden', String(!isOpen));
  document.getElementById('chatFab').setAttribute('aria-expanded', String(isOpen));
});
document.getElementById('chatClose').addEventListener('click', () => {
  document.getElementById('chatWindow').classList.remove('open');
  document.getElementById('chatWindow').setAttribute('aria-hidden', 'true');
  document.getElementById('chatFab').setAttribute('aria-expanded', 'false');
});

function sendQuick(msg) { document.getElementById('chatInput').value = msg; sendChat(); }

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim(); if (!msg) return;
  inp.value = '';
  appendMsg(msg, 'user');
  document.getElementById('chatQuick').style.display = 'none';
  // Typing indicator
  const tid = 'typing' + Date.now();
  document.getElementById('chatMessages').insertAdjacentHTML('beforeend',
    `<div class="msg bot" id="${tid}"><div class="msg-av"><i class="fas fa-robot"></i></div><div class="msg-bubble chat-typing"><span></span><span></span><span></span></div></div>`);
  scrollChat();
  setTimeout(() => {
    document.getElementById(tid)?.remove();
    appendMsg(getBotReply(msg), 'bot');
  }, 700 + Math.random()*600);
}

function getBotReply(msg) {
  const q = msg.toLowerCase();
  if (q.match(/childline|1098|helpline|emergency number/)) return DB.chatKB.childline;
  if (q.match(/law|act|legal|rte|pocso|legislation/))        return DB.chatKB.laws;
  if (q.match(/report|complain|file|how to/))                return DB.chatKB.report;
  if (q.match(/rescue|operation|process|procedure/))         return DB.chatKB.rescue;
  if (q.match(/penalty|punishment|fine|jail|prison/))        return DB.chatKB.penalty;
  if (q.match(/scheme|program|government|nclp|ssa/))         return DB.chatKB.schemes;
  if (q.match(/school|education|enroll|learn/))              return DB.chatKB.education;
  if (q.match(/ngo|organisation|organization|cry|bba/))      return DB.chatKB.ngo;
  if (q.match(/hello|hi|hey|good morning|good evening/))     return 'Hello. I am CLDAS AI. I can help with child labour laws, helplines, rescue procedures and more. Type **help** to see what I can do.';
  if (q.match(/help|what can|options/))                       return DB.chatKB.help;
  if (q.match(/thank/))                                       return 'You are welcome. Together we can protect every child\'s right to a safe and educated childhood.';
  return `I couldn't find a specific answer for **"${msg}"**. Try asking about:\n• Child labour laws\n• Childline number\n• How to report child labour\n• Government schemes\n\nOr type **help** for all options.`;
}

function appendMsg(text, role) {
  const html = `<div class="msg ${role}">
    <div class="msg-av"><i class="fas fa-${role==='bot'?'robot':'user'}"></i></div>
    <div class="msg-bubble">${text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>
  </div>`;
  document.getElementById('chatMessages').insertAdjacentHTML('beforeend', html);
  scrollChat();
}
function scrollChat() { const c = document.getElementById('chatMessages'); c.scrollTop = c.scrollHeight; }

/* ─── EXPORT ──────────────────────────────────────────────── */
function exportData() { showToast('Data exported as CSV successfully.','success'); }

/* ─── SIDEBAR SEARCH ──────────────────────────────────────── */
document.getElementById('sidebarSearch')?.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.nav-link').forEach(l => {
    l.style.display = l.querySelector('.nav-text')?.textContent.toLowerCase().includes(q) || !q ? '' : 'none';
  });
});

/* ─── GLOBAL SEARCH ───────────────────────────────────────── */
document.getElementById('globalSearch')?.addEventListener('keydown', e => {
  if (e.key==='Enter') {
    const q = e.target.value.trim().toLowerCase();
    const pageKeys = Object.keys(pageMap);
    const found = pageKeys.find(k => pageMap[k].title.toLowerCase().includes(q));
    if (found) { navigateTo(found); showToast(`Navigated to ${pageMap[found].title}.`,'info'); e.target.value=''; }
    else showToast('No matching page found. Try "map", "risk", "ngo"…','error');
  }
});

/* ─── TOAST ───────────────────────────────────────────────── */
function showToast(msg, type='info') {
  const icons = {success:'Success',error:'Error',info:'Info'};
  const el = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.innerHTML = `<span>${icons[type]||'Info'}</span><span>${msg}</span>`;
  document.getElementById('toastWrap').appendChild(el);
  setTimeout(() => el.remove(), 3300);
}

/* ─── INIT DONE ───────────────────────────────────────────── */
console.log('%cCLDAS v2.0 — Enterprise Dashboard Ready ✓', 'color:#f97316;font-family:Syne,sans-serif;font-size:1.1rem;font-weight:800');

/* ── ADDITIONAL POLISH ─────────────────────────────────────── */

// Re-animate progress bars when switching back to dashboard
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.progress-fill[data-w]').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = bar.dataset.w; }, 80);
      });
      // Re-run counters on newly visible page
      document.querySelectorAll('.page.active .counter:not([data-counted])').forEach(c => {
        c._counted = true; animCount(c);
      });
    }, 100);
  });
});

// Map: ensure init fires when navigating to map page
document.querySelector('[data-page="map"]')?.addEventListener('click', () => {
  setTimeout(() => {
    initMap();
    if (mapRendered) renderCustomMap();
  }, 400);
});

// Topbar profile dropdown (simple toggle)
const profileMenu = document.getElementById('profileMenu');
document.getElementById('tbProfile')?.addEventListener('click', e => {
  e.stopPropagation();
  profileMenu?.classList.toggle('show');
  profileMenu?.setAttribute('aria-hidden', profileMenu?.classList.contains('show') ? 'false' : 'true');
});
profileMenu?.querySelectorAll('.profile-menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.profile;
    const role = btn.dataset.role;
    const tbName = document.getElementById('tbProfileName');
    const sbName = document.querySelector('.sb-user-name');
    const sbRole = document.querySelector('.sb-user-role');
    const wbName = document.querySelector('.wb-title span');
    const cardName = document.getElementById('profileCardName');
    const cardRole = document.getElementById('profileCardRole');
    if (tbName) tbName.textContent = name;
    if (sbName) sbName.textContent = name;
    if (sbRole) sbRole.textContent = role;
    if (wbName) wbName.textContent = name;
    if (cardName) cardName.textContent = name;
    if (cardRole) cardRole.textContent = role;
    showToast(`Switched profile to ${name}.`, 'success');
    profileMenu?.classList.remove('show');
    profileMenu?.setAttribute('aria-hidden', 'true');
  });
});
document.addEventListener('click', () => {
  profileMenu?.classList.remove('show');
  profileMenu?.setAttribute('aria-hidden', 'true');
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key==='k') { e.preventDefault(); document.getElementById('globalSearch')?.focus(); }
  }
  if (e.key === '/' && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    document.getElementById('chatWindow')?.classList.add('open');
    document.getElementById('chatWindow')?.setAttribute('aria-hidden', 'false');
    document.getElementById('chatFab')?.setAttribute('aria-expanded', 'true');
    document.getElementById('chatInput')?.focus();
  }
  if (e.key==='Escape') {
    closeModal();
    document.getElementById('chatWindow')?.classList.remove('open');
    document.getElementById('chatWindow')?.setAttribute('aria-hidden', 'true');
    document.getElementById('chatFab')?.setAttribute('aria-expanded', 'false');
    document.getElementById('notifPanel')?.classList.remove('show');
    document.getElementById('notifPanel')?.setAttribute('aria-hidden', 'true');
    document.getElementById('notifBtn')?.setAttribute('aria-expanded', 'false');
  }
});

// Auto-update date every minute
setInterval(setDate, 60000);

// Simulate live counter pulse every 30s
setInterval(() => {
  const badges = document.querySelectorAll('.live-chip');
  badges.forEach(b => { b.style.opacity='0.5'; setTimeout(()=>b.style.opacity='1',400); });
}, 30000);

// State table row click → open map popup simulation
document.addEventListener('click', e => {
  const row = e.target.closest('tr');
  if (row && row.closest('#stateTableBody')) {
    document.querySelectorAll('#stateTableBody tr').forEach(r => r.classList.remove('highlighted'));
    row.classList.add('highlighted');
    const stateName = row.dataset.name;
    const state = DB.states[stateName];
    if (state) {
      navigateTo('map');
      setTimeout(() => {
        initMap();
        focusMapState(stateName);
      }, 120);
    }
  }
});

// Export: generate a real CSV-like content
function exportDataCSV() {
  const rows = [['State','Cases','Rescued','Enrolled','Programs','NGOs','Risk']];
  Object.entries(DB.states).forEach(([name,d]) => {
    rows.push([name,d.cases,d.rescued,d.enrolled,d.programs,d.ngos,d.risk]);
  });
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'CLDAS_State_Data_2025.csv';
  a.click();
  showToast('CSV file downloaded.', 'success');
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
// Override exportData to actually download
window.exportData = exportDataCSV;

// Sidebar collapse restore button
const expandBtn = document.createElement('button');
expandBtn.innerHTML = '<i class="fas fa-bars"></i>';
expandBtn.style.cssText = 'position:fixed;top:14px;left:14px;z-index:201;background:var(--bg-2);border:1px solid var(--border);color:var(--text-2);width:36px;height:36px;border-radius:10px;display:none;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;font-size:.9rem';
expandBtn.id = 'expandSidebarBtn';
expandBtn.title = 'Expand sidebar';
expandBtn.addEventListener('click', () => {
  sidebar.classList.remove('collapsed');
  mainWrap.classList.remove('sidebar-collapsed');
  expandBtn.style.display = 'none';
  persistSidebarState(false);
});
document.body.appendChild(expandBtn);

const collapseObs = new MutationObserver(() => {
  const isCollapsed = sidebar.classList.contains('collapsed');
  expandBtn.style.display = isCollapsed && window.innerWidth >= 992 ? 'flex' : 'none';
});
collapseObs.observe(sidebar, {attributes:true, attributeFilter:['class']});

// Responsive: handle resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 992) {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('show');
  }
  if (mapRendered) renderCustomMap();
});

console.log('%cControls: Ctrl+K = Search  |  Ctrl+/ = Chat  |  Esc = Close', 'color:#fb923c;font-size:.85rem');
