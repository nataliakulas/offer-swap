import hre from "hardhat";

const { expect } = require("chai");

describe("Offer", function () {
  before(async function () {
    this.CRMToken = await hre.ethers.getContractFactory("CRMToken");
    this.WWTToken = await hre.ethers.getContractFactory("WWTToken");
    this.Offer = await hre.ethers.getContractFactory("Offer");
  });

  beforeEach(async function () {
    const accounts = await hre.ethers.provider.listAccounts();
    const seller = accounts[0];
    const buyer = accounts[1];

    this.cream = await this.CRMToken.deploy(buyer, 100);
    await this.cream.deployed();

    this.wwt = await this.WWTToken.deploy(seller);
    await this.wwt.deployed();

    this.offer = await this.Offer.deploy(
      this.wwt.address,
      "1",
      this.cream.address,
      1
    );
    await this.offer.deployed();
  });

  it("seller should be an offer owner", async function () {
    const accounts = await hre.ethers.provider.listAccounts();
    const seller = accounts[0];

    expect(await this.offer.owner()).to.equal(seller);
  });

  it("seller should approve offer address to transfer the NFT token", async function () {
    this.wwt.approve(this.offer.address, "1");

    expect(await this.wwt.getApproved("1")).to.equal(this.offer.address);
  });

  it("buyer should approve offer address to transfer the amount", async function () {
    const accounts = await hre.ethers.provider.listAccounts();
    const buyer = accounts[1];

    this.cream.connect(buyer).approve(this.offer.address, 100);

    expect(
      (await this.cream.allowance(buyer, this.offer.address)).toString()
    ).to.equal("100");
  });

  it("buyer should can make a swap", async function () {
    const accounts = await hre.ethers.provider.listAccounts();
    const seller = accounts[0];
    const buyer = accounts[1];

    this.wwt.approve(this.offer.address, "1");
    this.cream.connect(buyer).approve(this.offer.address, 100);

    this.offer.connect(buyer).swap("1", 1, seller);

    expect(await this.wwt.ownerOf("1")).to.equal(buyer);
  });
});
