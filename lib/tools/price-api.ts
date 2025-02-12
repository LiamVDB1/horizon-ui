//constants
export const DAYS_TO_SHOW = 7;
export const HOUR_INTERVAL = 3;

// Types for the API responses
interface CoinGeckoMarketData {
    id: string;
    symbol: string;
    name: string;
    market_cap: number;
    current_price: number;
}

interface CoinListItem {
    id: string;
    symbol: string;
    name: string;
}

interface MarketChartData {
    prices: [number, number][];        // [timestamp, price]
    market_caps: [number, number][];   // [timestamp, market_cap]
    total_volumes: [number, number][]; // [timestamp, volume]
}

interface ProcessedPriceData {
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_7d: number;
    price_change_7d: number;
    high_7d: number;
    low_7d: number;
    hourly_prices: {
        timestamp: string;
        price: number;
    }[];
}

// Add retry logic with delay
async function fetchWithRetry(url: string, retries = 3, delay = 1000) {
    const headers = {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', // Some APIs require a user agent
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { headers });
            if (response.status === 429) { // Rate limit error
                const waitTime = delay * Math.pow(2, i); // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Max retries reached');
}

export async function getCoinPriceData(ticker: string): Promise<ProcessedPriceData> {
    try {
        // Step 1: Get the full coin list
        const listResponse = await fetchWithRetry('https://api.coingecko.com/api/v3/coins/list');
        const coinList: CoinListItem[] = await listResponse.json();

        // Find all coins matching the ticker
        const matchingCoins = coinList.filter(coin =>
            coin.symbol.toLowerCase() === ticker.toLowerCase()
        );

        if (matchingCoins.length === 0) {
            throw new Error(`No coins found with ticker ${ticker}`);
        }

        // Step 2: Get market data for all matching coins
        const ids = matchingCoins.map(coin => coin.id).join(',');
        const marketDataResponse = await fetchWithRetry(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=${matchingCoins.length}&page=1`
        );

        const marketData: CoinGeckoMarketData[] = await marketDataResponse.json();
        const selectedCoin = marketData[0];

        if (!selectedCoin) {
            throw new Error(`No market data available for ${ticker}`);
        }

        // Step 3: Get market chart data for the selected coin
        const params = new URLSearchParams({
            vs_currency: 'usd',
            days: DAYS_TO_SHOW.toString()
        });

        const chartResponse = await fetchWithRetry(
            `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?${params}`
        );

        const chartData: MarketChartData = await chartResponse.json();

        // Process the data
        const hourlyPrices = chartData.prices.reduce((acc, [timestamp, price], index, array) => {
            if (index % HOUR_INTERVAL === 0) {
                const nextPrices = array.slice(index, index + HOUR_INTERVAL);
                const avgPrice = nextPrices.reduce((sum, [_, p]) => sum + p, 0) / nextPrices.length;

                acc.push({
                    timestamp: new Date(timestamp).toISOString(),
                    price: avgPrice
                });
            }
            return acc;
        }, [] as { timestamp: string; price: number }[]);

        const currentPrice = hourlyPrices[hourlyPrices.length - 1].price;
        const startPrice = hourlyPrices[0].price;
        const priceChange = currentPrice - startPrice;
        const priceChangePercentage = (priceChange / startPrice) * 100;

        const prices = hourlyPrices.map(hp => hp.price);
        const high7d = Math.max(...prices);
        const low7d = Math.min(...prices);

        return {
            symbol: selectedCoin.symbol.toUpperCase(),
            name: selectedCoin.name,
            current_price: currentPrice,
            price_change_percentage_7d: priceChangePercentage,
            price_change_7d: priceChange,
            high_7d: high7d,
            low_7d: low7d,
            hourly_prices: hourlyPrices
        };
    } catch (error) {
        console.error('Error fetching price data:', error);
        throw error;
    }
}

// Optional: Add rate limiting and caching
const CACHE_DURATION = 3600 * 1000; // 30 seconds cache
const cache = new Map<string, { data: ProcessedPriceData; timestamp: number }>();

export async function getCoinPriceDataCached(ticker: string): Promise<ProcessedPriceData> {
    const now = Date.now();
    const cached = cache.get(ticker);

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
    }

    const data = await getCoinPriceData(ticker);
    cache.set(ticker, { data, timestamp: now });
    return data;
}