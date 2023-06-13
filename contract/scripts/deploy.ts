import { ethers } from "hardhat";
import { PathOrFileDescriptor, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const CONTRACT_NAME = "Lock"

async function deployLockContract() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = ethers.utils.parseEther("0.001");

  const Lock = await ethers.getContractFactory(CONTRACT_NAME);
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(
    `${CONTRACT_NAME} with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );

  return lock;
}

function createDirectoryIfNotExists(folderPath: string) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }
}

function copyFileToDestination(sourceFilePath: PathOrFileDescriptor, destinationFolderPath: string, destinationFileName: string) {
  // Read the file from the source folder
  const fileData = readFileSync(sourceFilePath, 'utf8');

  // Specify the destination file path
  const destinationFilePath = path.join(destinationFolderPath, destinationFileName);

  // Write the file to the destination folder
  writeFileSync(destinationFilePath, fileData);

  console.log(`File copied from ${sourceFilePath} to ${destinationFilePath}`);
}

async function main() {
  const lock = await deployLockContract();

  const sourceFilePath = path.join(__dirname, `../artifacts/contracts/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json`);
  const destinationFolderPath = path.join(__dirname, '../../frontend/src/contracts');
  const destinationFileName = `${CONTRACT_NAME}.json`;

  createDirectoryIfNotExists(destinationFolderPath);
  copyFileToDestination(sourceFilePath, destinationFolderPath, destinationFileName);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});