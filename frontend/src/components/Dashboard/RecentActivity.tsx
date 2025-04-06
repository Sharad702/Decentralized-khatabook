import React from 'react';
import { Transaction } from '../../interfaces';

interface RecentActivityProps {
  transactions: Transaction[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>Recent Activity</h2>
        <div style={{
          textAlign: 'center',
          padding: '3rem 0'
        }}>
          <div style={{
            color: '#9ca3af',
            marginBottom: '1rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{
              margin: '0 auto',
              height: '4rem',
              width: '4rem'
            }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '500',
            color: '#374151'
          }}>No Recent Activities</h3>
          <p style={{
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>Your recent transactions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginTop: '1.5rem'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>Recent Activity</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {transactions.map((transaction, index) => (
          <div 
            key={index} 
            style={{
              borderBottom: index < transactions.length - 1 ? '1px solid #e5e7eb' : 'none',
              paddingBottom: '0.75rem',
              paddingTop: '0.75rem',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              borderRadius: '0.375rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 0.5rem'
            }}>
              <div style={{ maxWidth: '70%' }}>
                <h4 style={{ 
                  fontWeight: '500',
                  fontSize: '0.9375rem',
                  marginBottom: '0.375rem' 
                }}>{transaction.customerName}</h4>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{transaction.description}</p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  {new Date(transaction.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <div style={{
                fontWeight: 'bold',
                color: transaction.isDebit ? '#ef4444' : '#22c55e',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: transaction.isDebit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {transaction.isDebit ? (
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1rem', width: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                ₹{Math.abs(transaction.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 