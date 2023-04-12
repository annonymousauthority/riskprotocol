const hre = require("hardhat");

async function main() {
  const RiskProtocol = await hre.ethers.getContractFactory("RiskProtocol");
  const riskProtocol = await RiskProtocol.deploy(1000, 50);

  await riskProtocol.deployed();

  console.log("Risk Token deployed: ", riskProtocol.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
