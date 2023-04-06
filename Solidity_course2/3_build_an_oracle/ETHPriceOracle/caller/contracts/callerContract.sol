pragma solidity 0.5.0;
import "./EthPriceOracleInterface.sol";
// import openzeppelin's Ownable.sol for onlyOwner modifier
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CallerContract is Ownable {
    // declare the instance variable
    EthPriceOracleInterface private oracleInstance;
    // store the address of the oracle
    address private oracleAddress;
    // declate a new type of event
    event newOracleAddressEvent(address oracleAddress);

    function setOracleInstanceAddress(address _oracleInstanceAddress) public onlyOwner {
        oracleAddress = _oracleInstanceAddress;
        // Instanciate EthPriceOracleInterface
        oracleInstance = EthPriceOracleInterface(oracleAddress);
        // Fire `newOracleAddressEvent` to notify front-end.
        emit newOracleAddressEvent(oracleAddress);
    }
}