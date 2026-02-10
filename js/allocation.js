document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('generate-allocation-btn');
    if(btn) btn.addEventListener('click', generateAllocation);
});

let allocationChart = null;

function generateAllocation() {
    const amountInput = document.getElementById('fund-input');
    const totalAmount = parseFloat(amountInput.value);

    if (isNaN(totalAmount) || totalAmount < 1000) {
        alert("Please enter a valid amount (Minimum ₹1000)");
        return;
    }

    const sectors = marketData.getAllSectors();
    
    // AI Logic: Weight allocation based on performance and AI confidence
    // Strategy: Momentum - Buy winners, but diversify
    
    let totalScore = 0;
    const scoredSectors = sectors.map(sector => {
        // Base score on AI confidence
        let score = sector.aiConfidence; 
        
        // Boost for positive performance (Momentum)
        if (sector.performance > 0) score += sector.performance * 10;
        
        // Penalty for very negative performance (Trend following)
        if (sector.performance < -2) score -= 10;
        
        // Ensure non-negative
        score = Math.max(score, 10);
        
        totalScore += score;
        return { ...sector, score };
    });

    // Calculate actual amounts
    const allocation = scoredSectors.map(s => {
        const percent = (s.score / totalScore);
        const amount = (totalAmount * percent).toFixed(2);
        return {
            name: s.name,
            percent: (percent * 100).toFixed(1),
            amount: amount,
            reason: getAIReason(s)
        };
    }).sort((a, b) => b.amount - a.amount); // Show top allocations first

    displayResults(allocation, totalAmount);
}

function getAIReason(sector) {
    if (sector.performance > 2) return "Strong momentum detected";
    if (sector.performance > 0) return "Steady growth potential";
    if (sector.performance > -2) return "Defensive hold";
    return "Contrarian value bet";
}

function displayResults(allocation, total) {
    document.getElementById('allocation-results').style.display = 'block';
    
    // Explain Logic
    const topPick = allocation[0];
    const logicText = `
        AI has optimized your portfolio for a <strong>${marketData.getMarketMood().mood}</strong> market. 
        Top bet is <strong>${topPick.name}</strong> (${topPick.percent}%) due to high AI confidence and ${topPick.reason.toLowerCase()}.
        Diversification score: High.
    `;
    document.getElementById('ai-logic-text').innerHTML = logicText;

    // Render Table
    const tableContainer = document.getElementById('allocation-table-container');
    let tableHTML = `
        <table class="allocation-table">
            <thead>
                <tr>
                    <th>Sector</th>
                    <th>Info</th>
                    <th>Allocation</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Only show top 5 to keep UI clean
    allocation.slice(0, 5).forEach(item => {
        tableHTML += `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td><span style="font-size:1rem; color:#fff;">${item.reason}</span></td>
                <td>
                    <div style="color: var(--accent-green)">₹${item.amount}</div>
                    <div style="font-size:0.8rem;">${item.percent}%</div>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;

    // Render Chart
    renderChart(allocation);
}

function renderChart(data) {
    const ctx = document.getElementById('allocation-chart').getContext('2d');
    
    if (allocationChart) {
        allocationChart.destroy();
    }

    const labels = data.map(d => d.name);
    const values = data.map(d => d.amount);
    
    // Gen Z Colors (Updated to Midnight/Cyan/Grey Theme)
    const colors = [
        '#64ffda', // Cyan Green
        '#00f3ff', // Neon Cyan
        '#8892b0', // Soft Grey Blue
        '#112240', // Deep Navy
        '#ccd6f6', // Bright Grey
        '#0afff0', // Bright Aqua
        '#5e81ac', // Muted Blue
        '#233554', // Dark Blue
        '#ffffff'
    ];

    allocationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#fff',
                        font: {
                            family: 'Space Grotesk'
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}
