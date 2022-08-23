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
