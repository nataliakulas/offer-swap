import hre from "hardhat";

const { expect } = require("chai");

describe("WWTToken", function () {
  before(async function () {
    this.WWTToken = await hre.ethers.getContractFactory("WWTToken");
  });

  beforeEach(async function () {
    const accounts = await hre.ethers.provider.listAccounts();

    this.wwt = await this.WWTToken.deploy(accounts[0]);
    await this.wwt.deployed();
  });

  it("seller should be an owner of first token after deploy", async function () {
    const accounts = await hre.ethers.provider.listAccounts();

    expect(await this.wwt.ownerOf("1")).to.equal(accounts[0]);
  });
});
