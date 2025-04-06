const hre = require("hardhat");

async function main() {
  console.log("Deploying DecentralizedKhatabook...");

  const khatabook = await hre.ethers.deployContract("DecentralizedKhatabook");
  await khatabook.waitForDeployment();

  console.log("DecentralizedKhatabook deployed to:", khatabook.target);
  
  // Save the contract address for the frontend
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/config";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ DecentralizedKhatabook: khatabook.target }, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
