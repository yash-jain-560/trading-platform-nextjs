import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { portfolio } from '../status/route'; // Import the shared in-memory portfolio

export async function POST(req) {
    const { symbol, type, quantity: quantityStr } = await req.json();
    const quantity = parseInt(quantityStr, 10);

    if (!symbol || !type || isNaN(quantity) || quantity <= 0 || !['buy', 'sell'].includes(type.toLowerCase())) {
        return NextResponse.json({ error: "Invalid trade request parameters." }, { status: 400 });
    }

    // 1. Fetch current price
    let currentPrice;
    try {
        const quote = await yahooFinance.quote(symbol, { fields: ['regularMarketPrice'] });
        currentPrice = quote.regularMarketPrice;
        if (!currentPrice) {
            return NextResponse.json({ error: \`Could not fetch live price for \${symbol}\` }, { status: 500 });
        }
    } catch (error) {
        console.error(\`Failed to fetch price for \${symbol}: \`, error);
        return NextResponse.json({ error: \`Failed to fetch price for \${symbol}\` }, { status: 500 });
    }

    const tradeCost = currentPrice * quantity;
    const currentHolding = portfolio.stocks[symbol] || { quantity: 0, averagePrice: 0 };

    if (type.toLowerCase() === 'buy') {
        // 2. Buy Logic
        if (portfolio.cash < tradeCost) {
            return NextResponse.json({ error: "Insufficient cash for this purchase." }, { status: 400 });
        }

        // Update portfolio
        const newTotalQuantity = currentHolding.quantity + quantity;
        const newTotalCost = (currentHolding.quantity * currentHolding.averagePrice) + tradeCost;
        
        portfolio.cash -= tradeCost;
        portfolio.stocks[symbol] = {
            quantity: newTotalQuantity,
            averagePrice: newTotalCost / newTotalQuantity
        };

        const responseMessage = \`Successfully bought \${quantity} shares of \${symbol} at \${currentPrice}.\`;
        console.log(responseMessage);
        return NextResponse.json({ success: true, message: responseMessage, portfolio: portfolio }, { status: 200 });

    } else if (type.toLowerCase() === 'sell') {
        // 3. Sell Logic
        if (currentHolding.quantity < quantity) {
            return NextResponse.json({ error: \`Insufficient shares of \${symbol} to sell. Held: \${currentHolding.quantity}\` }, { status: 400 });
        }

        // Update portfolio
        const remainingQuantity = currentHolding.quantity - quantity;
        
        portfolio.cash += tradeCost;
        
        if (remainingQuantity === 0) {
            delete portfolio.stocks[symbol];
        } else {
            // Average price remains the same for the remaining shares
            portfolio.stocks[symbol].quantity = remainingQuantity;
        }

        const responseMessage = \`Successfully sold \${quantity} shares of \${symbol} at \${currentPrice}.\`;
        console.log(responseMessage);
        return NextResponse.json({ success: true, message: responseMessage, portfolio: portfolio }, { status: 200 });
    }
}
