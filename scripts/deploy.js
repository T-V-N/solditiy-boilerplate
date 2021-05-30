const { ethers } = require("hardhat");

async function main() {
  const TestCoin = await ethers.getContractFactory("TestCoin");
  const mc = await TestCoin.deploy();
  await mc.deployed();

  console.log("Token was deployed to:", mc.address);
}

main();
