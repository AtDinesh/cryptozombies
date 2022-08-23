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
