import { ethers } from "hardhat";
import { Contract } from "ethers";

export const creamSetup = async (address: string): Promise<Contract> => {
  const CRMToken = await ethers.getContractFactory("CRMToken");
  const cream = await CRMToken.deploy(address, 100);

  await cream.deployed();

  return cream;
};

export const wwtSetup = async (address: string): Promise<Contract> => {
  const WWTToken = await ethers.getContractFactory("WWTToken");
  const wwt = await WWTToken.deploy(address);

  await wwt.deployed();

  return wwt;
};
