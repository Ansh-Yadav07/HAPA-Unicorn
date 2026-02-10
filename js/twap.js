document.addEventListener('DOMContentLoaded', () => {
    initTwapForm();
    
    document.getElementById('run-twap-btn').addEventListener('click', runTwapSimulation);
    
    // Slider value update
    const slider = document.getElementById('twap-duration');
    const display = document.getElementById('duration-display');
    if(slider && display) {
        slider.addEventListener('input', (e) => {
            display.innerText = `${e.target.value} Hours`;
        });
    }
});

function initTwapForm() {
    const select = document.getElementById('twap-sector-select');
    const sectors = marketData.getAllSectors();
    
    sectors.forEach(s => {
        const option = document.createElement('option');
        option.value = s.name;
        option.text = s.name;
        select.appendChild(option);
    });
}

let twapChart = null;

function runTwapSimulation() {
    const sectorName = document.getElementById('twap-sector-select').value;
    const amount = parseFloat(document.getElementById('twap-amount').value);
    const duration = parseInt(document.getElementById('twap-duration').value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid investment amount.");
        return;
    }

    document.getElementById('twap-results').style.display = 'block';

    // 1. Get Simulation Data
    const priceHistory = marketData.simulatePriceHistory(sectorName, duration);
    
    // 2. Compute TWAP Logic
    // Strategy: Buy equal amounts at each time interval
    const intervalAmount = amount / priceHistory.length;
    let totalUnitsBought = 0;
    
    priceHistory.forEach(price => {
        totalUnitsBought += intervalAmount / price;
    });

    const avgEntryPrice = amount / totalUnitsBought;

    // Compare with "Lump Sum" (Buying everything at start)
    const startPrice = priceHistory[0];
    const maxPrice = Math.max(...priceHistory);
    const minPrice = Math.min(...priceHistory);
    
    // Calculate theoretical savings (vs worst case execution i.e. buying at High)
    // In real pros, we compare vs Arrival Price, but for simplification:
    // We show benefit vs buying at the peak of the period.
    const worstCaseUnits = amount / maxPrice;
    const worstCaseValue = worstCaseUnits * priceHistory[priceHistory.length - 1]; // Value at end
    const twapValue = totalUnitsBought * priceHistory[priceHistory.length - 1];
    
    // For profit simulation, let's assume end price is the exit
    const endPrice = priceHistory[priceHistory.length - 1];
    const profit = ((twapValue - amount) / amount) * 100;
    
    // Cost savings (Slippage reduction simulation)
    // Arbitrary metric for educational purpose: Difference between Max Price and TWAP Avg
    const volatilitySavings = (maxPrice - avgEntryPrice) * totalUnitsBought;


    // 3. Update UI
    document.getElementById('twap-avg-price').innerText = `₹${avgEntryPrice.toFixed(2)}`;
    
    const profitEl = document.getElementById('twap-profit');
    profitEl.innerText = `${profit > 0 ? '+' : ''}${profit.toFixed(2)}%`;
    profitEl.className = profit >= 0 ? 'value success' : 'value failure'; // Add failure class style if needed
    if(profit < 0) profitEl.style.color = 'var(--accent-red)';

    document.getElementById('twap-savings').innerText = `₹${volatilitySavings.toFixed(0)}`;

    // 4. Render Chart
    renderTwapChart(priceHistory, avgEntryPrice);
}

function renderTwapChart(prices, avgPrice) {
    const ctx = document.getElementById('twap-chart').getContext('2d');

    if (twapChart) {
        twapChart.destroy();
    }

    // Generate accurate time labels
    const labels = prices.map((_, i) => `T+${i*10}m`);

    // Create array for avg price line
    const avgLine = new Array(prices.length).fill(avgPrice);

    twapChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Market Price',
                    data: prices,
                    borderColor: '#00f3ff',
                    backgroundColor: 'rgba(0, 243, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Resulting TWAP Price',
                    data: avgLine,
                    borderColor: '#64ffda',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#aaa' }
                },
                x: {
                    display: false // Hide x axis labels for cleaner look
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            }
        }
    });
}
