import hre from "hardhat";

async function main() {
  const accounts = await hre.ethers.provider.listAccounts();

  const CRMToken = await hre.ethers.getContractFactory("CRMToken");
  console.log("Deploying CRMToken...");
  const cream = await CRMToken.deploy(accounts[1], 100);
  await cream.deployed();
  console.log("CRMToken deployed to:", cream.address);

  const WWTToken = await hre.ethers.getContractFactory("WWTToken");
  console.log("Deploying WWTToken...");
  const wwt = await WWTToken.deploy(accounts[0]);
  await wwt.deployed();
  console.log("WWTToken deployed to:", wwt.address);

  const Offer = await hre.ethers.getContractFactory("Offer");
  console.log("Deploying Offer...");
  const offer = await Offer.deploy(wwt.address, "0", cream.address, 1);
  await offer.deployed();
  console.log("Offer deployed to:", offer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
