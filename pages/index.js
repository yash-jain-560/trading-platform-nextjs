import React from 'react';

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

// --- Phase 3 Additions ---
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
// -----------------------------


const HomePage = () => {
  return (
    <div style={containerStyle}>
      <main style={mainStyle}>
        <h1 style={headerStyle}>Trading Dashboard</h1>

        <div style={gridStyle}>
          {/* Dashboard Card 1: Holdings View (Phase 3 Implementation) */}
          <div style={cardStyle}>
            <h2>Holdings Summary</h2>
            <HoldingsTable />
          </div>

          {/* Dashboard Card 2: Transactions View (Phase 3 Implementation) */}
          <div style={cardStyle}>
            <h2>Recent Transactions</h2>
            <TransactionsList />
          </div>

          {/* Dashboard Card 3: Market Overview (Placeholder) */}
          <div style={cardStyle}>
            <h2>Market Overview</h2>
            <p>Key market indices and performance metrics.</p>
          </div>

          {/* Dashboard Card 4: Action/Status */}
          <div style={cardStyle}>
            <h2>Platform Status</h2>
            <p>System status: <span style={{ color: 'green', fontWeight: 'bold' }}>Operational</span></p>
            <p>Check API: <a href="/api/status">/api/status</a></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
