import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

// Simple in-memory portfolio state
let portfolio = {
    cash: 10000.00,
    stocks: {
        'TSLA': { quantity: 10, averagePrice: 700.00 },
        'AAPL': { quantity: 50, averagePrice: 150.00 }
    }
};

export async function GET() {
    const symbol = 'TSLA';
    let currentPrice = null;

    try {
        const quote = await yahooFinance.quote(symbol, { fields: ['regularMarketPrice'] });
        currentPrice = quote.regularMarketPrice;
    } catch (error) {
        console.error(\`Failed to fetch price for \${symbol}: \`, error);
        // Fallback or just let it be null, but we'll return an error if essential data is missing
        return NextResponse.json({ error: \`Failed to fetch price for \${symbol}\` }, { status: 500 });
    }

    const tslaHolding = portfolio.stocks['TSLA'];
    const portfolioValue = portfolio.cash + 
                           Object.keys(portfolio.stocks).reduce((total, stockSymbol) => {
                               const stock = portfolio.stocks[stockSymbol];
                               // For simplicity, we only have TSLA price, so we'll mock others or use TSLA's for a total value calc.
                               // In a real app, this would be an array of fetches.
                               // Here, I will just return the TSLA holding value and cash.

                               // Assuming only TSLA is tracked for real price
                               if (stockSymbol === 'TSLA' && currentPrice !== null) {
                                   return total + (stock.quantity * currentPrice);
                               }
                               // For other stocks, use average price for a rough estimate if no current price is fetched.
                               return total + (stock.quantity * stock.averagePrice);
                           }, 0);


    const statusData = {
        message: "Trading platform status and portfolio data",
        livePrice: {
            symbol: symbol,
            price: currentPrice
        },
        portfolio: {
            ...portfolio,
            totalValue: parseFloat(portfolioValue.toFixed(2)),
            TSLA_current_value: currentPrice !== null ? parseFloat((tslaHolding.quantity * currentPrice).toFixed(2)) : 'N/A'
        }
    };

    return NextResponse.json(statusData, { status: 200 });
}

// Export the portfolio for use in the trade route
export { portfolio };