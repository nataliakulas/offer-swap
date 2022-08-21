import hre from "hardhat";

const { expect } = require("chai");

describe("CRMToken", function () {
  before(async function () {
    this.CRMToken = await hre.ethers.getContractFactory("CRMToken");
  });

  beforeEach(async function () {
    const accounts = await hre.ethers.provider.listAccounts();

    this.cream = await this.CRMToken.deploy(accounts[1], 100);
    await this.cream.deployed();
  });

  it("buyer should have initial balance after deploy", async function () {
    const accounts = await hre.ethers.provider.listAccounts();

    expect((await this.cream.balanceOf(accounts[1])).toString()).to.equal(
      "100"
    );
  });
});
