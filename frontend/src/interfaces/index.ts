export interface Customer {
  customerAddress: string;
  name: string;
  mobileNumber: string;
  exists: boolean;
}

export interface Entry {
  amount: string;
  description: string;
  timestamp: string;
  settled: boolean;
}

export interface Transaction {
  customerName: string;
  amount: number;
  description: string;
  timestamp: number;
  isDebit: boolean;
}

export interface AppState {
  account: string | null;
  balance: string;
  isConnected: boolean;
  networkId: number | null;
  customers: Customer[];
  transactions: Transaction[];
}

export interface CustomerWithBalance extends Customer {
  balance: string;
} 