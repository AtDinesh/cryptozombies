pragma solidity >=0.5.0 <0.6.0;

import "./zombiefactory.sol";

// define an interface with the CryptoKitties contract.
contract KittyInterface {
    function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
);

contract ZombieFeeding is ZombieFactory {

    KittyInterface kittyContract;

    modifier ownerOf(uint _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId]);
        _;
    }

    function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
    }

    function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
    }
  
    function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return(_zombie.readyTime <= now);
    }

    // Make it internal: we don't want the user to call the function with any Dna
    function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal ownerOf(_zombieId) {
        // Make sure the user owns the zombie
        Zombie storage myZombie = zombies[_zombieId];
        require(_isReady(myZombie));

        // make sure _targetDna only has 16 figures
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;

        // add bonus kitty genes
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
        newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        _triggerCooldown(myZombie);
    }

    function feedOnKitty (uint _zombieId, uint _kittyId) public {
    
        // only interested in the Dna
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
    }
}