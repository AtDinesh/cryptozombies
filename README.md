# cryptozombies

## Chapter 2: Mapping and addresses
The Ethereum blockchain is made of accounts which have Ethers. Each account has an address.
An address belongs to an unique user (or a smart contract).
You can therefore use the adress as an ID.

### Mappings

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
