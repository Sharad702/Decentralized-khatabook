/**
 * Simple script to set the smart contract address
 * Run with: node setupContract.js <contract-address>
 */
const fs = require('fs');
const path = require('path');

const contractAddressArg = process.argv[2];

if (!contractAddressArg) {
  console.error('Please provide a contract address as an argument');
  console.log('Usage: node setupContract.js <contract-address>');
  process.exit(1);
}

// Validate Ethereum address format (basic validation)
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddressArg)) {
  console.error('The provided address does not appear to be a valid Ethereum address');
  console.log('It should be in the format: 0x...');
  process.exit(1);
}

const WEB3_FILE_PATH = path.join(__dirname, 'utils', 'web3.ts');

try {
  let content = fs.readFileSync(WEB3_FILE_PATH, 'utf8');
  
  // Replace the contract address
  content = content.replace(
    /const CONTRACT_ADDRESS = ['"].*['"]/,
    `const CONTRACT_ADDRESS = '${contractAddressArg}'`
  );
  
  fs.writeFileSync(WEB3_FILE_PATH, content);
  
  console.log(`Contract address updated to ${contractAddressArg}`);
  console.log('You can now run "npm start" to start the application');
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
} 