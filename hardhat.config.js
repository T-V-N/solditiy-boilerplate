/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

const { utils } = require("ethers");
const {
  cmc,
  projectId,
  privkey,
  privprod,
  etherscan,
  mnemonic,
} = require("./secrets.json");

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
  gasReporter: {
    coinmarketcap: cmc,
    currency: "USDT",
    gasPrice: 50,
  },
  etherscan: {
    apiKey: etherscan,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    ropsten: {
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [privkey],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [privprod],
      gasPrice: parseInt(utils.parseUnits("50", "gwei")),
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 5000000000,
      accounts: { mnemonic: mnemonic },
    },
  },
};
