import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import Stat from '../components/Dashboard/Stat';
import RecentActivity from '../components/Dashboard/RecentActivity';
import LoadingSpinner from '../components/LoadingSpinner';
import { Transaction, Customer, Entry } from '../interfaces';
import { getEntries, getBalance } from '../utils/web3';

const DashboardPage: React.FC = () => {
  const { contract, account, customers } = useWeb3();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState<number>(0);
  const [youGetAmount, setYouGetAmount] = useState<number>(0);
  const [youGiveAmount, setYouGiveAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!contract || !account || customers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let allTransactions: Transaction[] = [];
        let totalCredit = 0;
        let totalDebit = 0;

        for (const customer of customers) {
          // Get entries for each customer
          const entries: Entry[] = await getEntries(contract, account, customer.customerAddress);
          
          // Calculate balance for this customer
          const customerBalance = await getBalance(contract, account, customer.customerAddress);
          const balanceNumber = Number(customerBalance.toString());
          
          if (balanceNumber > 0) {
            totalCredit += balanceNumber;
          } else if (balanceNumber < 0) {
            totalDebit += Math.abs(balanceNumber);
          }

          // Map entries to transactions with proper number conversions
          const customerTransactions = entries.map(entry => {
            const amount = Number(entry.amount.toString());
            return {
              customerName: customer.name,
              amount: Math.abs(amount),
              description: entry.description,
              timestamp: Number(entry.timestamp.toString()),
              isDebit: amount < 0
            };
          });

          allTransactions = [...allTransactions, ...customerTransactions];
        }

        // Sort transactions by timestamp (newest first)
        allTransactions.sort((a, b) => b.timestamp - a.timestamp);
        
        setTotalOutstanding(totalCredit - totalDebit);
        setYouGetAmount(totalCredit);
        setYouGiveAmount(totalDebit);
        setTransactions(allTransactions.slice(0, 10)); // Get only the 10 most recent transactions
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [contract, account, customers]);

  if (loading) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>Dashboard Overview</h1>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <LoadingSpinner message="Loading dashboard data..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
      }}>Dashboard Overview</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        <Stat
          title="Total Outstanding"
          value={totalOutstanding}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <Stat
          title="Total Customers"
          value={customers.length}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <Stat
          title="You'll Get"
          value={youGetAmount}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          }
          color="green"
          subtext="You will receive"
        />
        
        <Stat
          title="You'll Give"
          value={youGiveAmount}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          }
          color="red"
          subtext="You will pay"
        />
      </div>
      
      <RecentActivity transactions={transactions} />
    </div>
  );
};

export default DashboardPage; 