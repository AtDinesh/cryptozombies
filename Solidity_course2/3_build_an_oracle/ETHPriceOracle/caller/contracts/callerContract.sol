pragma solidity 0.5.0;
import "./EthPriceOracleInterface.sol";
// import openzeppelin's Ownable.sol for onlyOwner modifier
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CallerContract is Ownable {
    // declare the instance variable
    EthPriceOracleInterface private oracleInstance;
    // store the address of the oracle
    address private oracleAddress;
    // keep track of eth price requests
    mapping(uint256=>bool) myRequests;
    // declare a new type of event
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);

    function setOracleInstanceAddress(address _oracleInstanceAddress) public onlyOwner {
        oracleAddress = _oracleInstanceAddress;
        // Instanciate EthPriceOracleInterface
        oracleInstance = EthPriceOracleInterface(oracleAddress);
        // Fire `newOracleAddressEvent` to notify front-end.
        emit newOracleAddressEvent(oracleAddress);
    }

    function updateEthPrice() public {
      uint256 id = oracleInstance.getLatestEthPrice();
      myRequests[id] = true;
      emit ReceivedNewRequestIdEvent(id);
    }
}