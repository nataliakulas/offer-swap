import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { creamSetup, wwtSetup } from "./utils";

describe("Offer - parameters", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  const STATE_HASH =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  let expiration_date: number = 0;
  let state_hash: BigNumber;

  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let other: SignerWithAddress;

  let cream: Contract;
  let wwt: Contract;

  let Offer: ContractFactory;
  let offer: Contract;

  beforeEach(async function () {
    [seller, buyer, other] = await ethers.getSigners();

    cream = await creamSetup(buyer.address);
    wwt = await wwtSetup(seller.address);

    Offer = await ethers.getContractFactory("Offer");
  });

  it("reverts when expired", async () => {
    expiration_date = await time.latest();
    await wwt.setStateHash("1", STATE_HASH);
    state_hash = await wwt.stateHash("1");

    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date,
      state_hash
    );
    await offer.deployed();

    await expect(offer.connect(buyer).swap()).to.be.revertedWith(
      "Offer has expired"
    );
  });

  it("reverts when caller is not buyer", async () => {
    expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;
    await wwt.setStateHash("1", STATE_HASH);
    state_hash = await wwt.stateHash("1");

    offer = await Offer.deploy(
      other.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date,
      state_hash
    );
    await offer.deployed();

    await expect(offer.connect(buyer).swap()).to.be.revertedWith(
      "Caller is not buyer"
    );
  });

  it("reverts when State Hashes does not match", async () => {
    expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;
    await wwt.setStateHash("1", STATE_HASH);
    await wwt.mint(seller.address);
    await wwt.setStateHash(
      "2",
      "0x0000000000000000000000000000000000000000000000000000000000000002"
    );
    state_hash = await wwt.stateHash("2");

    Offer = await ethers.getContractFactory("Offer");
    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date,
      state_hash
    );

    await expect(offer.connect(buyer).swap()).to.be.revertedWith(
      "State Hash must be the same"
    );
  });
});

describe("Offer - token swap", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  const STATE_HASH =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  let expiration_date: number = 0;
  let state_hash: BigNumber;

  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;

  let cream: Contract;
  let wwt: Contract;

  let Offer: ContractFactory;
  let offer: Contract;

  beforeEach(async function () {
    expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;
    [seller, buyer] = await ethers.getSigners();

    cream = await creamSetup(buyer.address);
    wwt = await wwtSetup(seller.address);

    await wwt.setStateHash("1", STATE_HASH);
    state_hash = await wwt.stateHash("1");

    Offer = await ethers.getContractFactory("Offer");
    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date,
      state_hash
    );
    await offer.deployed();
  });

  it("seller should be an offer owner", async () => {
    expect(await offer.owner()).to.equal(seller.address);
  });

  it("seller should approve offer address to transfer the NFT token", async () => {
    await wwt.approve(offer.address, "1");

    expect(await wwt.getApproved("1")).to.equal(offer.address);
  });

  it("buyer should approve offer address to transfer the amount", async () => {
    await cream.connect(buyer).approve(offer.address, 100);

    expect(
      (await cream.allowance(buyer.address, offer.address)).toString()
    ).to.equal("100");
  });

  it("token swap should emit an event", async () => {
    await wwt.approve(offer.address, "1");
    await cream.connect(buyer).approve(offer.address, 100);
    state_hash = await wwt.stateHash("1");

    await expect(offer.connect(buyer).swap())
      .to.emit(offer, "Bought")
      .withArgs(
        seller.address,
        buyer.address,
        wwt.address,
        "1",
        cream.address,
        1,
        expiration_date,
        state_hash
      );
  });
});

describe("Offer - cancel", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  const STATE_HASH =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  let expiration_date: number = 0;
  let state_hash: BigNumber;

  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;

  let cream: Contract;
  let wwt: Contract;

  let Offer: ContractFactory;
  let offer: Contract;

  beforeEach(async function () {
    expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;
    [seller, buyer] = await ethers.getSigners();

    cream = await creamSetup(buyer.address);
    wwt = await wwtSetup(seller.address);

    await wwt.setStateHash("1", STATE_HASH);
    state_hash = await wwt.stateHash("1");

    Offer = await ethers.getContractFactory("Offer");
    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date,
      state_hash
    );
    await offer.deployed();
  });

  it("cancel should be reverted when caller is not owner", async () => {
    await expect(offer.connect(buyer).cancel()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("cancel should emit event", async () => {
    const balance = await ethers.provider.getBalance(offer.address);

    await expect(offer.cancel()).to.emit(offer, "Cancelled").withArgs(balance);
  });
});
