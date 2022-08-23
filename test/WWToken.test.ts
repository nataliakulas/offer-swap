import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { wwtSetup } from "./utils";

describe("WWTToken", () => {
  let seller: SignerWithAddress;
  let wwt: Contract;

  beforeEach(async () => {
    [seller] = await ethers.getSigners();
    wwt = await wwtSetup(seller.address);
  });

  it("seller should be an owner of first token after deploy", async () => {
    expect(await wwt.ownerOf("1")).to.equal(seller.address);
  });
});
