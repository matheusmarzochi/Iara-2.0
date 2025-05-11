const fs = require('fs');
const fsPath = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = './review.html';
const html = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

function parsePtBrDate(dateStr) {
  // Exemplo: "9 de fevereiro de 2025"
  const meses = {
    janeiro: '01',
    fevereiro: '02',
    março: '03',
    abril: '04',
    maio: '05',
    junho: '06',
    julho: '07',
    agosto: '08',
    setembro: '09',
    outubro: '10',
    novembro: '11',
    dezembro: '12'
  };
  const regex = /(\d{1,2}) de (\w+) de (\d{4})/;
  const match = dateStr.match(regex);
  if (!match) return null;
  const [ , dia, mes, ano ] = match;
  const mesNum = meses[mes.toLowerCase()];
  if (!mesNum) return null;
  // Formato ISO: YYYY-MM-DD
  return new Date(`${ano}-${mesNum}-${dia.padStart(2, '0')}`);
}

const reviewNodes = Array.from(document.querySelectorAll('.RHo1pe'));

const reviews = [];

reviewNodes.forEach((elem) => {
  // Nome do usuário
  const name = elem.querySelector('.X5PpBb')?.textContent.trim() || '';

  // Data do review
  const dateStr = elem.querySelector('.Jx4nYe .bp9Aid')?.textContent.trim() || '';
  const dateObj = parsePtBrDate(dateStr);

  // Texto do review
  const review = elem.querySelector('.h3YV2d')?.textContent.trim() || '';

  // Estrelas (corrigido)
  let stars = 0;
  const starsElem = elem.querySelector('.Jx4nYe [role="img"]');
  if (starsElem && starsElem.hasAttribute('aria-label')) {
    // Exemplo: "Avaliado com 1 de 5 estrelas"
    const match = starsElem.getAttribute('aria-label').match(/Avaliado com (\d+) de 5 estrelas/);
    if (match) {
      stars = parseInt(match[1], 10);
    }
  }
  // Fallback para método antigo, se necessário
  if (!stars) {
    stars = elem.querySelectorAll('.Jx4nYe [role="img"] [data-number]').length;
  }

  // Helpful
  const helpfulDiv = elem.querySelector('div[jscontroller="SWD8cc"]');
  const helpfulAttr = helpfulDiv?.getAttribute('data-original-thumbs-up-count');
  const helpful = helpfulAttr ? parseInt(helpfulAttr, 10) : 0;

  reviews.push({ name, date: dateObj, review, stars, helpful });
});

// Agrupar por ano/mês
const grouped = {};
reviews.forEach(r => {
  if (!r.date || isNaN(r.date)) return;
  const year = r.date.getFullYear();
  const month = String(r.date.getMonth() + 1).padStart(2, '0');
  const key = `${year}/${month}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(r);
});

// Criar pasta rawReviews se não existir
const rawReviewsDir = fsPath.join(__dirname, './rawReviews');
if (!fs.existsSync(rawReviewsDir)) {
  fs.mkdirSync(rawReviewsDir, { recursive: true });
}

// Salvar arquivos JSON por mês
Object.keys(grouped).forEach(key => {
  const [year, month] = key.split('/');
  const filename = `${year}-${month}.json`;
  const filePath = fsPath.join(rawReviewsDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(grouped[key], null, 2), 'utf-8');
});

//console.log(JSON.stringify(reviews, null, 2));
//console.log('Grouped by year/month:', grouped);
console.log(reviews.length)
// Exibir quantidade por grupo, ordenando as chaves por data
Object.keys(grouped)
  .sort() // "YYYY/MM" já ordena corretamente como string
  .forEach(key => {
    console.log(`${key}: ${grouped[key].length}`);
  });

