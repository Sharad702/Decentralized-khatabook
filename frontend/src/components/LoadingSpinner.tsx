import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const spinAnimation = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <style>
        {spinAnimation}
      </style>
      <div style={{
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        border: '2px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        animation: 'spin 1s linear infinite',
        marginBottom: '0.75rem'
      }}></div>
      <p style={{ color: '#4b5563' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner; 