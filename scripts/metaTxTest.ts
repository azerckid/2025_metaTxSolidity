import { ethers } from "hardhat";

// Define the ForwardRequest type inline
interface ForwardRequest {
    from: string;
    to: string;
    value: bigint;
    gas: bigint;
    nonce: bigint;
    data: string;
}

async function main() {
    const forwarderAddress = "0x06e698E439701dd6ed543E3f715cB8f0978d07e7";
    const textStorageAddress = "0xF38333e5DA5469FD497e27F504A620D96615D967";

    // Create a random user wallet for testing
    const userWallet = ethers.Wallet.createRandom().connect(ethers.provider);
    console.log("User wallet address:", userWallet.address);

    // Fund the user wallet with some ETH for gas
    const [relayer] = await ethers.getSigners();
    console.log("Relayer address:", relayer.address);

    // Send some ETH to the user wallet
    const tx = await relayer.sendTransaction({
        to: userWallet.address,
        value: ethers.parseEther("0.01")
    });
    await tx.wait();
    console.log("Funded user wallet with 0.01 ETH");

    // Get contract instances
    const forwarder = await ethers.getContractAt("MinimalForwarder", forwarderAddress);
    const textStorage = await ethers.getContractAt("TextStorage", textStorageAddress);

    // Prepare the function data for storeText
    const text = "Hello from meta transaction!";
    const functionData = textStorage.interface.encodeFunctionData("storeText", [text]);

    // Get the nonce for the user
    const nonce = await forwarder.getNonce(userWallet.address);

    // Prepare the forward request
    const request: ForwardRequest = {
        from: userWallet.address,
        to: textStorageAddress,
        value: 0n,
        gas: 1000000n,
        nonce: nonce,
        data: functionData,
    };

    // Custom JSON replacer to handle BigInt
    const replacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    };

    // Debug logs with proper BigInt handling
    console.log("Request:", JSON.stringify(request, replacer, 2));

    // Create the message hash exactly as the contract does
    const messageHash = ethers.keccak256(
        ethers.concat([
            ethers.getBytes(request.from),
            ethers.getBytes(request.to),
            ethers.zeroPadValue(ethers.toBeHex(request.value), 32),
            ethers.zeroPadValue(ethers.toBeHex(request.gas), 32),
            ethers.zeroPadValue(ethers.toBeHex(request.nonce), 32),
            ethers.getBytes(ethers.keccak256(request.data))
        ])
    );

    // Sign the hash directly with the private key
    const messageHashBytes = ethers.getBytes(messageHash);
    const signature = await userWallet.signingKey.sign(messageHashBytes);
    const signatureHex = ethers.concat([signature.r, signature.s, new Uint8Array([signature.v])]);

    console.log("Message Hash:", messageHash);
    console.log("Signature:", ethers.hexlify(signatureHex));

    // Execute the meta-transaction
    const executeTx = await forwarder.execute(request, signatureHex);
    const receipt = await executeTx.wait();
    if (!receipt) {
        throw new Error("Transaction failed");
    }
    console.log("Meta-transaction executed successfully!");
    console.log("Transaction hash:", receipt.hash);

    // Wait for a few seconds to ensure the transaction is mined
    console.log("Waiting for transaction to be mined...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get the event logs
    const filter = textStorage.filters.TextStored(userWallet.address);
    const events = await textStorage.queryFilter(filter);
    console.log("Events:", events);

    // Try to read the stored text
    try {
        const storedText = await textStorage.texts(userWallet.address, 0);
        console.log("Stored text:", storedText);
    } catch (error) {
        console.error("Failed to read stored text:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 