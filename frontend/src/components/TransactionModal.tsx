import React, { useState } from 'react';
import Modal from './Modal';
import { useWeb3 } from '../contexts/Web3Context';
import { addEntry } from '../utils/web3';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerAddress: string;
  customerName: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, customerAddress, customerName }) => {
  const { contract, account } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !account) {
      setError('Wallet not connected. Please connect your wallet first.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      if (!amount || !description) {
        setError('Please fill in all fields');
        return;
      }

      // Convert amount to wei (assuming input is in ETH)
      const amountInWei = Number(amount);
      
      await addEntry(contract, account, customerAddress, amountInWei, description);
      
      // Reset form
      setAmount('');
      setDescription('');
      onClose();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      setError(error.message || 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Transaction for ${customerName}`}
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

      <form onSubmit={handleSubmit}>
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
            }} htmlFor="amount">
              Amount (ETH)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                id="amount"
                step="0.000000000000000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  paddingLeft: '2rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
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
                placeholder="0.00"
                required
              />
              <span style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
                fontSize: '0.875rem'
              }}>Ξ</span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '0.25rem'
            }}>
              Positive amount for credit, negative for debit
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                outline: 'none',
                minHeight: '5rem',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4F46E5';
                e.target.style.boxShadow = '0 0 0 1px #4F46E5';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter transaction details..."
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
            onClick={onClose}
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
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#4F46E5',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" style={{ width: '1rem', height: '1rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
                Add Transaction
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal; 