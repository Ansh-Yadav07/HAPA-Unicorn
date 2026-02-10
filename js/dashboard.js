document.addEventListener('DOMContentLoaded', () => {
    renderIndices();
    renderMostBought();
    renderPortfolio();
});

const INDICES_DATA = [
    { name: 'NIFTY Expiry', value: '25,960.00', change: '+92.70', percent: '+0.36%' },
    { name: 'SENSEX', value: '84,368.22', change: '+302.47', percent: '+0.36%' },
    { name: 'BANKNIFTY', value: '60,716.00', change: '+46.65', percent: '+0.08%' }
];

const MOST_BOUGHT_DATA = [
    { name: 'BSE', price: '3,116.40', change: '+131.30', percent: '+4.40%', icon: '🏢' },
    { name: 'POONAWALLA', price: '468.60', change: '+2.75', percent: '+0.59%', icon: '🅿️' },
    { name: 'DBREALTY', price: '127.62', change: '+3.35', percent: '+2.70%', icon: '🏗️' }
];

const PORTFOLIO_DATA = [
    { name: 'HDFC Bank', qty: 50, avg: 1500, current: 1520 },
    { name: 'Reliance', qty: 20, avg: 2400, current: 2450 },
    { name: 'Tata Motors', qty: 100, avg: 450, current: 480 },
    { name: 'Infosys', qty: 30, avg: 1400, current: 1380 },
    { name: 'ITC', qty: 200, avg: 350, current: 380 }
];

function renderIndices() {
    const container = document.getElementById('indices-container');
    if (!container) return;
    
    container.innerHTML = INDICES_DATA.map(idx => `
        <div class="glass-card index-card">
            <div class="index-header">
                <span class="index-name">${idx.name}</span>
            </div>
            <div class="index-value">${idx.value}</div>
            <div class="index-change positive">${idx.change} (${idx.percent})</div>
        </div>
    `).join('');
}

function renderMostBought() {
    const container = document.getElementById('most-bought-container');
    if (!container) return;

    container.innerHTML = MOST_BOUGHT_DATA.map(stock => `
        <div class="glass-card stock-card">
            <div class="stock-icon">${stock.icon}</div>
            <div class="stock-info">
                <span class="stock-name">${stock.name}</span>
                <span class="stock-price">${stock.price}</span>
                <span class="stock-change positive">${stock.change} (${stock.percent})</span>
            </div>
        </div>
    `).join('');
}

function renderPortfolio() {
    const body = document.getElementById('portfolio-body');
    if (!body) return;

    body.innerHTML = PORTFOLIO_DATA.map(stock => {
        const pl = (stock.current - stock.avg) * stock.qty;
        const plSign = pl >= 0 ? '+' : '';
        const plColor = pl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
        
        return `
        <tr>
            <td><strong>${stock.name}</strong></td>
            <td>${stock.qty}</td>
            <td>₹${stock.avg}</td>
            <td>₹${stock.current}</td>
            <td style="color: ${plColor}">${plSign}₹${pl.toFixed(2)}</td>
        </tr>
    `}).join('');
}
