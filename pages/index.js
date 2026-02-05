import React, { useState, useEffect } from 'react';

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

// --- NEW/UPDATED COMPONENTS ---

const PortfolioSummary = ({ status }) => {
    if (!status) return <p>Loading portfolio summary...</p>;
    
    return (
        <>
            <h2>Account Summary</h2>
            <p><strong>Cash Balance:</strong> ₹{status.cash_balance?.toFixed(2) || '0.00'}</p>
            <p><strong>Market Value:</strong> ₹{status.total_market_value?.toFixed(2) || '0.00'}</p>
            <p><strong>Total Value:</strong> ₹{status.total_portfolio_value?.toFixed(2) || '0.00'}</p>
            <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '10px' }}>Last Updated: {status.last_updated_utc ? new Date(status.last_updated_utc).toLocaleTimeString() : 'N/A'}</p>
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
                    <tr key={i}>
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

// Placeholder for future transactions/news, removing mock TransactionsList
const PlaceholderCard = ({ title, message }) => (
    <>
        <h2>{title}</h2>
        <p style={{ color: '#6c757d' }}>{message}</p>
    </>
);


// --- Phase 4 Components (Simplified) ---

const AppStatus = () => (
    <>
        <h2>Platform Status</h2>
        <p>System status: <span style={{ color: 'green', fontWeight: 'bold' }}>Operational</span></p>
        <p>Backend API: <a href="/api/status" target="_blank">/api/status (Live Data)</a></p>
    </>
);

const TradeExecutionForm = () => {
    // This is purely a mockup, no state or logic needed yet
    const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' };
    const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

    return (
        <>
            <h2>Trade Execution (Mock)</h2>
            <form style={formStyle} onSubmit={(e) => { e.preventDefault(); alert('Trade submitted (mockup)'); }}>
                <input type="text" placeholder="Symbol (e.g., RELIANCE.NS)" style={inputStyle} required />
                <input type="number" placeholder="Quantity" style={inputStyle} min="1" required />
                <select style={inputStyle} required defaultValue="">
                    <option value="" disabled>Select Type</option>
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                </select>
                <button type="submit" style={buttonStyle}>Place Order</button>
            </form>
            <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '10px' }}>* Functional trading interface is the next phase.</p>
        </>
    );
};
// -----------------------------


const HomePage = () => {
    // New state to hold data from Python API
    const [portfolioStatus, setPortfolioStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolioStatus = async () => {
            try {
                const res = await fetch('/api/status');
                if (!res.ok) {
                    // Check if response body is JSON for detailed error
                    const errorText = await res.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        throw new Error(`API failed: ${errorJson.message || 'Unknown error'}`);
                    } catch {
                        throw new Error(`HTTP error! status: ${res.status} - ${errorText.substring(0, 100)}...`);
                    }
                }
                const data = await res.json();
                setPortfolioStatus(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch portfolio status:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

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
    
    const holdings = portfolioStatus?.holdings || [];

    return (
        <div style={containerStyle}>
            <main style={mainStyle}>
                <h1 style={headerStyle}>Trading Dashboard (Live Data)</h1>

                <div style={gridStyle}>
                    
                    {/* Dashboard Card 1: Portfolio Summary */}
                    <div style={cardStyle}>
                        <PortfolioSummary status={portfolioStatus} />
                    </div>
                    
                    {/* Dashboard Card 2: Trade Execution Form (Phase 5 Implementation) */}
                    <div style={cardStyle}>
                        <TradeExecutionForm />
                    </div>

                    {/* Dashboard Card 3: Holdings View */}
                    <div style={cardStyle}>
                        <h2>Current Holdings</h2>
                        <HoldingsTable holdings={holdings} />
                    </div>
                    
                    {/* Dashboard Card 4: Placeholder for Transactions/News */}
                    <div style={cardStyle}>
                        <PlaceholderCard title="Market News" message="Placeholder for real-time news feed." />
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
