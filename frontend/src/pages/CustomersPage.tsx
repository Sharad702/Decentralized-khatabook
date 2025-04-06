import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Customer } from '../interfaces';
import { addCustomer } from '../utils/web3';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import TransactionModal from '../components/TransactionModal';

const CustomersPage: React.FC = () => {
  const { contract, account, customers, loadContractData } = useWeb3();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddCustomer, setShowAddCustomer] = useState<boolean>(false);
  const [newCustomerAddress, setNewCustomerAddress] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newCustomerMobile, setNewCustomerMobile] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<{ address: string; name: string } | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !account) {
      setError('Wallet not connected. Please connect your wallet first.');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      if (!newCustomerAddress || !newCustomerName || !newCustomerMobile) {
        setError('Please fill in all fields');
        return;
      }
      
      // Validate mobile number
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(newCustomerMobile)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }

      // Ensure the customer address is in correct format (0x...)
      if (!newCustomerAddress.startsWith('0x') || newCustomerAddress.length !== 42) {
        setError('Please enter a valid Ethereum address (0x... format)');
        return;
      }
      
      await addCustomer(contract, account, newCustomerAddress, newCustomerName, newCustomerMobile);
      
      // Reset form
      setNewCustomerAddress('');
      setNewCustomerName('');
      setNewCustomerMobile('');
      setShowAddCustomer(false);
      
      // Reload contract data
      await loadContractData();
    } catch (error: any) {
      console.error('Error adding customer:', error);
      setError(error.message || 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (customerAddress: string) => {
    navigate(`/customer/${customerAddress}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#111827'
        }}>Customer List</h1>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <LoadingSpinner message="Processing..." />
        </div>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '2rem', height: '2rem', color: '#4F46E5' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          Customer List
        </h1>
        <button
          onClick={() => setShowAddCustomer(true)}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Add Customer
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6'
              }}>Name</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6'
              }}>Address</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6'
              }}>Mobile</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'right', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F3F4F6'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr 
                key={customer.customerAddress} 
                style={{ 
                  borderBottom: '1px solid #E5E7EB',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem', 
                  color: '#111827',
                  fontWeight: '500'
                }}>
                  {customer.name}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem', 
                  color: '#6B7280',
                  fontFamily: 'monospace',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {customer.customerAddress}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                  {customer.mobileNumber}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem', 
                  textAlign: 'right'
                }}>
                  <button
                    onClick={() => handleViewDetails(customer.customerAddress)}
                    style={{
                      backgroundColor: '#4F46E5',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.backgroundColor = '#4338CA';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.backgroundColor = '#4F46E5';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ 
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <div style={{ fontSize: '0.875rem' }}>No customers found. Add your first customer!</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showAddCustomer}
        onClose={() => {
          setShowAddCustomer(false);
          setError(null);
        }}
        title="Add New Customer"
      >
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>{error}</div>
        )}
        
        <form onSubmit={handleAddCustomer}>
          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }} htmlFor="customerAddress">
                Customer Address
              </label>
              <input
                type="text"
                id="customerAddress"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 1px #4F46E5';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="0x..."
                required
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }} htmlFor="customerName">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 1px #4F46E5';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter name"
                required
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                color: '#374151',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }} htmlFor="customerMobile">
                Mobile Number
              </label>
              <input
                type="text"
                id="customerMobile"
                value={newCustomerMobile}
                onChange={(e) => setNewCustomerMobile(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4F46E5';
                  e.target.style.boxShadow = '0 0 0 1px #4F46E5';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="10-digit mobile number"
                required
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}>
            <button
              type="button"
              onClick={() => {
                setShowAddCustomer(false);
                setError(null);
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: '#4F46E5',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4338CA';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4F46E5';
              }}
            >
              Add Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomersPage; 