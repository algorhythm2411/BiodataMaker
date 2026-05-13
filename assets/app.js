
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  template: 'classic',
  language: 'en',
  photoDataUrl: ''
};

const defaults = {
  fullName: 'Priya Sharma',
  gender: 'Female',
  dob: '14-02-1996',
  birthTime: '08:45 AM',
  height: '5\'4" / 162 cm',
  complexion: 'Fair',
  religion: 'Hindu',
  community: 'Brahmin',
  gotra: 'Kaushik',
  rashi: 'Mesh',
  nakshatra: 'Ashwini',
  manglik: 'Not Applicable',
  fatherName: 'Rajesh Sharma',
  fatherOccupation: 'Business',
  motherName: 'Sangeeta Sharma',
  motherOccupation: 'Homemaker',
  education: 'MBA',
  occupation: 'Brand Manager',
  company: 'Pune, Maharashtra',
  income: '₹10 LPA',
  city: 'Pune',
  motherTongue: 'Marathi',
  mobile: '+91 98xxxxxx',
  email: 'priya@example.com',
  about: 'Simple, respectful, family-oriented and passionate about personal growth.',
  partnerPref: 'Looking for a caring, well-educated partner from a respectful family.'
};

const labels = {
  en: {
    header: 'Indian Marriage Biodata Maker',
    langBtn: 'हिन्दी',
    templateName: { classic: 'Classic Gold', modern: 'Modern Navy', soft: 'Soft Floral' }
  },
  hi: {
    header: 'भारतीय विवाह बायोडाटा मेकर',
    langBtn: 'English',
    templateName: { classic: 'क्लासिक गोल्ड', modern: 'मॉडर्न नेवी', soft: 'सॉफ्ट फ्लोरल' }
  }
};

const fieldMap = [
  ['fullName','Name'],
  ['gender','Gender'],
  ['dob','DOB'],
  ['birthTime','Birth time'],
  ['height','Height'],
  ['complexion','Complexion'],
  ['religion','Religion'],
  ['community','Community / Caste'],
  ['gotra','Gotra'],
  ['rashi','Rashi'],
  ['nakshatra','Nakshatra'],
  ['manglik','Manglik'],
  ['fatherName',"Father"],
  ['fatherOccupation',"Father's occupation"],
  ['motherName',"Mother"],
  ['motherOccupation',"Mother's occupation"],
  ['education','Education'],
  ['occupation','Occupation'],
  ['company','Company / Business'],
  ['income','Income'],
  ['city','City'],
  ['motherTongue','Mother tongue'],
  ['mobile','Mobile'],
  ['email','Email']
];

function getFormData() {
  const form = $('#biodataForm');
  const data = Object.fromEntries(new FormData(form).entries());
  return { ...defaults, ...data, photoDataUrl: state.photoDataUrl };
}

function escapeHtml(str='') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function rowHTML(label, value) {
  return `
    <div class="data-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || '—')}</strong>
    </div>
  `;
}

