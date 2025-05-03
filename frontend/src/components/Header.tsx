import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { navigateToDashboard, navigateToCustomers, navigateToTransactions, navigateToInventory } from '../utils/navigation';

const Header: React.FC = () => {
  const { account, isConnected, connectWallet } = useWeb3();
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Common button style
  const navButtonStyle = (path: string) => ({
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    border: 'none',
    cursor: 'pointer'
  });
  
  return (
    <header style={{ 
      backgroundColor: '#4f46e5', 
      padding: '1rem', 
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            margin: 0
          }}>Decentralized Khatabook</h1>
        </div>
        
        <nav style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none',
            margin: 0,
            padding: 0,
            justifyContent: 'space-around'
          }}>
            <li>
              <button
                onClick={navigateToDashboard}
                style={navButtonStyle('/')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={navigateToCustomers}
                style={navButtonStyle('/customers')}
              >
                Customers
              </button>
            </li>
            <li>
              <button
                onClick={navigateToTransactions}
                style={navButtonStyle('/transactions')}
              >
                Transactions
              </button>
            </li>
            <li>
              <button
                onClick={navigateToInventory}
                style={navButtonStyle('/inventory')}
              >
                Inventory
              </button>
            </li>
          </ul>
        </nav>
        
        <div>
          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: '#22c55e', 
                borderRadius: '50%', 
                width: '0.5rem', 
                height: '0.5rem',
                marginRight: '0.5rem'
              }}></span>
              <span style={{ fontSize: '0.875rem' }}>
                {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              style={{
                backgroundColor: 'white',
                color: '#4f46e5',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 