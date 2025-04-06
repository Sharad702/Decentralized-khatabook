import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { getEntries, getBalance } from '../utils/web3';
import { Entry } from '../interfaces';
import LoadingSpinner from '../components/LoadingSpinner';

const CustomerDetailsPage: React.FC = () => {
  const { customerAddress } = useParams<{ customerAddress: string }>();
  const { contract, account, customers } = useWeb3();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const customer = customers.find(c => c.customerAddress === customerAddress);

  const loadCustomerData = async () => {
    if (!contract || !account || !customerAddress) return;

    try {
      setLoading(true);
      const [entriesData, balanceData] = await Promise.all([
        getEntries(contract, account, customerAddress),
        getBalance(contract, account, customerAddress)
      ]);

      setEntries(entriesData);
      setBalance(balanceData);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [contract, account, customerAddress]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        borderRadius: '0.5rem',
        margin: '1.5rem 0'
      }}>
        {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderRadius: '0.5rem',
        margin: '1.5rem 0'
      }}>
        Customer not found
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      maxWidth: '1280px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 4rem)',
      backgroundColor: '#F9FAFB'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>{customer.name}</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
              Mobile Number
            </div>
            <div style={{ fontSize: '1rem', color: '#111827' }}>
              {customer.mobileNumber}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
              Address
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#111827',
              fontFamily: 'monospace',
              backgroundColor: '#F3F4F6',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              overflow: 'auto'
            }}>
              {customerAddress}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>
              Balance
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: Number(balance) >= 0 ? '#059669' : '#DC2626'
            }}>
              ₹{Math.abs(Number(balance)).toFixed(2)} {Number(balance) >= 0 ? '(Credit)' : '(Debit)'}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>Transaction History</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F3F4F6' }}>
            <tr>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Date</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Description</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'right', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((entry, index) => (
              <tr 
                key={index}
                style={{ 
                  borderBottom: '1px solid #E5E7EB'
                }}
              >
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {new Date(Number(entry.timestamp) * 1000).toLocaleDateString()}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {entry.description}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'right',
                  color: Number(entry.amount) >= 0 ? '#059669' : '#DC2626'
                }}>
                  ₹{Math.abs(Number(entry.amount)).toFixed(2)}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={3} style={{ 
                  padding: '3rem', 
                  textAlign: 'center',
                  color: '#6B7280'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                    </svg>
                    <div style={{ fontSize: '0.875rem' }}>No transactions found</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDetailsPage; 