function renderPreview() {
  const data = getFormData();
  const template = state.template;
  const paper = $('#previewCard');
  paper.className = `preview-paper template-${template}`;

  $('#templateName').textContent = labels[state.language].templateName[template];
  $('#pName').textContent = data.fullName || defaults.fullName;
  $('#pSubtitle').textContent = `${data.religion || defaults.religion} • ${data.gender || defaults.gender} • ${data.city || defaults.city}`;

  const personal = [
    ['DOB', data.dob],
    ['Birth time', data.birthTime],
    ['Height', data.height],
    ['Complexion', data.complexion],
    ['Religion', data.religion],
    ['Community', data.community],
    ['Gotra', data.gotra],
    ['Rashi', data.rashi],
    ['Nakshatra', data.nakshatra],
    ['Manglik', data.manglik],
    ['Mother tongue', data.motherTongue]
  ];

  const family = [
    ['Father', data.fatherName],
    ["Father's occupation", data.fatherOccupation],
    ['Mother', data.motherName],
    ["Mother's occupation", data.motherOccupation]
  ];

  const career = [
    ['Education', data.education],
    ['Occupation', data.occupation],
    ['Company / Business', data.company],
    ['Income', data.income],
    ['Contact', data.mobile],
    ['Email', data.email]
  ];

  $('#pPersonal').innerHTML = personal.map(([l,v]) => rowHTML(l, v)).join('');
  $('#pFamily').innerHTML = family.map(([l,v]) => rowHTML(l, v)).join('');
  $('#pCareer').innerHTML = career.map(([l,v]) => rowHTML(l, v)).join('');
  $('#pAbout').innerHTML = escapeHtml(data.about || '—').replace(/\n/g, '<br>');
  $('#pPref').innerHTML = `<strong>Partner preference:</strong> ${escapeHtml(data.partnerPref || '—')}`;

  const previewPhoto = $('#previewPhoto');
  const photoPreview = $('#photoPreview');
  if (data.photoDataUrl) {
    previewPhoto.src = data.photoDataUrl;
    previewPhoto.style.display = 'block';
    photoPreview.src = data.photoDataUrl;
    photoPreview.style.display = 'block';
  } else {
    previewPhoto.removeAttribute('src');
    photoPreview.removeAttribute('src');
    previewPhoto.style.display = 'none';
    photoPreview.style.display = 'none';
  }
}

function setLanguage(lang) {
  state.language = lang;
  document.documentElement.lang = lang;
  document.body.classList.toggle('hi', lang === 'hi');
  $('#langToggle').textContent = labels[lang].langBtn;
  renderPreview();
}

function setTemplate(template) {
  state.template = template;
  $$('.template-card').forEach(btn => btn.classList.toggle('active', btn.dataset.template === template));
  renderPreview();
}

function initForm() {
  const form = $('#biodataForm');
  // Pre-fill defaults without storing data elsewhere.
  for (const [key, value] of Object.entries(defaults)) {
    const input = form.elements.namedItem(key);
    if (input) input.value = value;
  }

  form.addEventListener('input', renderPreview);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      state.photoDataUrl = '';
      for (const [key, value] of Object.entries(defaults)) {
        const input = form.elements.namedItem(key);
        if (input) input.value = value;
      }
      $('#photoPreview').removeAttribute('src');
      $('#previewPhoto').removeAttribute('src');
      $('#photoPreview').style.display = 'none';
      $('#previewPhoto').style.display = 'none';
      renderPreview();
    }, 0);
  });
}

function downloadFile(filename, dataUrl) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function exportImage(type = 'png') {
  const node = $('#previewCard');
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false
  });

  if (type === 'png') {
    downloadFile(`biodata-${Date.now()}.png`, canvas.toDataURL('image/png'));
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`biodata-${Date.now()}.pdf`);
}

function initTemplateSwitch() {
  $$('.template-card').forEach(btn => {
    btn.addEventListener('click', () => setTemplate(btn.dataset.template));
  });
}

function initPhotoUpload() {
  $('#photoInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      state.photoDataUrl = String(reader.result);
      renderPreview();
    };
    reader.readAsDataURL(file);
  });
}

function initActions() {
  $('#downloadPdf').addEventListener('click', () => exportImage('pdf'));
  $('#downloadPng').addEventListener('click', () => exportImage('png'));
  $('#scrollPreview').addEventListener('click', () => {
    $('#builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#langToggle').addEventListener('click', () => {
    setLanguage(state.language === 'en' ? 'hi' : 'en');
  });
}

function boot() {
  initForm();
  initTemplateSwitch();
  initPhotoUpload();
  initActions();
  renderPreview();

  // Security-conscious posture for a client-only site.
  if ('serviceWorker' in navigator) {
    // No service worker included by default to keep the site simple and safe on GitHub Pages.
  }
}

document.addEventListener('DOMContentLoaded', boot);
