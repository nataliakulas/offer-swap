import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("WWTToken", () => {
  let seller: SignerWithAddress;
  let WWTToken: ContractFactory;
  let wwt: Contract;

  beforeEach(async () => {
    [seller] = await ethers.getSigners();

    WWTToken = await ethers.getContractFactory("WWTToken");
    wwt = await WWTToken.deploy(seller.address);

    await wwt.deployed();
  });

  it("seller should be an owner of first token after deploy", async () => {
    expect(await wwt.ownerOf("1")).to.equal(seller.address);
  });
});
