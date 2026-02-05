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

const HomePage = () => {
  return (
    <div style={containerStyle}>
      <main style={mainStyle}>
        <h1 style={headerStyle}>Trading Dashboard</h1>

        <div style={gridStyle}>
          {/* Dashboard Card 1: Holdings View (Phase 3) */}
          <div style={cardStyle}>
            <h2>Holdings Summary</h2>
            <p>Your current investments will be displayed here.</p>
          </div>

          {/* Dashboard Card 2: Transactions View (Phase 3) */}
          <div style={cardStyle}>
            <h2>Recent Transactions</h2>
            <p>Your latest trades will appear here.</p>
          </div>

          {/* Dashboard Card 3: Market Overview */}
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
