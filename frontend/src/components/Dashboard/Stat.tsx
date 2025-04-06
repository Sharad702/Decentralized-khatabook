import React, { ReactNode, useState } from 'react';

interface StatProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  color?: string;
}

const Stat: React.FC<StatProps> = ({ title, value, icon, subtext, color = 'blue' }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  
  const getColorStyle = () => {
    switch (color) {
      case 'green':
        return '#22c55e';
      case 'red':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const getGradientStyle = () => {
    switch (color) {
      case 'green':
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 1) 70%)';
      case 'red':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(255, 255, 255, 1) 70%)';
      default:
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 1) 70%)';
    }
  };

  // Create a pulse animation
  const pulseStyle = {
    transform: isPulsing ? 'scale(1.2)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        backgroundImage: getGradientStyle(),
        borderRadius: '0.5rem',
        borderLeft: `4px solid ${getColorStyle()}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        flex: '1 0 0',
        minWidth: '200px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
        setIsPulsing(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        setIsPulsing(false);
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          marginRight: '0.75rem',
          color: getColorStyle(),
          ...pulseStyle,
          transition: 'transform 0.3s ease, color 0.3s ease'
        }}>
          {icon}
        </div>
        <h3 style={{
          color: '#4b5563',
          fontSize: '0.875rem'
        }}>{title}</h3>
      </div>
      
      <div style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '0.25rem'
      }}>₹{value}</div>
      
      {subtext && (
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>{subtext}</div>
      )}
    </div>
  );
};

export default Stat; 