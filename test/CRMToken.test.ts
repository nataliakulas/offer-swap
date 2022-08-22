import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("CRMToken", () => {
  let buyer: SignerWithAddress;
  let CRMToken: ContractFactory;
  let cream: Contract;

  beforeEach(async () => {
    [, buyer] = await ethers.getSigners();

    CRMToken = await ethers.getContractFactory("CRMToken");
    cream = await CRMToken.deploy(buyer.address, 100);
    await cream.deployed();
  });

  it("buyer should have initial balance after deploy", async () => {
    expect((await cream.balanceOf(buyer.address)).toString()).to.equal("100");
  });
});
