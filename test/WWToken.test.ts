import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { wwtSetup } from "./utils";

describe("WWTToken", () => {
  const STATE_HASH =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  let state_hash: BigNumber;
  let seller: SignerWithAddress;
  let wwt: Contract;

  beforeEach(async () => {
    [seller] = await ethers.getSigners();
    wwt = await wwtSetup(seller.address);
  });

  it("seller should be an owner of first token after deploy", async () => {
    expect(await wwt.ownerOf("1")).to.equal(seller.address);
  });

  it("proper State Hash should be returned", async () => {
    await wwt.setStateHash("1", STATE_HASH);
    state_hash = await wwt.stateHash("1");

    expect(await wwt.stateHash("1")).to.equal(state_hash);
  });
});
