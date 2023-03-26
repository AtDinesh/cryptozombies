# Deplying DApps with Truffle
## Chapter 1: Introduction

### Truffle
Truffle is the most popular blockchain development framework:
- easy smart contract compilation
- automated ABI generation
- integrated smart contract testing - there's even support for Mocha and Chai!
- support for multiple networks - code can be deployed to Rinkeby, Ethereum or even to Loom.

Install Truffle in the working directory and make it available globally:
`npm install truffle -g`

## Chapter 2: Getting started with Truffle
Run `truffle init` to initialize a new project:

├── contracts
    ├── Migrations.sol
├── migrations
    ├── 1_initial_migration.js
└── test
truffle-config.js
truffle.js

- **migrations**: a migration is a JavaScript file that tells Truffle how to deploy a smart contract.
- **truffle.js** and **truffle-config.js**: config files used to store the network settings for deployment. Truffle needs two config files because on Windows having both truffle.js and truffle.exe in the same folder might generate conflicts. Long story short - if you are running Windows, it is advised to delete truffle.js and use truffle-config.js as the default config file. 

### truffle-hdwallet-provider
We ues **infura** to deploy code to Ethereum. 
Infura does not manage private keys: it can't sign transactions. For this we use `truffle-hdwallet-provider`.
`npm install truffle-hdwallet-provider`

## Chapter 3: Compiling the Source code
### CryptoZombies - The Game

Executing `truffle compile` will create the build artifacts and place them in `./build/contracts`.

## Chapter 4: Migrations
You can test smart contracts locally using **Ganache**, which sets up a local Ethereum network.
Deploying to Ethereum requires a **migration**.
`truffle init` created a special contract called Migrations.sol that keeps track of the changes you're making to your code. The way it works is that the history of changes is saved onchain.

### Creating a New Migration
`truffle init` created a file `./contracts/1_initial_migration.js` that exports a function that accepts a `deployer`.
The deployer acts as an interface between the developer and Truffle's deployment engine.

## Chapter 5: Configuration Files
Before deploying, we need to edit the configuration file to tell Truffle the networks to deploy to.
`truffle.js` configuration file is just an empty shell that needs to be updated for deploying.

Edit the configuration file to use `HDWalletProvider`:
`const HDWalletProvider = require("truffle-hdwallet-provider");`
Create a new variable to store the mnemonic:
const mnemonic = "onions carrots beans powder curry fire light sky";

Warning: do not store secrets like a mnemonic or a private key in a configuration file (it is pushed in the repo..)

## Chapter 6: Deploying Our Smart Contract
A migration is a JavaScript file that tells Truffle how to modify the state of our smart contracts.
The first migration will just deploy the smart contract. Some other migrations deploy a new version of the code to add features or fix bugs.
A separate migration file must be created for each contract. Migrations are always executed in order- 1,2,3, etc.

To deploy: `truffle migrate --network rinkeby`

## Chapter 7: Use Truffle with Loom!
On Loom, your users can have much speedier and gas-free transactions, making it a much better fit for games and other non-financial applications.

**loom-truffle-provider**: The `provider` lets Truffle deploy to Loom just like it deploys to Rinkeby or Ethereum main net. It works like a bridge that makes Web3 calls compatible with Loom. 
`npm install loom-truffle-provider`

## Chapter 8: Deploy to Loom Testnet
1. Create our own Loom private key. The easiest way to do it is by downloading and installing Loom according to this [tutorial](https://loomx.io/developers/en/basic-install-all.html).
```
$./loom genkey -a public_key -k private_key
local address: 0x42F401139048AB106c9e25DCae0Cf4b1Df985c39
local address base64: QvQBE5BIqxBsniXcrgz0sd+YXDk=
$cat private_key
/i0Qi8e/E+kVEIJLRPV5HJgn0sQBVi88EQw/Mq4ePFD1JGV1Nm14dA446BsPe3ajte3t/tpj7HaHDL84+Ce4Dg==
```

2. Update truffle.js (initialize `loom-truffle-provider`).
3. Let Truffle know how to deploy on Loom testnet (add new network in truffle.js)
4. deploy to Loom testnet: `truffle migrate --network loom_testnet`

## Chapter 10: Derploy to Basechain
Before deploying to mainnet (Basechain):
1. Create a new private key
```
./loom genkey -a mainnet_public_key -k mainnet_private_key
local address: 0x07419790A773Cc6a2840f1c092240922B61eC778
local address base64: B0GXkKdzzGooQPHAkiQJIrYex3g=
```

Add `mainnet_privatye_key` file to .gitignore to avoid pushing it.

2. Securely pass the private key to Truffle.
   - edit `truffle.js` so that Truffle reads the private key from the file

```
// some imports
const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
  const privateKey = readFileSync(privateKeyPath, 'utf-8');
  return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
}
```

3. Tell Truffle how to deploy to Basechain by adding a new object to the `truffle.js` config file.
4. Whitelist your deployment keys
Documentation is [here](https://loomx.io/developers/en/deploy-loom-mainnet.html)
5. wrap everything up by deploying the smart contract

