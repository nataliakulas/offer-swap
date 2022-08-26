import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;
  const [seller, buyer] = await ethers.getSigners();

  const CRMToken = await ethers.getContractFactory("CRMToken");
  console.log("Deploying CRMToken...");
  const cream = await CRMToken.deploy(buyer.address, 100);
  await cream.deployed();
  console.log("CRMToken deployed to:", cream.address);

  const WWTToken = await ethers.getContractFactory("WWTToken");
  console.log("Deploying WWTToken...");
  const wwt = await WWTToken.deploy(seller.address);
  await wwt.deployed();
  console.log("WWTToken deployed to:", wwt.address);

  const Offer = await ethers.getContractFactory("Offer");
  console.log("Deploying Offer...");
  const offer = await Offer.deploy(
    wwt.address,
    "1",
    cream.address,
    1,
    expiration_date
  );
  await offer.deployed();
  console.log("Offer deployed to:", offer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
