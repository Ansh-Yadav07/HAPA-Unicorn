const SECTOR_NAMES = [
    "Tech", "Healthcare", "Energy", "Finance", 
    "FMCG", "Auto", "AI", "Crypto", "Green Energy"
];

const MARKET_MOODS = [
    { mood: "Fear", emoji: "😨", color: "var(--accent-red)" },
    { mood: "Neutral", emoji: "😐", color: "var(--accent-yellow)" },
    { mood: "Greed", emoji: "🤑", color: "var(--accent-green)" }
];

class MarketData {
    constructor() {
        this.sectors = [];
        this.generateData();
    }

    // Generate random sector performance
    generateData() {
        this.sectors = SECTOR_NAMES.map(name => {
            const performance = (Math.random() * 10 - 5).toFixed(2); // Range -5% to +5%
            let sentiment = "Neutral";
            if (performance > 1.5) sentiment = "Bullish";
            if (performance < -1.5) sentiment = "Bearish";

            return {
                name: name,
                performance: parseFloat(performance),
                price: (Math.random() * 1000 + 100).toFixed(2),
                volume: Math.floor(Math.random() * 1000000),
                volatility: (Math.random() * 0.5 + 0.1).toFixed(2), // 0.1 to 0.6
                sentiment: sentiment,
                aiConfidence: Math.floor(Math.random() * 40 + 60) // 60-100%
            };
        });
    }

    getAllSectors() {
        return this.sectors;
    }

    getSector(name) {
        return this.sectors.find(s => s.name === name);
    }

    getMarketMood() {
        // Calculate average performance
        const avgPerf = this.sectors.reduce((acc, curr) => acc + curr.performance, 0) / this.sectors.length;
        
        if (avgPerf < -1) return MARKET_MOODS[0]; // Fear
        if (avgPerf > 1) return MARKET_MOODS[2]; // Greed
        return MARKET_MOODS[1]; // Neutral
    }

    // Simulate price movement for 1 sector over time (for TWAP)
    simulatePriceHistory(sectorName, hours) {
        const sector = this.getSector(sectorName);
        let currentPrice = parseFloat(sector.price);
        const prices = [];
        const volatility = parseFloat(sector.volatility);

        // Simulate 1 point per 10 mins
        const points = hours * 6; 
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * volatility * 10;
            currentPrice += change;
            if(currentPrice < 1) currentPrice = 1;
            prices.push(currentPrice);
        }
        return prices;
    }
}

// Global instance
const marketData = new MarketData();
