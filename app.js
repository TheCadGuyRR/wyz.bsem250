const stockUniverse = [
  { ticker: 'MSFT', name: 'Microsoft', sector: 'Technology', price: 417.88, change: '+1.24%', risk: 'Moderate', horizons: ['Medium term', 'Long term'], score: 94, color: '#d9eee1' },
  { ticker: 'V', name: 'Visa', sector: 'Finance', price: 280.43, change: '+0.68%', risk: 'Low', horizons: ['Medium term', 'Long term'], score: 91, color: '#e8e8f3' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer', price: 727.19, change: '+0.42%', risk: 'Moderate', horizons: ['Long term'], score: 88, color: '#f4e5c8' },
  { ticker: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', price: 795.12, change: '-0.31%', risk: 'High', horizons: ['Short term', 'Long term'], score: 86, color: '#f1d9d0' },
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Energy', price: 69.81, change: '+1.88%', risk: 'Moderate', horizons: ['Medium term', 'Long term'], score: 83, color: '#e7edcf' },
  { ticker: 'GOOGL', name: 'Alphabet', sector: 'Technology', price: 162.42, change: '+0.93%', risk: 'Moderate', horizons: ['Short term', 'Medium term', 'Long term'], score: 89, color: '#d9eee1' }
];

const form = document.querySelector('#discovery-form');
const budgetInput = document.querySelector('#budget');
const sectorInput = document.querySelector('#sector');
const summary = document.querySelector('#result-summary');
const list = document.querySelector('#signal-list');
const refreshButton = document.querySelector('#refresh-button');
let selectedHorizon = 'Long term';

function formatBudget(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function renderSignals() {
  const budget = Math.max(100, Number(budgetInput.value) || 100);
  const sector = sectorInput.value;
  let matches = stockUniverse.filter((stock) => (sector === 'All sectors' || stock.sector === sector) && stock.horizons.includes(selectedHorizon));

  if (matches.length < 3) {
    matches = stockUniverse.filter((stock) => stock.sector === sector || sector === 'All sectors').sort((a, b) => b.score - a.score);
  }
  matches = matches.slice(0, 4).sort((a, b) => b.score - a.score);
  summary.textContent = `Based on a ${formatBudget(budget)} budget · ${selectedHorizon} · ${sector}`;
  list.innerHTML = matches.map((stock) => {
    const shares = Math.max(1, Math.floor((budget / matches.length) / stock.price));
    const allocation = formatBudget(shares * stock.price);
    return `<article class="signal-card">
      <div class="ticker-badge" style="background:${stock.color}">${stock.ticker.slice(0, 4)}</div>
      <div><div class="company-name">${stock.name}</div><div class="company-meta">${stock.sector} · ${stock.risk} risk · ${shares} share${shares === 1 ? '' : 's'} ≈ ${allocation}</div></div>
      <div><span class="data-label">Price</span><span class="data-value">$${stock.price.toFixed(2)}</span></div>
      <div><span class="data-label">Today</span><span class="data-value ${stock.change.startsWith('+') ? 'change-positive' : 'change-negative'}">${stock.change}</span></div>
      <div class="match"><span class="match-score">${stock.score}%</span><span class="data-label">Match</span><span class="match-bar"><span style="width:${stock.score}%"></span></span></div>
    </article>`;
  }).join('');
}

document.querySelectorAll('.horizon-option').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.horizon-option.selected').classList.remove('selected');
    button.classList.add('selected');
    selectedHorizon = button.dataset.horizon;
    renderSignals();
  });
});
form.addEventListener('submit', (event) => { event.preventDefault(); renderSignals(); });
refreshButton.addEventListener('click', () => {
  refreshButton.querySelector('span').animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 500 });
  renderSignals();
});
renderSignals();
