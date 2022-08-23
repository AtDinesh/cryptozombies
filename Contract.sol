pragma solidity ^0.4.19;

contract ZombieFactory{
    
    // event: tell the front-end that something happened
    event NewZombie(uint zombieId, string name, uint dna);
    /*
    javascript implementation example (front-end waiting for the event)
    ZombieFactory.NewZombie(function(error, dna) {
        // do something
    }
    */

    // state variables are stored permanently in the blockchain.
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Zombie {
        string name;
        uint dna;
    }

    // this is a dynamic array to store an army of zombies.
    // public --> solidity automatically creates a getter (read-only)
    Zombie[] public zombies;

    // functions are public by default
    // function _createZombie(string _name, uint _dna) : public version with no return
    // if no state is modified, the function must be declared as "view"
    // if it uses no data from the app, the function must be "pure"
    function _createZombie(string _name, uint _dna) private {
        // array.push returns the new length of the array
        uint id = zombies.push(Zombie(_name, _dna)) - 1; // add a zombie to the dynamic array
        NewZombie(id, _name, _dna);
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        // keccak256 is a hash function (like SHA3)
        // used here to generate random numbers although it is not secure to do so.
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    function createRandomZombie(string _name) public {
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
    }
}
