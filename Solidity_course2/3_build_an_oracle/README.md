# Build an Oracle

initialize new project : `npm init -y`
install some dependecies `npm i truffle openzeppelin-solidity loom-js loom-truffle-provider bn.js axios`
We use Truffle to compile and deploy smart contracts to Loom testnet.


The oracle will live in the `oracle` directory: `mkdir oracle && cd oracle && npx truffle init && cd ..`
The caller contract will live in the `caller` directory: `mkdir caller && cd caller && npx truffle init && cd ..`

Directory structure should look like: `tree -L 2 -I node_modules`
.
├── caller
│   ├── contracts
│   ├── migrations
│   ├── test
│   └── truffle-config.js
├── oracle
│   ├── contracts
│   ├── migrations
│   ├── test
│   └── truffle-config.js
└── package.json

## Chapter 2, 3: Calling other contracts

**The caller contract intereacts with the oracle**. To do so, you must provide the following bits of information:
- The address of the oracle smart contract
- The signature of the function you want to call.

Once contract is deployed, there is no way to update it. **contracts are immutable**.
Thus, coding the address of the oracle smart contract in hard in our smart contract is not an option.
Instead you'd want to write a simple function that saves the address of the oracle smart contract in a variable.
Then, it instantiates the oracle smart contract so your contract can call its functions at any time.

For the caller contract to interact with the oracle, you must first define an **interface** that is similar to contracts but only declare functions.
An interface can't:
- define state variables,
- define constructors,
- or inherit from other contracts.
An interface is a sort of an ABI. Since they're used to allow different contracts to interact with each other, all functions must be **external**.
The interface definition must be done in a file specific to this interface.

Through the interface, you can then make a call to external methods defined in the interface.

## Chapter 4: Function Modifiers

There is a security issue until now: **public** functions can be executed by anyone.
Thus anyone can set the oracles address to whatever they want.

Fix: use the **onlyOwner Function Modifier** so that only the owner can execute the function:
- Import the content of the OpenZeppelin's Ownable smart contract.
- Make the contract inherit from Ownable.
- Change the definition of the setOracleInstanceAddress function so that it uses the onlyOwner modifier.
