require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepholia: {
      url: process.env.INFURA_SEPHOLIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
