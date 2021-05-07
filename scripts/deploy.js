const { ethers } = require("hardhat");

async function main() {
  const Realtyum = await ethers.getContractFactory("Realtyum");
  const mc = await Realtyum.deploy();
  await mc.deployed();

  console.log("Token was deployed to:", mc.address);
}

main();
