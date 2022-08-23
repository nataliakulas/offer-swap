import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { creamSetup } from "./utils";

describe("CRMToken", () => {
  let buyer: SignerWithAddress;
  let cream: Contract;

  beforeEach(async () => {
    [, buyer] = await ethers.getSigners();
    cream = await creamSetup(buyer.address);
  });

  it("buyer should have initial balance after deploy", async () => {
    expect((await cream.balanceOf(buyer.address)).toString()).to.equal("100");
  });
});
