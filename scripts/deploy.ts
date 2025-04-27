import { ethers } from "hardhat";

async function main() {
    // 1. MinimalForwarder 배포
    const MinimalForwarder = await ethers.getContractFactory("MinimalForwarder");
    const forwarder = await MinimalForwarder.deploy();
    await forwarder.waitForDeployment();
    console.log("MinimalForwarder deployed to:", await forwarder.getAddress());

    // 2. TextStorage 배포 (forwarder 주소 전달)
    const TextStorage = await ethers.getContractFactory("TextStorage");
    const textStorage = await TextStorage.deploy(await forwarder.getAddress());
    await textStorage.waitForDeployment();
    console.log("TextStorage deployed to:", await textStorage.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 