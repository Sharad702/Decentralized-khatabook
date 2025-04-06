import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Customer, Entry, Transaction } from '../interfaces';
import { getEntries, addEntry } from '../utils/web3';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const TransactionsPage: React.FC = () => {
  const { contract, account, customers, loadContractData } = useWeb3();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isDebit, setIsDebit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!contract || !account || customers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let transactions: Transaction[] = [];

        for (const customer of customers) {
          // Get entries for each customer
          const entries: Entry[] = await getEntries(contract, account, customer.customerAddress);

          // Map entries to transactions
          const customerTransactions = entries.map(entry => ({
            customerName: customer.name,
            amount: Math.abs(Number(entry.amount)),
            description: entry.description,
            timestamp: Number(entry.timestamp),
            isDebit: Number(entry.amount) < 0
          }));

          transactions = [...transactions, ...customerTransactions];
        }

        // Sort transactions by timestamp (newest first)
        transactions.sort((a, b) => b.timestamp - a.timestamp);
        setAllTransactions(transactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [contract, account, customers]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !account) return;
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      if (!selectedCustomer || !amount || !description) {
        setError('Please fill in all fields');
        return;
      }
      
      const amountValue = isDebit ? -Number(amount) : Number(amount);
      
      await addEntry(contract, account, selectedCustomer, amountValue, description);
      
      // Reset form
      setSelectedCustomer('');
      setAmount('');
      setDescription('');
      setIsDebit(false);
      setShowAddTransaction(false);
      
      // Reload data
      await loadContractData();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      setError(error.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && allTransactions.length === 0) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>Transaction History</h1>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <LoadingSpinner message="Loading transactions..." />
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          Transaction History
        </h1>
        <button
          onClick={() => setShowAddTransaction(true)}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          Add Transaction
        </button>
      </div>

      {showAddTransaction && (
        <Modal
          isOpen={showAddTransaction}
          onClose={() => {
            setShowAddTransaction(false);
            setError(null);
            setSelectedCustomer('');
            setAmount('');
            setDescription('');
            setIsDebit(false);
          }}
          title="Add New Transaction"
        >
          <form onSubmit={handleAddTransaction}>
            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#FEE2E2',
                color: '#B91C1C',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Customer
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  color: '#111827'
                }}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.customerAddress} value={customer.customerAddress}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Amount (₹)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem'
                  }}
                  required
                  min="0"
                  step="0.01"
                />
                <button
                  type="button"
                  onClick={() => setIsDebit(!isDebit)}
                  style={{
                    padding: '0.625rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: isDebit ? '#DC2626' : '#059669',
                    color: 'white',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isDebit ? 'Debit' : 'Credit'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter transaction description"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  minHeight: '5rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddTransaction(false);
                  setError(null);
                  setSelectedCustomer('');
                  setAmount('');
                  setDescription('');
                  setIsDebit(false);
                }}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {allTransactions.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280' }}>No transactions recorded yet. Add your first transaction.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              minWidth: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{
                    padding: '0.75rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    CUSTOMER
                  </th>
                  <th style={{
                    padding: '0.75rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    AMOUNT
                  </th>
                  <th style={{
                    padding: '0.75rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    DESCRIPTION
                  </th>
                  <th style={{
                    padding: '0.75rem 1.5rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((transaction, index) => {
                  // Format date
                  const date = new Date(transaction.timestamp * 1000);
                  const formattedDate = date.toLocaleString();
                  
                  return (
                    <tr 
                      key={index} 
                      style={{ 
                        borderTop: '1px solid #e5e7eb',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{
                        padding: '1rem 1.5rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#111827'
                        }}>{transaction.customerName}</div>
                      </td>
                      <td style={{
                        padding: '1rem 1.5rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: transaction.isDebit ? '#dc2626' : '#16a34a'
                        }}>
                          ₹{transaction.amount}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem 1.5rem',
                        maxWidth: '20rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#4b5563',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {transaction.description}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem 1.5rem',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#4b5563'
                        }}>
                          {formattedDate}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage; 