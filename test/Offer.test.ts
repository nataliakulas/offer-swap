import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { creamSetup, wwtSetup } from "./utils";

describe("Offer - parameters", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  let expiration_date: number = 0;

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

    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date
    );
    await offer.deployed();

    await expect(offer.connect(buyer).swap()).to.be.revertedWith(
      "Offer has expired"
    );
  });

  it("reverts when caller is not buyer", async () => {
    expiration_date = (await time.latest()) + ONE_YEAR_IN_SECS;

    offer = await Offer.deploy(
      other.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date
    );
    await offer.deployed();

    await expect(offer.connect(buyer).swap()).to.be.revertedWith(
      "Caller is not buyer"
    );
  });
});

describe("Offer - token swap", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  let expiration_date: number = 0;

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

    Offer = await ethers.getContractFactory("Offer");
    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date
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

    await expect(offer.connect(buyer).swap())
      .to.emit(offer, "Bought")
      .withArgs(
        seller.address,
        buyer.address,
        wwt.address,
        "1",
        cream.address,
        1,
        expiration_date
      );
  });
});

describe("Offer - cancel", () => {
  const ONE_YEAR_IN_SECS: number = 365 * 24 * 60 * 60;
  let expiration_date: number = 0;

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

    Offer = await ethers.getContractFactory("Offer");
    offer = await Offer.deploy(
      buyer.address,
      wwt.address,
      "1",
      cream.address,
      1,
      expiration_date
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
