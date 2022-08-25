# cryptozombies

## Course 2
### Chapter 2: Mapping and addresses
The Ethereum blockchain is made of accounts which have Ethers. Each account has an address.
An address belongs to an unique user (or a smart contract).
You can therefore use the adress as an ID.

#### Mappings

mapping(_KeyType => _ValueType)

_KeyType − can be any built-in types plus bytes and string. No reference type or complex objects are allowed.
_ValueType − can be any type.

Examples: 
```
// store the amount of ETH in an address
mapping (address => uint) public accountBalance;
// cana lso be used to search for the name of a user with an ID.
mapping (uint => string) userIdToName;
```

### Chapter 3: Msg.sender

**msg.sender** is a global variable standing for the address of the user (or the smart contract) that called the current function.
note: there will always be a **msg.sender** since executing a functions needs a call.

Naive example to update a mapping:
```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // update the mapping `favoriteNumber` to store `_myNumber` in `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
}

function whatIsMyNumber() public view returns (uint) {
  // get the value stored at the address of the sender
  // it will be 0 if the sender did not yet call `setMyNumber`
  return favoriteNumber[msg.sender];
}
```

The use of **msg.sender** adds security to the ethereum blockchain. The only way to modify one other's data would be to steal its private key.

### Chapter 4: Require (Exige)

**require** is a way to stop the function and send an error if some conditions are met.

### Chapter 5: Inheritance

Inheritance makes contract easier to organize.

```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```

### Chapter 6: Storage vs memory

In solidity there are 2 places to store data: the **storage** and the **memory**.
- **storage** is used for variables stored permanently in the blockchain.
- variables in **memory** are temporary and deleted from one function call to another outside of the contract.

State variables declared outside of functions are in **storage** by default while variables declared inside functions are stored in the **memory**.
However, there are some cases where you might need to specify **storage** or **memory**: 

```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    Sandwich storage mySandwich = sandwiches[_index];
    // ...`mySandwich` is a pointer to `sandwiches[_index]` in the `storage`
    mySandwich.status = "Eaten!";
    // ... will definitely change `sandwiches[_index]` in the blockchain.

    // If you want a copy, use `memory`:
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...`anotherSandwich` is a copy of the data in the `memory`
    anotherSandwich.status = "Eaten!";
    // ... will only change the temporary variable
    sandwiches[_index + 1] = anotherSandwich;
    // ...will copy the changes in the blockchain storage.
  }
}
```

### Chapter 9: function visibility

There is more than **public** and **private** in Solidity: **external** and **internal**.

- **public** - all can access
- **external** - Cannot be accessed internally, only externally
- **internal** - only this contract and contracts deriving from it can access
- **private** - can be accessed only from this contract

As you can notice **private** is a subset of **internal** and **external** is a subset of **public**.

### Chapter 10: Interact with another contract (interface)

In order to interact with another contract we do not own in the blockchain, we need to define an **interface**.

Here is a simple example with a contract where anyone can store a lucky number.
```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```

For an external contract to read these data using the `getNum` function, we first need to define an interface of the LuckyNumber contract.
```
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}
```
Note: 
- only the functions we would like to interact with are defined.
- there is no body
- we can only interact with public and external functions.

This interface will let our contract know the function of the other contract, how to call it and what return to expect.
Here is how this interface can be used in a contract:

```
contract MyContract {
  address NumberInterfaceAddress = 0xab38...
  // Address of the FavoriteNumber contract on Ethereum
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress)
  // `numberContract` now points to the other contract

  function someFunction() public {
    // we can now call `getNum` from the contract :
    uint num = numberContract.getNum(msg.sender);
  }
}
```

## Course 3: Solidity advanced concepts

### Chapter 1: Immutability of the contracts

Once an Ethereum contract is deployed, it is immutable (can never be changed or updated).
This means that if there is an issues in the code of the contract, there is no way to patch it. The users will have to use another contract that is fixed.

#### External dependency
The CryptoKitties contract is initially hard-coded. What if it has a bug ? We would not be able to change the contract to fix this.
Thus it is useful to have functions that let us update some key parts of the DApp.

However, setting such a function to **external** would be an issue since anyone would be able to change the address of the CyrptoKitties contract.
To deal with such issue, we need to make the contracts **ownable**.

### Chapter 2: Contracts with owner.
#### The OpenZeppelin ownable contract

The owner of a contract has special privileges.
Below, the **Ownable** contract from OpenZeppelin.

```
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```
- `function Ownable()` is a constructor
- `modifier` function let you modify other functions (often used to check conditions before execution).

### Chapter 3: onlyOwner modifier function

`modifier` functions cannot be called directly. You need to add the name of the modifier at the end of the definition 
of a function to change the way the function works.

Example: 

```
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```
And use it this way
```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // `onlyOwner` here added at the end of the definition
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```

`modifier` function are often used to easily add a `require` before the execution.

### Chapter 4: Gaz

User need to pay gaz at each function execution in the DApp. Gaz is bought with Ether.
The gaz cost depends on the complexity of the function (computational ressources required to execute the function).

Note: Things work slightly differently on sidechains.

Solidity reserves 256 bits of storage whatever the size of the `uint`. Meaning that using `uint8` instead of `uint` does not make you save gaz.
Except for `struct`. Using `struct` with smaller `uint` lets you save memory for the total storage by concatenation.
Grouping the same data types inside a `struct` allows Solidity to minimize the required storage.
Example: `uint c; uint32 a; uint32 b;` is cheaper than `uint32 a; uint c; uint32 b;`

`view` functions do no cost gaz when called externally because they do not change anything in the blockchain.
However, when called internally by a non-`view` function, it will cost gaz. (the non-view function creates a transaction).

Gaz optimization is a big topic in solidity and can lead to some coding logic that may not seem effective
(such as rebuild an array in the memory when needed instead of saving in the storage).

### Chapter 5: Time unit

`now` returns the current time (`uint256` by default) in unix (elapsed seconds since 01/01/1970).
Solidity also supports `seconds`, `minutes`, `hours`, `days` and `years`.

### Chapter 6: pass storage pointer

You can pass the storage pointer of a struct as argument of a `private` or `internal` function.
This way, we can pass a reference of a zombie instead of giving the ID and searching it.
```
function _doStuff(Zombie storage _zombie) internal {
  // do stuff
}
```

### Chapter 8: `modifier` functions with args

`modifier` functions can be passed some args.

```
// store the age of a user
mapping (uint => uint) public age;

