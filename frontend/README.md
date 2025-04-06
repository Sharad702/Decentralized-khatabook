# Decentralized Khatabook

A blockchain-based Khatabook (ledger) application built with React and Ethereum smart contracts. This application allows users to manage credit and debit transactions with their customers in a decentralized manner.

## Features

- Connect with MetaMask wallet
- Add customers with their wallet addresses
- Record credit and debit transactions
- View transaction history
- Track outstanding balances
- Dashboard with key metrics

## Prerequisites

- Node.js and npm
- MetaMask browser extension
- A deployed DecentralizedKhatabook smart contract

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install Tailwind CSS dependencies if they're not already installed:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

4. Update the contract address:
   
   **Option 1**: Use the setup script:
   ```bash
   node src/setupContract.js 0xYourContractAddress
   ```
   
   **Option 2**: Manually update the address:
   Open `src/utils/web3.ts` and replace the CONTRACT_ADDRESS value with your deployed contract address:
   ```typescript
   const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Open your browser at http://localhost:3000

## Deployment

To build the application for production:

```bash
npm run build
```

This will create a `build` directory with optimized production files.

## Project Structure

- `src/components`: UI components
- `src/contexts`: React context providers (Web3Context)
- `src/interfaces`: TypeScript interfaces
- `src/pages`: Main page components
- `src/utils`: Utility functions for blockchain interactions
- `src/contracts`: Smart contract ABI

## Smart Contract

The application interacts with the DecentralizedKhatabook smart contract, which provides the following functionality:

- Add customers
- Record credit/debit entries
- Retrieve entries for a customer
- Calculate balance for a customer
- Mark entries as settled

## Troubleshooting

If you encounter any issues:

1. Make sure MetaMask is installed and connected to the correct network where your contract is deployed
2. Check that the contract address in `web3.ts` is correct
3. Ensure you have ETH in your wallet for gas fees
4. Clear browser cache and reload if UI doesn't update

## License

MIT

## Acknowledgements

- React
- Ethereum
- Web3.js
- MetaMask
- Tailwind CSS
