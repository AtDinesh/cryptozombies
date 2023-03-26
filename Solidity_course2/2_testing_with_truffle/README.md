# Testing with Truffle

Folder architecture:
```
├── build
  ├── contracts
      ├── Migrations.json
      ├── CryptoZombies.json
      ├── erc721.json
      ├── ownable.json
      ├── safemath.json
      ├── zombieattack.json
      ├── zombiefactory.json
      ├── zombiefeeding.json
      ├── zombiehelper.json
      ├── zombieownership.json
├── contracts
  ├── Migrations.sol
  ├── CryptoZombies.sol
  ├── erc721.sol
  ├── ownable.sol
  ├── safemath.sol
  ├── zombieattack.sol
  ├── zombiefactory.sol
  ├── zombiefeeding.sol
  ├── zombiehelper.sol
  ├── zombieownership.sol
├── migrations
└── test
. package-lock.json
. truffle-config.js
. truffle.js
```

Truffle provides support for tests written in JavaScript and Solidity.

## Chapter 2: Getting Set Up

1. Every time you start writing a new test suite, first load the build artifacts of the contract you want to interact with. This way, Truffle will know how to format our function calls in a way the contract will understand.
Example with a contract named `CryptoZombies`: `const CryptoZombies = artifacts.require("CryptoZombies");`
This returns a **contract abstraction** which hides the complexity of interacting with Ethereum and provides a convenient javaScript interface to Solidity smart contracts.

### The `contract()` function
Truffle adds a thin wrapper around [Mocha](https://mochajs.org/) in order to make testing simpler. 
- **group tests** by calling a function named `contract()`. It extends Mocha's `describe()` by providing a list of accounts for testing and doing some cleanup as well.
  - `contract()` takes two arguments. The first one, a string, must indicate what we’re going to test. The second parameter, a callback, is where we’re going to actually write our tests.
- **execute them**: the way we’ll be doing this is by calling a function named `it()` which also takes two arguments: a string that describes what the test actually does and a callback.

Example:
```
 contract("MyAwesomeContract", (accounts) => {
   it("should be able to receive Ethers", () => {
   })
 })
```

## Chapter 3, 4, 5 : First test - creating a new zombie
[Ganache](https://truffleframework.com/ganache) sets up a local Ethereum network.
Since Ganache and Truffle are tightly integrated we can access these accounts through the accounts array .

In the `it()` function, the second parameter is the callback function which is asynchronous (`async` keyword).

**Test Set Up**
 In order to actually interact with our smart contract, we have to create a JavaScript object that will act as an instance of the contract. 
 Ex: `const contractInstance = await CryptoZombies.new();`

**Act**
One of the features of Truffle is that it wraps the original Solidity implementation and lets us specify the address that makes the function call by passing that address as an argument.
This is useful to check ownership.

*Log and events*
Once we specified the contract we wanted to test using `artifacts.require`, Truffle automatically provides the logs generated by our smart contract. 
Let's say `result` is the return of a function called. it will then contain the logs (`result.logs[0].`)
- `result.tx`: transaction hash
- `result.receipt`: object containing the transaction receipt.

Note that logs can also be used as a much cheaper option to store data. The downside is that they can't be accessed from within the smart contract itself.

**Assert**
There are built-in assertion modules coming with functions such as `equal()` or `deepEqual()`.

## Chapter 6, 7: Hooks

One of Mocha's (and Truffle's) features is the ability to have some snippets of code called hooks run before or after a test. To run something before a test gets executed, the code should be put inside a function named `beforeEach()`.
```
beforeEach(async () => {
  // let's put here the code that creates a new contract instance
});
```

When making sure that some behavior are not possible and that you encounter an error, use `try/catch` blocks.
example: 
```
try {
    //try to create the second zombie
    await contractInstance.createRandomZombie(zombieNames[1], {from: alice});
    assert(true);
  }
  catch (err) {
    return;
  }
assert(false, "The contract did not throw.");
```

## Chapter 8: Zombie Transfers (2 ways with ERC721) - groups of tests

ERC721 specification has 2 different ways to transfer tokens:
- Alice calls `transferFrom` with her address as the `_from` parameter, Bob’s address as the `_to` parameter, and the `zombieId` she wants to transfer.
- Alice first calls `approve` Bob’s address and the `zombieId`. The contract then stores that Bob is approved to take the zombie. Next, when Alice or Bob calls `transferFrom`, the contract checks if that `msg.sender` is equal to Alice’s or Bob’s address. If so, it transfers the zombie to Bob.

To group tests, Truffle provides a function called `context`.
```
context("with the single-step transfer scenario", async () => {
    it("should transfer a zombie", async () => {
      // TODO: Test the single-step transfer scenario.
    })
})

context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
      // TODO: Test the two-step scenario.  The approved address calls transferFrom
    })
    it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
        // TODO: Test the two-step scenario.  The owner calls transferFrom
     })
})
```

*note*: 
If we place an `x` in front of the `context()` functions as follows: `xcontext()`, Truffle will skip those tests.
`x` can be placed in front of an `it()` function as well. 