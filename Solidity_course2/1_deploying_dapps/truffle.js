const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

// Initialize HDWalletProvider
const HDWalletProvider = require("truffle-hdwallet-provider");
const LoomTruffleProvider = require('loom-truffle-provider');

function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
  const privateKey = readFileSync(privateKeyPath, 'utf-8');
  return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
}

// 1. Initialize LoomTruffleProvider
const LoomTruffleProvider = require('loom-truffle-provider');
// Set your own mnemonic here
const mnemonic = "onions carrots beans powder curry fire light sky";

// Module exports to make this configuration available to Truffle itself
module.exports = {
  // Object with configuration for each network
  networks: {
    //development
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      gas: 9500000
    },
    // Configuration for mainnet
    mainnet: {
      provider: function () {
        // Setting the provider with the Infura Rinkeby address and Token
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/YOUR_TOKEN")
      },
      network_id: "1"
    },
    // Configuration for rinkeby network
    rinkeby: {
      // Special function to setup the provider
      provider: function () {
        // Setting the provider with the Infura Rinkeby address and Token
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/YOUR_TOKEN")
      },
      // Network id is 4 for Rinkeby
      network_id: 4
    },
    
  // 2. Put here the configuration for loom_dapp_chain
    loom_testnet: {
      provider: function() {
        const privateKey = 'YOUR_PRIVATE_KEY'
        const chainId = 'extdev-plasma-us1';
        const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
        const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';
        // create the loom truffle provider (wallet)
        const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
        // create some accounts in the provider
        loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
        return loomTruffleProvider;
        },
      network_id: '9545242630824'
    },
    basechain: {
      provider: function() {
        const chainId = 'default';
        const writeUrl = 'http://basechain.dappchains.com/rpc';
        const readUrl = 'http://basechain.dappchains.com/query';
        const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
        const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
        return loomTruffleProvider;
        },
      network_id: '*'
    }

  }
};
