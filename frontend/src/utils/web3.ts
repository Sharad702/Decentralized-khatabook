import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import detectEthereumProvider from '@metamask/detect-provider';
import DecentralizedKhatabook from '../contracts/DecentralizedKhatabook.json';
import contractAddress from '../config/contract-address.json';
import { Customer, Entry, Product } from '../interfaces';

const CONTRACT_ADDRESS = contractAddress.DecentralizedKhatabook;

// Check if contract address is set
if (!CONTRACT_ADDRESS) {
  throw new Error('Contract address not found in configuration');
}

export async function getWeb3() {
  try {
    const provider = await detectEthereumProvider();
    
    if (provider) {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const web3 = new Web3(provider as any);
      
      // Check if we're on the correct network (localhost:8545)
      const networkId = await web3.eth.net.getId();
      if (Number(networkId) !== 31337) {
        throw new Error('Please connect to localhost:8545 network in MetaMask');
      }
      
      return web3;
    } else {
      throw new Error('Please install MetaMask!');
    }
  } catch (error) {
    console.error('Error in getWeb3:', error);
    throw error;
  }
}

export async function getContract(web3: Web3): Promise<Contract<AbiItem[]>> {
  try {
    const contract = new web3.eth.Contract(
      DecentralizedKhatabook.abi as AbiItem[],
      CONTRACT_ADDRESS
    );
    return contract;
  } catch (error) {
    console.error('Error in getContract:', error);
    throw error;
  }
}

export async function getAccounts(web3: Web3): Promise<string[]> {
  try {
    // Force MetaMask to show the account selection popup
    // By explicitly requesting eth_requestAccounts (rather than eth_accounts)
    if (window.ethereum) {
      // This will trigger the MetaMask popup if not already connected
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    
    // Now get the accounts after user has approved or rejected
    const accounts = await web3.eth.getAccounts();
    return accounts;
  } catch (error) {
    console.error('Error in getAccounts:', error);
    throw error;
  }
}

export async function getNetworkId(web3: Web3): Promise<string> {
  try {
    const networkId = await web3.eth.net.getId();
    return networkId.toString();
  } catch (error) {
    console.error('Error in getNetworkId:', error);
    throw error;
  }
}

export const addCustomer = async (
  contract: Contract<AbiItem[]>,
  account: string,
  customerAddress: string,
  name: string,
  mobileNumber: string
): Promise<void> => {
  try {
    const gas = await contract.methods
      .addCustomer(customerAddress, name, mobileNumber)
      .estimateGas({ from: account });
    
    await contract.methods
      .addCustomer(customerAddress, name, mobileNumber)
      .send({ from: account, gas: gas.toString() });
  } catch (error) {
    console.error('Error in addCustomer:', error);
    throw error;
  }
};

export async function addEntry(
  contract: Contract<AbiItem[]>,
  from: string,
  customerAddress: string,
  amount: number,
  description: string
): Promise<void> {
  try {
    const amountString = amount.toString();
    await contract.methods.addEntry(customerAddress, amountString, description)
      .send({ from });
  } catch (error) {
    console.error('Error in addEntry:', error);
    throw error;
  }
}

export async function getCustomers(contract: Contract<AbiItem[]>, from: string): Promise<Customer[]> {
  try {
    const customers: any[] = await contract.methods.getCustomers().call({ from });
    const customerAddresses: string[] = await contract.methods.getCustomerAddresses().call({ from });
    
    if (!customers || !customerAddresses) return [];
    
    return customers.map((customer: any, index: number) => ({
      ...customer,
      customerAddress: customerAddresses[index]
    }));
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
}

export async function getEntries(
  contract: Contract<AbiItem[]>,
  from: string,
  customerAddress: string
): Promise<Entry[]> {
  try {
    const entries = await contract.methods.getEntries(customerAddress).call({ from }) as any[];
    return entries.map(entry => ({
      amount: entry.amount.toString(),
      description: entry.description,
      timestamp: entry.timestamp.toString(),
      settled: entry.settled
    }));
  } catch (error) {
    console.error('Error in getEntries:', error);
    throw error;
  }
}

export async function getBalance(
  contract: Contract<AbiItem[]>,
  from: string,
  customerAddress: string
): Promise<string> {
  try {
    const balance = await contract.methods.getBalance(customerAddress).call({ from });
    // Convert BigInt to string to avoid type mixing issues
    return balance ? balance.toString() : '0';
  } catch (error) {
    console.error('Error in getBalance:', error);
    throw error;
  }
}

export async function settleEntry(
  contract: Contract<AbiItem[]>,
  from: string,
  customerAddress: string,
  entryIndex: number
): Promise<void> {
  try {
    await contract.methods.settleEntry(customerAddress, entryIndex)
      .send({ from });
  } catch (error) {
    console.error('Error in settleEntry:', error);
    throw error;
  }
}

export const addProduct = async (
  contract: Contract<AbiItem[]>,
  account: string,
  name: string,
  description: string,
  quantity: number,
  price: number
): Promise<void> => {
  try {
    const gas = await contract.methods
      .addProduct(name, description, quantity, price)
      .estimateGas({ from: account });
    
    await contract.methods
      .addProduct(name, description, quantity, price)
      .send({ from: account, gas: gas.toString() });
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

export const updateProduct = async (
  contract: Contract<AbiItem[]>,
  account: string,
  productId: number,
  quantity: number,
  price: number
): Promise<void> => {
  try {
    const gas = await contract.methods
      .updateProduct(productId, quantity, price)
      .estimateGas({ from: account });
    
    await contract.methods
      .updateProduct(productId, quantity, price)
      .send({ from: account, gas: gas.toString() });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const getProduct = async (
  contract: Contract<AbiItem[]>,
  account: string,
  productId: number
): Promise<Product> => {
  try {
    const product = await contract.methods.getProduct(productId).call({ from: account }) as {
      name: string;
      description: string;
      quantity: string;
      price: string;
      exists: boolean;
    };
    
    return {
      id: productId,
      name: product.name,
      description: product.description,
      quantity: Number(product.quantity),
      price: Number(product.price),
      exists: product.exists
    };
  } catch (error) {
    console.error('Error in getProduct:', error);
    throw error;
  }
};

export const getAllProducts = async (
  contract: Contract<AbiItem[]>,
  account: string
): Promise<Product[]> => {
  try {
    const products = await contract.methods.getAllProducts().call({ from: account }) as Array<{
      name: string;
      description: string;
      quantity: string;
      price: string;
      exists: boolean;
    }>;
    
    return products.map((product, index) => ({
      id: index + 1,
      name: product.name,
      description: product.description,
      quantity: Number(product.quantity),
      price: Number(product.price),
      exists: product.exists
    })).filter((product: Product) => product.exists);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
};

export const addEntryWithInventory = async (
  contract: Contract<AbiItem[]>,
  account: string,
  customerAddress: string,
  amount: number,
  description: string,
  productId: number,
  quantity: number
): Promise<void> => {
  try {
    const gas = await contract.methods
      .addEntryWithInventory(customerAddress, amount, description, productId, quantity)
      .estimateGas({ from: account });
    
    await contract.methods
      .addEntryWithInventory(customerAddress, amount, description, productId, quantity)
      .send({ from: account, gas: gas.toString() });
  } catch (error) {
    console.error('Error in addEntryWithInventory:', error);
    throw error;
  }
}; 