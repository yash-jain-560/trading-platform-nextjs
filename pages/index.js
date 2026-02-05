import React, { useState, useEffect } from 'react';

// --- Styling (kept from original) ---
const containerStyle = {
  minHeight: '100vh',
  padding: '0 0.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f8f9fa', // Light background
};

const mainStyle = {
  padding: '5rem 0',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '90%',
  maxWidth: '1200px',
};

const headerStyle = {
    color: '#343a40',
    marginBottom: '2rem',
    fontSize: '2.5rem',
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    width: '100%',
};

const cardStyle = {
    padding: '1.5rem',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    fontSize: '0.9rem',
};

const thTdStyle = {
    border: '1px solid #e9ecef',
    padding: '8px',
    textAlign: 'left',
};

const getPLColor = (pl) => pl > 0 ? 'green' : pl < 0 ? 'red' : 'inherit';

// --- UPDATED COMPONENTS for New API Structure ---

// status is now portfolio object: { cash, stocks, totalValue, ... }
const PortfolioSummary = ({ portfolio }) => {
    if (!portfolio) return <p>Loading portfolio summary...</p>;
    
    return (
        <>
            <h2>Account Summary</h2>
            <p><strong>Cash Balance:</strong> ₹{portfolio.cash?.toFixed(2) || '0.00'}</p>
            <p><strong>Total Value:</strong> ₹{portfolio.totalValue?.toFixed(2) || '0.00'}</p>
            <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '10px' }}>* Portfolio value is calculated using current live price for TSLA and average price for other holdings (backend limitation).</p>
        </>
    );
};

