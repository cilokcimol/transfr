# Transfr Escrow Protocol

Transfr is a decentralized escrow protocol created to send testnet ETH to any email address securely. The recipient does not need an active web3 wallet to receive the transfer. Funds remain locked in a secure smart contract on Ethereum Sepolia and are claimed using a unique four digit PIN.

## Core Features

* Zero Friction: Recipients do not need a pre existing cryptocurrency wallet to receive testnet funds.
* Secure Escrows: Smart contracts securely lock transfer amounts until they are claimed by the rightful recipient.
* Four Digit PIN: Security is enhanced by a secure passcode shared privately between sender and recipient.
* Fluid Visuals: A modern user interface featuring responsive glassmorphism styles and scroll cascades.
* Wallet Integration: Easy wallet connection with direct RPC network configuration for standard providers.

## Tech Stack

* Core: HTML5 / JavaScript / Next.js
* Smart Contracts: Solidity / Hardhat / Sepolia Network
* Background Dynamics: High performance interactive HTML5 Canvas
* Styling: Vanilla CSS custom classes

## Local Installation

To build and run this application locally, perform the following steps:

1. Clone the repository to your local drive.
2. Install the necessary package dependencies:
   ```bash
   npm install
   ```
3. Launch the local development server:
   ```bash
   npm run dev
   ```
4. Access the application in your web browser:
   ```
   http://localhost:3000
   ```

## Escrow Contract Workflow

1. Sender connects their EVM wallet on Sepolia network.
2. Sender inputs the recipient email address, the desired ETH transfer amount, and specifies a secure four digit PIN.
3. Sender deposits the testnet ETH into the secure smart contract.
4. Recipient receives a notification link.
5. Recipient inputs the correct PIN to claim the funds directly to their wallet.
