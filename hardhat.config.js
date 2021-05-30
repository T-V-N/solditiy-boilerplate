/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
// require("hardhat-gas-reporter");
require("hardhat-watcher");

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
  watcher: {
    change: {
      tasks: [
        {
          command: "test",
          params: {
            network: "localhost",
          },
        },
      ],
      files: ["./test", "./contracts"],
    },
  },

  gas: 30000000000000000,

  solidity: {
    compilers: [
      { version: "0.5.16" },
      { version: "0.4.18" },
      { version: "0.4.0" },
      { version: "0.6.6" },
      { version: "0.6.0" },
      { version: "0.8.1" },
    ],

    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  defaultNetwork: "localhost",
  // gasReporter: {
  //   coinmarketcap: cmc,
  //   currency: "USDT",
  //   gasPrice: 50,
  // },
  etherscan: {
    apiKey: etherscan,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      blockGasLimit: 99999999999,
    },
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${projectId}`,
    //   accounts: [privkey],
    // },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${projectId}`,
    //   accounts: [privprod],
    //   gasPrice: parseInt(utils.parseUnits("50", "gwei")),
    // },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 5000000000,
      accounts: { mnemonic: mnemonic },
    },
  },
};
