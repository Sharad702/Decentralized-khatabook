import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import {
  getWeb3,
  getContract,
  getAccounts,
  getNetworkId,
  getCustomers
} from '../utils/web3';
import { Customer } from '../interfaces';

interface Web3ContextProps {
  web3: Web3 | null;
  contract: any | null;
  account: string | null;
  networkId: number | null;
  isConnected: boolean;
  customers: Customer[];
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  loadContractData: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextProps>({
  web3: null,
  contract: null,
  account: null,
  networkId: null,
  isConnected: false,
  customers: [],
  loading: false,
  error: null,
  connectWallet: async () => {},
  loadContractData: async () => {}
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const web3Instance = await getWeb3();
      setWeb3(web3Instance);
      
      const accounts = await getAccounts(web3Instance);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
      
      const networkId = await getNetworkId(web3Instance);
      setNetworkId(Number(networkId));
      
      const contractInstance = await getContract(web3Instance);
      setContract(contractInstance);
      
      await loadContractData();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.');
    } finally {
      setLoading(false);
    }
  };

  const loadContractData = async () => {
    if (!contract || !account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const customersData = await getCustomers(contract, account);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading contract data:', error);
      setError('Failed to load contract data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!web3) return;
    
    const ethereum = window.ethereum;
    if (ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setIsConnected(false);
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await loadContractData();
        }
      };
      
      ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [web3, account]);

  // Listen for network changes
  useEffect(() => {
    if (!web3) return;
    
    const ethereum = window.ethereum;
    if (ethereum) {
      const handleChainChanged = async (chainId: string) => {
        // Reload the page as recommended by MetaMask
        window.location.reload();
      };
      
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [web3]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        contract,
        account,
        networkId,
        isConnected,
        customers,
        loading,
        error,
        connectWallet,
        loadContractData
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

declare global {
  interface Window {
    ethereum: any;
  }
} 