// modifier requires the user to be older than some age
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

function driveCar(uint _userId) public olderThan(16, _userId) {
  // do stuff
}
```

Note: The `modifier` calls the rest of the function with `_;`.

### Chapter 11 : Declare array in the memory

Syntax example: 

```
function getArray() external pure returns(uint[]) {
  // create a new array of lenght 3 in the memory
  uint[] memory values = new uint[](3);
  // push values
  values.push(1);
  values.push(2);
  values.push(3);
  // return the array
  return values;
}
```

Why not just store the array in the storage ?
--> Because writting costs money.
If you ever need to delete one entry of the table, you would have to rewrite all following entries in the table and that would cost gaz.

## Course 4: Zombie fight system

### Chapter 1: Payable

We have already seen the function visibility modifiers. (`private, internal, external, public`)
There exist also state modifiers indicating how the function interacts with the BlockChain: 
- `view` indicates that no data will be saved or modified
- `pure` indicates `view` + no data is read on the BlockChain.
`view` and `pure` functions do not cost gaz when called outside of the contract (they do cost if called by another function).

We have also seen `modifier` and their use.

`payable` is another modifier. A `payable` function is a special function that can receive Ethers.

Example: 
```
contract OnlineStore {
  function buySomething() external payable {
    // check that 0.001 ether have been sent:
    require(msg.value == 0.001 ether);
    // then, transfer something to the sender:
    transferThing(msg.sender);
  }
}
```
Someone will be calling this function via the web3.js
```
// supposing that `OnlineStore` points to the Ethereum contract :
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

### Chapter 2: Withdraws

You need to add a function to withdraw the Ether send on the contract's Ethereum account.
Example: 
```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    address payable _owner = address(uint160(owner()));
    _owner.transfer(address(this).balance);
  }
}
```
You cannot transfer Ether to an address unless that address is of type address payable. But the `_owner` variable is of type `uint160`, meaning that we must explicitly cast it to `address payable`.
`address(this).balance` will return the total balance stored on the contract.
You can use `transfer` to send funds to any Ethereum address. 

```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

### Chapter 4: Random number generation via keccak256

The best source of randomness we have in Solidity is the keccak256 hash function.

Example: 
```
// Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
randNonce++;
// take only the last 2 digits
uint random2 = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 100;
```
**This method is vulnerable to attack by a dishonest node**

Generating random numbers safely in Ethereum is a hard problem. Have a look at this [StackOverflow thread](https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract) for some ideas.
One idea would be to use an oracle to access a random number function from outside of the Ethereum blockchain.

## Course 5: ERC721 & Crypto-Collectibles

### Chapter 1: Tokens on Ethereum

#### ERC20 token standard

A token on Ethereum is just a smart contract that that keeps track of who owns how much of that token, and some functions so those users can transfer their tokens to other addresses.
It implements a standard set of functions that all other token contracts share such as
`transferFrom(address _from, address _to, uint256 _tokenId)` and `balanceOf(address _owner)`.

The smart contract has a mapping `mapping(address => uint256) balances` that keeps track of how much balance each address has.

Thus, all ERC20 token share the same set of functions.
If you build an application that is capable of interacting with one ERC20 token, it's also capable of interacting with any ERC20 token. 
You would just need to plug in the new token contract address.

#### Other token standard: ERC721

ERC721 tokens are not interchangeable since each one is assumed to be unique, and are not divisible. You can only trade them in whole units, and each one has a unique ID. 
Here is the ERC721 standard. These is the list of methods we'll need to implement.

```
contract ERC721 {
  event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

  function balanceOf(address _owner) external view returns (uint256);
  function ownerOf(uint256 _tokenId) external view returns (address);
  function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
  function approve(address _approved, uint256 _tokenId) external payable;
}
```

#### Implementing a token contract

- Copy the interface and import it
- Inherit from this ERC721 interface (Solidity supports multi-inheritance)


### Chapter 5: ERC721 Transfer Logic

The ERC721 spec has 2 different ways to transfer tokens:
```
function transferFrom(address _from, address _to, uint256 _tokenId) external payable;
// The token's owner calls transferFrom with his address as the _from parameter
```
and
```
function approve(address _approved, uint256 _tokenId) external payable;

function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

/* The token's owner first calls approve with the address he wants to transfer to, and the _tokenID .
 * The contract stores who is approved to take a token `mapping (uint256 => address)`
 * owner or approved address can call `transferFrom` to execute the transfer 
 */
```

The ERC721 spec includes a Transfer event. An event must e fired at Transfer.