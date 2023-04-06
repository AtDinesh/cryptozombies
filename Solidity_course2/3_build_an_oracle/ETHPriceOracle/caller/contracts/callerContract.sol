pragma solidity 0.5.0;
import "./EthPriceOracleInterface.sol";
// import openzeppelin's Ownable.sol for onlyOwner modifier
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CallerContract is Ownable {
    // store the ethPrice
    uint256 private ethPrice;
    // declare the instance variable
    EthPriceOracleInterface private oracleInstance;
    // store the address of the oracle
    address private oracleAddress;
    // keep track of eth price requests
    mapping(uint256=>bool) myRequests;
    // declare a new type of event
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    event PriceUpdatedEvent(uint256 ethPrice, uint256 id);

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

    // this callback function is called by the oracle.
    function callback(uint256 _ethPrice, uint256 _id) public onlyOracle {
        // require myRequests[_id] == true
        require(myRequests[_id], "This request is not in my pending list.");
        ethPrice = _ethPrice;
        delete myRequests[_id];
        emit PriceUpdatedEvent(_ethPrice, _id);
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "You are not authorized to call this function.");
        _;
    }
}