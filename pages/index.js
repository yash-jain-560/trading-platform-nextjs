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

// --- Phase 3 Components ---
const mockHoldings = [
    { symbol: 'AAPL', quantity: 10, price: 150.00, value: 1500.00 },
    { symbol: 'GOOGL', quantity: 5, price: 2500.00, value: 12500.00 },
    { symbol: 'TSLA', quantity: 2, price: 800.00, value: 1600.00 },
];

const mockTransactions = [
    { type: 'BUY', symbol: 'AAPL', quantity: 10, date: '2026-02-01' },
    { type: 'BUY', symbol: 'GOOGL', quantity: 5, date: '2026-01-25' },
    { type: 'SELL', symbol: 'TSLA', quantity: 1, date: '2026-01-15' },
];

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

const HoldingsTable = () => (
    <table style={tableStyle}>
        <thead>
            <tr>
                <th style={thTdStyle}>Symbol</th>
                <th style={thTdStyle}>Qty</th>
                <th style={thTdStyle}>Price</th>
                <th style={thTdStyle}>Value</th>
            </tr>
        </thead>
        <tbody>
            {mockHoldings.map((h, i) => (
                <tr key={i}>
                    <td style={thTdStyle}>{h.symbol}</td>
                    <td style={thTdStyle}>{h.quantity}</td>
                    <td style={thTdStyle}>${h.price.toFixed(2)}</td>
                    <td style={thTdStyle}>${h.value.toFixed(2)}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const TransactionsList = () => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
        {mockTransactions.map((t, i) => (
            <li key={i} style={{ borderBottom: '1px solid #e9ecef', padding: '10px 0' }}>
                <span style={{ fontWeight: 'bold', color: t.type === 'BUY' ? 'green' : 'red' }}>{t.type}</span> {t.quantity} shares of {t.symbol} on {t.date}
            </li>
        ))}
    </ul>
);

// --- Phase 4 Components ---

const AppStatus = () => (
    <>
        <h2>Platform Status</h2>
        <p>System status: <span style={{ color: 'green', fontWeight: 'bold' }}>Operational</span></p>
        <p>API status: <a href="/api/status">/api/status</a></p>
    </>
);

const MarketOverview = ({ marketData, loading }) => {
    if (loading) {
        return <p>Loading market data...</p>;
    }

    if (!marketData) {
        return <p>Failed to load market data.</p>;
    }

    return (
        <>
            <h2>Market Overview</h2>
            <p><strong>S&P 500:</strong> {marketData.sp500.toFixed(2)} ({marketData.sp500Change > 0 ? '+' : ''}{marketData.sp500Change.toFixed(2)}%)</p>
            <p><strong>NASDAQ:</strong> {marketData.nasdaq.toFixed(2)} ({marketData.nasdaqChange > 0 ? '+' : ''}{marketData.nasdaqChange.toFixed(2)}%)</p>
            <p><strong>DOW:</strong> {marketData.dow.toFixed(2)} ({marketData.dowChange > 0 ? '+' : ''}{marketData.dowChange.toFixed(2)}%)</p>
        </>
    );
};
// -----------------------------


const HomePage = () => {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate an API call to fetch market data
        const fetchMarketData = () => {
            setTimeout(() => {
                setMarketData({
                    sp500: 4500.50,
                    sp500Change: 0.75,
                    nasdaq: 14000.10,
                    nasdaqChange: -0.22,
                    dow: 35000.80,
                    dowChange: 1.15
                });
                setLoading(false);
            }, 1500); // 1.5 second delay
        };

        fetchMarketData();
    }, []);

    return (
        <div style={containerStyle}>
            <main style={mainStyle}>
                <h1 style={headerStyle}>Trading Dashboard</h1>

                <div style={gridStyle}>
                    {/* Dashboard Card 1: Holdings View */}
                    <div style={cardStyle}>
                        <h2>Holdings Summary</h2>
                        <HoldingsTable />
                    </div>

                    {/* Dashboard Card 2: Transactions View */}
                    <div style={cardStyle}>
                        <h2>Recent Transactions</h2>
                        <TransactionsList />
                    </div>

                    {/* Dashboard Card 3: Market Overview (Phase 4 Implementation) */}
                    <div style={cardStyle}>
                        <MarketOverview marketData={marketData} loading={loading} />
                    </div>

                    {/* Dashboard Card 4: Action/Status (Phase 4 Implementation) */}
                    <div style={cardStyle}>
                        <AppStatus />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
