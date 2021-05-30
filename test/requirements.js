const { expect } = require("chai");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const bn = ethers.BigNumber;
const t = (val) => bn.from(val).mul(bn.from(10).pow(18));

chai.use(solidity);

const deadlineTime = Date.now() + 100000000;
const test_supply = t(1000000000);
const penny_supply = t(1000000000000000);

describe("Requirements", function () {
  let usd, weth, penny, router, LPprovider, factory;

  before(async () => {
    await network.provider.request({
      method: "hardhat_reset",
      params: [],
    });

    console.log("Network reset");

    let [feeAddress] = await ethers.getSigners();

    const usdFactory = await ethers.getContractFactory("USD");
    const wethFactory = await ethers.getContractFactory("WETH9");
    const pennyFactory = await ethers.getContractFactory("PennyToken");
    const routerFactory = await ethers.getContractFactory("UniswapV2Router01");
    const factoryFactory = await ethers.getContractFactory("UniswapV2Factory");

    //deploy tokens
    usd = await usdFactory.deploy("USD", "USD", test_supply);
    penny = await pennyFactory.deploy("Penny", "Penny", penny_supply);
    console.log(`USD deployed at:${usd.address}`);
    console.log(`Penny deployed at:${penny.address}`);

    await usd.deployed();
    await penny.deployed();

    //deploy pancake factory
    factory = await factoryFactory.deploy(feeAddress.address);
    await factory.deployed();
    console.log(`Factory deployed at:${factory.address} code hash:`);
    console.log(await factory.INIT_CODE_PAIR_HASH());

    //Create weth pair
    weth = await wethFactory.deploy();
    await weth.deployed();
    console.log(`\nWeth deployed at:${weth.address}`);

    //Create pancake router
    router = await routerFactory.deploy(factory.address, weth.address);
    await router.deployed();
    console.log(`Router deployed at:${router.address}`);
  });

  // This is called before each test to reset the contract
  beforeEach(async function () {
    snapshot = await network.provider.send("evm_snapshot");
    [LPprovider, addr1] = await ethers.getSigners();
  });

  it("Initial state check", async function () {
    //Add bnb/usd liquidity
    await usd.approve(router.address, t(test_supply));
    await penny.approve(router.address, t(penny_supply));

    await router.addLiquidityETH(
      usd.address,
      t(500),
      t(500),
      t(1),
      LPprovider.address,
      deadlineTime,
      { value: t(1) }
    );

    await router.addLiquidityETH(
      penny.address,
      t(50000000),
      t(50000000),
      t(100),
      LPprovider.address,
      deadlineTime,
      { value: t(100) }
    );

    const usdbnbpair = await factory.getPair(weth.address, usd.address);
    const pennybnbpair = await factory.getPair(penny.address, weth.address);

    const bnbprice = await usd.getPrice(usdbnbpair, 1);
    const pennybnbprice = await usd.getPrice(pennybnbpair, 1);
    const pennyusdprice =
      ((bnbprice / Math.pow(10, 18)) * pennybnbprice) / Math.pow(10, 18);

    expect(bnbprice.toString()).to.equal(t(500).toString());
    expect(pennybnbprice.toString()).to.equal("2000000000000");

    console.log(`BNB price is: ${bnbprice / Math.pow(10, 18)}USD`);
    console.log(`Penny price is: ${pennybnbprice / Math.pow(10, 18)}BNB`);
    console.log(`Penny USD price is: ${pennyusdprice}USD`);

    await expect(
      penny.transfer("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0", t(1))
    ).to.be.revertedWith("Should initialise");

    await penny.setPancakePair(pennybnbpair);
    await penny.transfer("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0", t(1));

    await router.swapExactTokensForETH(
      t(1000000),
      0,
      [penny.address, weth.address],
      LPprovider.address,
      deadlineTime
    );

    expect(await penny.pancakePair()).to.equal(pennybnbpair);
    // Feel free to add any different logic
    // expect(maxSupply.toString()).to.equal("1000000000000000000000000000000");
  });
});
