import React from 'react';
import { navigateToDashboard, navigateToCustomers, navigateToTransactions } from '../utils/navigation';

const StaticNavLinks: React.FC = () => {
  const buttonStyle = {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    marginRight: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer'
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    }}>
      <button 
        onClick={navigateToDashboard}
        style={buttonStyle}
      >
        Dashboard
      </button>
      <button 
        onClick={navigateToCustomers}
        style={buttonStyle}
      >
        Customers
      </button>
      <button 
        onClick={navigateToTransactions}
        style={{
          ...buttonStyle,
          marginRight: 0
        }}
      >
        Transactions
      </button>
    </div>
  );
};

export default StaticNavLinks; 