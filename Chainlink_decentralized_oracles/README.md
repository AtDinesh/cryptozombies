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

## Chapter 7: Chainlink VRF Introduction

### The pseudo-random DNA
`keccak256` based randomness in only pseudo-random, which is problematic. **Everything that is part of the on-chain mechanism is deterministic by design**, including the hashing function.

Naive fix: use globally available variables (`msg.sender`, `block.difficulty`, `block.timestamp`, ...):
`uint(keccak256(abi.encodePacked(msg.sender, block.difficulty, block.timestamp)));`
But even these variables are somehow predictable...

Another solution: use the secure randomness of the [Chainlink Verifiable Randomness Function - Chainlink VRF](https://docs.chain.link/docs/get-a-random-number/).

### Chainlink VRF
#### Basic Request Model
[Basic request model](https://docs.chain.link/docs/architecture-request-model/).


1. Callee contract makes a request in a transaction
    1. Callee contract or oracle contract emits an event
2. Chainlink node (Off-chain) is listening for the event, where the details of the request are logged in the event
3. In a second transaction created by the Chainlink node, it returns the data on-chain by calling a function described by the callee contract
4. In the case of the Chainlink VRF, a randomness proof is done to ensure the number is truly random

working with oracles require to pay gas in LINK token. Whenever we make a request following the basic request model, our contracts must be funded with a set amount of LINK, as defined by the specific oracle service that we are using (each service has different oracle gas fees).

### In practice
- pull the Chainlink VRF contract code froù NPM / Github
- Inherit the functionality of the VRFConsumerbase contract code into outs to emit event
- Define chat functions that Chainlink node is going to callback / respond to.

## Chapter 8: Constructor in a constructor

`VRFConsumerbase` contract includes all the code we need to send a request to a Chainlink oracle.

Few variables are required to interact with a Chainlink node:
- The address of the Chainlink token contract. This is needed so our contract can tell if we have enough LINK tokens to pay for the gas.
- The VRF coordinator contract address. This is needed to verify that the number we get is actually random.
- The Chainlink node keyhash. This is used identify which Chainlink node we want to work with.
- The Chainlink node fee. This represents the fee (gas) the Chainlink will charge us, expressed in LINK tokens.

More info: [Chainlink VRF Contract addresses documentation page](https://docs.chain.link/docs/vrf-contracts/).

How to implement a constructor of an inherited contract? Answer: constructor in a constructor:

```
import "./Y.sol";
contract X is Y {
    constructor() Y() public{
    }
}
```

## Chapter 9: Define our Chainlink VRF variables
- define keyHash and fee in the constructor
- craete a global variable that will store the most recent return of a Chainlink VRF.

## Chapter 10: The requestRandomness and fulfillRandomness functions

As the Chainlink VRF follows the basic request model, we need:
1. A function to request the random number
2. A function for the Chainlink node to return the random number to.

1. **requestRandomness**
   1. checks to see that our contract has LINK tokens to pay a Chainlink node
   2. sends some LINK tokens to the Chainlink node
   3. Emits an event that the Chainlink node is looking for
   4.     Assigns a requestId to our request for a random number on-chain
2. **fulfillRandomness**
   1. calls a function on the VRF Coordinator and includes a random number
   2. checks to see if the number is random
   3. returns the random number the Chainlink node created, along with the original requestID from our request

More about Chaiçnlink and the random numbers in the [Random Number Tutorial](https://docs.chain.link/docs/intermediates-tutorial/)