// pages/index.js
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the Python API route
    fetch('/api/status')
      .then(res => {
        if (!res.ok) {
          throw new Error(\`HTTP error! status: \${res.status}\`);
        }
        return res.json();
      })
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch API status:", error);
        setStatus({ 
          status: 'Connection Error', 
          timestamp: new Date().toISOString(), 
          portfolio_value: 'N/A', 
          recent_trades: [],
          message: error.message 
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>Loading Trading Platform Status...</h2>
      </div>
    );
  }

  const statusColor = {
    'Active': 'green', 
    'Processing': 'orange', 
    'Idle': 'blue', 
    'Error': 'red',
    'Connection Error': 'red'
  }[status.status] || 'gray';

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      maxWidth: '800px', 
      margin: '40px auto', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        Mock Trading Platform Dashboard
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <strong>Platform Status:</strong> 
          <span style={{ color: statusColor, fontWeight: 'bold', marginLeft: '10px' }}>{status.status}</span>
        </div>
        <div>
          <strong>Portfolio Value:</strong> 
          <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
            {status.portfolio_value === 'N/A' ? 'N/A' : \`$\${status.portfolio_value.toLocaleString()}\`}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Last Checked: {new Date(status.timestamp).toLocaleString()}
      </p>

      <h2 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        Recent Trades ({status.recent_trades.length})
      </h2>
      
      {status.recent_trades.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Symbol</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Type</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Quantity</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {status.recent_trades.map((trade, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontSize: '0.9em' }}>{new Date(trade.time).toLocaleTimeString()}</td>
                <td style={{ padding: '10px' }}>{trade.symbol}</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: trade.type === 'BUY' ? 'blue' : 'purple', textAlign: 'right' }}>{trade.type}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{trade.quantity}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>\${trade.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recent trade data available.</p>
      )}

      <p style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderLeft: '3px solid #0070f3' }}>
        System Message: {status.message}
      </p>
    </div>
  );
}

export default Dashboard;