const HoldingsTable = ({ holdings }) => {
    if (!holdings || holdings.length === 0) {
        return <p>No holdings found in portfolio.</p>;
    }

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    <th style={thTdStyle}>Ticker</th>
                    <th style={thTdStyle}>Qty</th>
                    <th style={thTdStyle}>Cost Price</th>
                    <th style={thTdStyle}>Live Price</th>
                    <th style={thTdStyle}>Value</th>
                    <th style={thTdStyle}>P/L (%)</th>
                </tr>
            </thead>
            <tbody>
                {holdings.map((h, i) => (
                    <tr key={h.ticker || i}>
                        <td style={thTdStyle}>{h.ticker}</td>
                        <td style={thTdStyle}>{h.quantity}</td>
                        <td style={thTdStyle}>₹{h.avg_price.toFixed(2)}</td>
                        <td style={thTdStyle}>₹{typeof h.live_price === 'number' ? h.live_price.toFixed(2) : h.live_price}</td>
                        <td style={thTdStyle}>₹{h.current_value.toFixed(2)}</td>
                        <td style={{ ...thTdStyle, color: getPLColor(h.pl_absolute) }}>
                            {h.pl_percent > 0 ? '+' : ''}{h.pl_percent.toFixed(2)}%
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const PlaceholderCard = ({ title, message }) => (
    <>
        <h2>{title}</h2>
        <p style={{ color: '#6c757d' }}>{message}</p>
    </>
);


const AppStatus = () => (
    <>
        <h2>Platform Status</h2>
        <p>System status: <span style={{ color: 'green', fontWeight: 'bold' }}>Operational (Node.js/Yahoo-Finance2)</span></p>
        <p>Backend API: <a href="/api/status" target="_blank">/api/status (Live Data)</a></p>
    </>
);

const TradeExecutionForm = ({ onTradeExecuted }) => {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [tradeType, setTradeType] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' };
    const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { 
        padding: '10px', 
        backgroundColor: isSubmitting ? '#6c757d' : tradeType === 'BUY' ? '#28a745' : tradeType === 'SELL' ? '#dc3545' : '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsSubmitting(true);
        
        try {
            const res = await fetch('/api/trade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol.toUpperCase(),
                    quantity: parseInt(quantity, 10),
                    type: tradeType
                }),
            });

            const result = await res.json();
            
            if (res.ok && result.success) {
                setMessage({ text: result.message, type: 'success' });
                setSymbol('');
                setQuantity('');
                setTradeType('');
                if (onTradeExecuted) {
                    onTradeExecuted();
                }
            } else {
                setMessage({ text: result.error || result.message || 'Trade failed.', type: 'error' });
            }

        } catch (err) {
            console.error("Trade execution failed:", err);
            setMessage({ text: `Failed to connect to trade API. ${err.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const messageStyle = {
        marginTop: '10px',
        padding: '8px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: message?.type === 'success' ? 'green' : 'red',
    };

    return (
        <>
            <h2>Trade Execution</h2>
            <form style={formStyle} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Symbol (e.g., TSLA or AAPL)" 
                    style={inputStyle} 
                    required 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    disabled={isSubmitting}
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    style={inputStyle} 
                    min="1" 
                    required 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={isSubmitting}
                />
                <select 
                    style={inputStyle} 
                    required 
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value)}
                    disabled={isSubmitting}
                >
                    <option value="" disabled>Select Type</option>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                </select>
                <button type="submit" style={buttonStyle} disabled={isSubmitting || !tradeType || !symbol || !quantity}>
                    {isSubmitting ? 'Processing...' : `Place ${tradeType || 'Order'}`}
                </button>
            </form>
            {message && <div style={messageStyle}>{message.text}</div>}
            <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '10px' }}>* Trade execution uses live Yahoo Finance data.</p>
        </>
    );
};


// -----------------------------


const HomePage = () => {
    // statusData holds the entire { message, livePrice, portfolio } object
    const [statusData, setStatusData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPortfolioStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/status');
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status}. Body: ${errorText.substring(0, 100)}...`);
            }
            const data = await res.json();
            setStatusData(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch portfolio status:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioStatus();
    }, []);

    // Display a basic loading/error state if needed
    if (loading) {
        return (
            <div style={containerStyle}>
                <main style={mainStyle}>
                    <h1 style={headerStyle}>Trading Dashboard</h1>
                    <p>Loading real-time portfolio data...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <main style={mainStyle}>
                    <h1 style={headerStyle}>Trading Dashboard</h1>
                    <p style={{ color: 'red' }}>Error loading data: {error}. Check /api/status endpoint.</p>
                </main>
            </div>
        );
    }
    
    // Data transformation for HoldingsTable
    const holdings = statusData?.portfolio?.stocks ? 
        Object.keys(statusData.portfolio.stocks).map(ticker => {
            const stock = statusData.portfolio.stocks[ticker];
            
            // Try to use the live price if available (currently only TSLA is fetched in the backend)
            // Fall back to averagePrice for all others to keep the table functional.
            const livePrice = (statusData.livePrice && statusData.livePrice.symbol === ticker) ? statusData.livePrice.price : stock.averagePrice; 
            
            const currentValue = stock.quantity * livePrice;
            const costBasis = stock.quantity * stock.averagePrice;
            const plAbsolute = currentValue - costBasis;
            const plPercent = costBasis === 0 ? 0 : (plAbsolute / costBasis) * 100;

            return {
                ticker,
                quantity: stock.quantity,
                avg_price: stock.averagePrice,
                live_price: livePrice,
                current_value: currentValue,
                pl_absolute: plAbsolute,
                pl_percent: plPercent,
            };
        }) : [];

    return (
        <div style={containerStyle}>
            <main style={mainStyle}>
                <h1 style={headerStyle}>Trading Dashboard (Node.js/Live Data)</h1>

                <div style={gridStyle}>
                    
                    {/* Dashboard Card 1: Portfolio Summary */}
                    <div style={cardStyle}>
                        <PortfolioSummary portfolio={statusData.portfolio} />
                    </div>
                    
                    {/* Dashboard Card 2: Trade Execution Form */}
                    <div style={cardStyle}>
                        <TradeExecutionForm onTradeExecuted={fetchPortfolioStatus} />
                    </div>

                    {/* Dashboard Card 3: Holdings View */}
                    <div style={cardStyle}>
                        <h2>Current Holdings</h2>
                        <HoldingsTable holdings={holdings} />
                    </div>
                    
                    {/* Dashboard Card 4: Placeholder for Transactions/News */}
                    <div style={cardStyle}>
                        <PlaceholderCard title="Live Market Price" message={\`TSLA: \${statusData.livePrice?.price?.toFixed(2) || 'N/A'}\`} />
                    </div>

                    {/* Dashboard Card 5: App Status */}
                    <div style={cardStyle}>
                        <AppStatus />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
