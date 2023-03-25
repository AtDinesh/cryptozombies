# Chainlink: Decentralized Oracles

Blockchain Oracles are devices that connect our smart contracts and zombies with data and computation from the real world, such as pricing data on currencies, random number generators, and any other data we can think of. Blockchains can't interact with the outside world, as they are intentionally isolated and deterministic by nature. When your smart contracts include data or computation from oracles, they are considered hybrid smart contracts.

## Chapter 1: Chainlink Data Feeds Introduction
                                                                                                                                                                                                                   A smart contract can't directly access data from outside the world. It needs to get the data from both a *decentralized oracle network (DON)* and *decentralized data sources*.
Chainlink is a framework for DONs, ahnd a way to gete data from multiple sources accross multiple oracles. The *price feed* or *data feed* is the data placed on then blockchain (in a smart contract) by the DON.
Chainlink is constantly updating data for us to read from a contract.

The Chainlink network uses a system called Off-Chain Reporting to reach a consensus on data off-chain, and report the data in a cryptographically proven single transaction back on-chain for users to digest.

## Chapter 2: Importing from NPM and Github

To communicate with another contract, we need the interface / ABI of this other contract. But what is the interface of a Chainlink Data Feed contract ?

### Importing from NPM / Github
Big idea: import code from outside the contract !
Ex: import `AggregatorV3Interface` from Chainlink github repository that will include all function needed to interact with Chainlink Data Feed.

The import can be performed directly from Github or from NPM packages. The framework that is used will determine the import method.

## Chapter 3: `AggregatorV3Interface`

We have the interface. Now we need the address of the fed contract. Where ?
- The on-chain [Feeds registry](https://docs.chain.link/docs/feed-registry/)
- The list of all [contract addresses](https://docs.chain.link/docs/reference-contracts/)

## Chapter 4: Working with Tuples

In the priceFeed contract, the function `latestRoundData` gives many information (ex: `answer` for current price, `roundId` for unique round ID of the price, ...)
### Tuples
reminder: A `tuple` is a way in Solidity to create a syntactic grouping of expressions.
n order to assign variables to each return variable, just use the tuple syntax by grouping a list of variables in parentheses.
If you're interested only on some of the returns, leave the others as blank:
`(,int price,,,) = priceFeed.latestRoundData();`

## Chapter 5: Chainlink Data Feeds Decimals
Warning: Decimals don't work well in Solidity. The function could for example return `310523971888` when the actual price is `$3,105.52`.
The `decimals` function tells us where the decimal place goes.

## Chapter 6: Chainlink Data Feeds References
It is possible to setup a DON to gather any data you are looking for.
Some links:
[Chainlink documentation basic tutorial](https://docs.chain.link/docs/beginners-tutorial/)
[Truffle Starter Kit](https://github.com/smartcontractkit/truffle-starter-kit)
[Hardhat Starter Kit](https://github.com/smartcontractkit/hardhat-starter-kit)
[Brownie Starter Kit - Chainlink Mix](https://github.com/smartcontractkit/chainlink-mix)