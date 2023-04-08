# Build an Oracle
## Part 1
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

### Chapter 2, 3: Calling other contracts

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

### Chapter 4: Function Modifiers

There is a security issue until now: **public** functions can be executed by anyone.
Thus anyone can set the oracles address to whatever they want.

Fix: use the **onlyOwner Function Modifier** so that only the owner can execute the function:
- Import the content of the OpenZeppelin's Ownable smart contract.
- Make the contract inherit from Ownable.
- Change the definition of the setOracleInstanceAddress function so that it uses the onlyOwner modifier.

### Chapter 5: Using a Mapping to Keep Track of Requests

The front-end can call the `setOracleInstanceAddress()` to set the address of the oracle.

**Updating the ETH price**: Due to its asynchronous nature, there's no way the getLatestEthPrice function can return this bit of information.
Instead, it returns a unique **id** for every request. Then, the oracle goes ahead and fetches the ETH price from the Binance API and executes a callback function exposed by the caller contract. 
Lastly, the callback function updates the ETH price in the caller contract. The caller has no control over when it'll get a response.. it needs tokeep track of requests (using a mapping for example).

example of mapping: `mapping(address => uint) public balances;`
Initially, each value is initialized with the type's default value.
Setting the balance for `msg.sender` to `someNewValue`: `balances[msg.sender] = someNewValue`.

### Chapter 6: the Callback Function

Calling the Binance public API is an asynchronous operation. Thus, the caller smart contract must provide a callback function which the oracle should call at a later time, namely when the ETH price is fetched.
How callback functions work:
1. Make sure that the function can only be called for a valid `id` (use a `require` statement).
2. Remove the `id` from the `myRequests` mapping (`delete myMapping[key]`).
3. Fire an event to let the front-end know that the price was updated.

### Chapter 7: The onlyOracle Modifier

The `onlyOracle` modifier will prevent other contracts from calling the callback.
The modifier should just check that the address calling this function is oracleAddress.
How to know the address taht calls a function? via `msg.sender`.

### Chapters 8 & 9: The `getLatestEthPrice()` Function

The oracle acts as a bridge enabling the caller contracts to access the ETH price feed. It justs implements `getLatestEthPrice` and `setLatestEthPrice`.
To allow the callers to track their requests: 
1. the `getLatestEthPrice` function should compute the request id
2. `id` should be hard to guess for securoty reasons, e.g. a random number.

First approach for generating a random number: using `keccak256`:
```
uint randNonce = 0;
uint modulus = 1000;
uint randomNumber = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % modulus;
```
Note1: the modulus here is used to take only the last 3 digits.
Note2: This approach is not 100% secure, it is more secure to ask an oracle for a random number.

### Chapters 10 & 11: The `setLatestEthPrice()` Function

The JavaScript component of the oracle retrieves the ETH price from the Binance public API and then calls the `setLatestEthPrice`, passing it the following arguments:
- The ETH price,
- The address of the contract that initiated the request
- The id of the request.
We need to make sure that only the owner can call this function.

This function should also call the callback of the oracle contract instance.

## Part 2 - a Basic client

### Chapter 1: Getting Set Up
--> Create the JavaScript component of the oracle that fetches the ETH price from the Binance API + build a basic client.
Reminder: build artifacts are comprised of the bytecode versions of the smart contracts, ABIs, and some internal data Truffle is using to correctly deploy the code.
An ABI describes the interface between two computer programs (how functions can be called and how data is stored in a machine-readable format).

#### Instantating the Oracle Contract
Thanks to the ABI, the application know how to use the functions in the contracts that is instanciated (using `web3.eth.Contract.`):
`const myContract = new web3js.eth.Contract(myContractJSON.abi, myContractJSON.networks[networkId].address)`

The variable `networkId` identifies the network on which the contract is deployed. It must be resolved by calling `web3js.eth.net.getId()` and not hardcoded because it would
require to update the variable every time the contracts is deployed on a different network.

### Chapter 2: Listening for Events
The JavaScript application gets notified through events that are emitted by the contracts.
The app should pick specific events to process.

```
myContract.events.EventName(async (err, event) => {
  if (err) {
    console.error('Error on event', err)
    return
  }
  // Do something
})

```
The above triggers only when an event where `myParam` is equal to 1 gets fired.

### Chapter 3: Adding a Request to the Processing Queue

**You can access an event's return values through the returnValues object**.

Example with `event TransferTokens(address from, address to, uint256 amount)`.

Then we have:
```
async function parseEvent (event) {
  const from = event.returnValues.from
  const to = event.returnValues.to
  const amount = event.returnValues.amount
}
```

### Chapter 4&5: Looping through the processing queue 
Processing the `pendingRequests` array in Node.js could be problematic for a very simple reason: JavaScript is single-threaded.

A technique to solve this problem is to break the array into smaller chunks (up to `MAX_CHUNK_SIZE`), and process these chunks individually. To simplify things, after each chunk, the application will `sleep` for `SLEEP_INTERVAL` milliseconds.

Retrieving elements in the `pendingRequest` array:
In JavaScript, the `shift` method returns the first element of the array, removes the element from the array, and changes the length of the array.

What does the processRequest function do ? It fetches the ETH price, and then calls the oracle smart contract.

### Chapter 6, 7, 8: The Retry Loop + try/catch
Warning when retrieving the ETH price from the Binance public API:
- if there is a network glitch, the request will fail.
  - the caller contract will have to reinitiate the whole process from the beginning

fix: implement a retry mechanism and a condition that breaks the retry loop. This retry mechanism is simply a while loop...

*Note*: JavaScript allows you to write code that executes no matter whether an exception is thrown inside of the try block. These lines of codes should be placed inside of a finally block.

### Chapter 9: Working with Numbers in Ethereum and JavaScript

he Ethereum Virtual Machine doesn't support floating-point numbers.
The workaround is to simply multiply the numbers in your front-end by `10**n`.
Binance API returns 8 decimals. 1 ether is `10**18` wei. So the binance API return will also be multiplied by `10**10` to make sure no money is lost.

The `Number` type in JavaScript is "double-precision 64-bit binary format IEEE 754 value" which supports only 16 decimals...
The `BN.js` library help overcome this issue and it is recommended to use it when dealing with numbers.

How to use `BN.js`? Let's suppose the Binance API returns `169.87000000`.
1. Get rid of the decimal separator: `aNumber = aNumber.replace('.', '')`
2. Convert aNumber to BN: `const aNumber = new BN(aNumber, 10)`, 10 being the base.
