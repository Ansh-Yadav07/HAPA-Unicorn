document.addEventListener('DOMContentLoaded', () => {
    initHeatmap();
    initMoodMeter();
    setInterval(updateHeatmap, 5000); // Live update effect
});

function initHeatmap() {
    const container = document.getElementById('sector-heatmap');
    const data = marketData.getAllSectors();

    container.innerHTML = '';
    data.sort((a, b) => b.performance - a.performance); // Sort by performance

    data.forEach(sector => {
        const tile = document.createElement('div');
        tile.className = 'heatmap-tile';
        
        // Color Logic
        let color = '#333';
        if (sector.performance > 0) {
            // Gradient Cyan/Green
            const intensity = Math.min(sector.performance * 10 + 20, 100); 
            tile.style.background = `linear-gradient(135deg, rgba(100, 255, 218, ${intensity/200}), rgba(10, 40, 50, 0.6))`;
            tile.style.borderColor = 'var(--accent-green)';
        } else if (sector.performance < 0) {
            // Gradient Red
            const intensity = Math.min(Math.abs(sector.performance) * 10 + 20, 100);
            tile.style.background = `linear-gradient(135deg, rgba(255, 77, 77, ${intensity/200}), rgba(100, 0, 0, 0.5))`;
            tile.style.borderColor = 'var(--accent-red)';
        } else {
            tile.style.background = 'rgba(255, 215, 0, 0.1)';
            tile.style.borderColor = 'var(--accent-yellow)';
        }

        tile.innerHTML = `
            <div class="tile-name">${sector.name}</div>
            <div class="tile-change">${sector.performance > 0 ? '+' : ''}${sector.performance}%</div>
        `;

        // Tooltip using standard title for simplicity or custom hover in CSS
        tile.title = `${sector.name}\nTrend: ${sector.sentiment}\nPrice: ₹${sector.price}`;

        container.appendChild(tile);
    });
}

function updateHeatmap() {
    // In a real app, fetch new data. Here, we just re-render slightly changed "live" feel
    marketData.generateData(); // Refresh random data
    initHeatmap();
    initMoodMeter();
}

function initMoodMeter() {
    const mood = marketData.getMarketMood();
    
    document.querySelector('.mood-emoji').textContent = mood.emoji;
    document.querySelector('.mood-text').textContent = mood.mood;
    document.querySelector('.mood-text').style.color = mood.color;
    
    const barFill = document.querySelector('.mood-bar-fill');
    
    // Map mood to percentage
    let percentage = 50;
    if (mood.mood === "Fear") percentage = 20;
    if (mood.mood === "Greed") percentage = 80;
    
    barFill.style.width = `${percentage}%`;
    
    // Update Top Mover
    const sectors = marketData.getAllSectors();
    const topMover = sectors.reduce((prev, current) => (Math.abs(current.performance) > Math.abs(prev.performance)) ? current : prev);
    
    const moverColor = topMover.performance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    document.getElementById('top-mover-content').innerHTML = `
        <div style="font-size: 1.2rem; font-weight: bold;">${topMover.name}</div>
        <div style="color: ${moverColor}; font-size: 1.5rem;">
            ${topMover.performance > 0 ? '▲' : '▼'} ${Math.abs(topMover.performance)}%
        </div>
    `;
}
