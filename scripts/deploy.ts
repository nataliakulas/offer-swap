import hre from "hardhat";

async function main() {
  const accounts = await hre.ethers.provider.listAccounts();

  const CRMToken = await hre.ethers.getContractFactory("CRMToken");
  console.log("Deploying CRMToken...");
  const cream = await CRMToken.deploy(accounts[1], 100);
  await cream.deployed();
  console.log("CRMToken deployed to:", cream.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
