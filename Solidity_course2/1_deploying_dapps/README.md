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

