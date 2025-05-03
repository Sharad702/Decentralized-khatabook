import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import TransactionsPage from './pages/TransactionsPage';
import InventoryPage from './pages/InventoryPage';
import ErrorMessage from './components/ErrorMessage';
import { setNavigate } from './utils/navigation';
import './App.css';

const AppContent = () => {
  const { error, isConnected, connectWallet } = useWeb3();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize navigation
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // Force scroll to top when navigating between pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem'
      }}>
        {error && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <ErrorMessage message={error} retry={connectWallet} />
          </div>
        )}
        
        {!error && (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customer/:customerAddress" element={<CustomerDetailsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <Web3Provider>
      <Router>
        <AppContent />
      </Router>
    </Web3Provider>
  );
}

export default App;
