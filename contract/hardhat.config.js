require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const private_key = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "testnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      chainId: 280,
      gasPrice: 20000000000,
      accounts: {mnemonic: private_key}
    },
    mainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: private_key}
    }
  },

};
