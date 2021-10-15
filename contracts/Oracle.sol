// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Oracle {

  using SafeMath for uint256;


  /**********************************************************************/
  /*                        DATA VARIABLES                             */
  /**********************************************************************/

  address private contractOwner;

  // incremented to add pseudo-randomness at various points
  uint8 private nonce = 0;


  // fee to be paid when registering oracle 
  uint256 public constant REGISTRATION_FEE = 1 ether;

  // number of oracles that must respond for valid status
  uint256 private constant MIN_RESPONSES = 3;

  // status codes returned by oracles
  uint8 private constant ON_TIME = 10;
  uint8 private constant NOT_ON_TIME = 99;

  // track all registered oracles
  mapping(address => uint8[3]) private oracles;

  // model for responses from oracles
  struct ResponseInfo {
    address requester; // account that requested status
    bool isOpen; // if open,  oracle responses are accepted
    mapping(uint8 => address[]) responses;
  }

  
  // mapping for tracking oracle responses
  mapping(bytes32 => ResponseInfo) oracleResponses;


  // flight details permenantly persisted
  struct FlightStatus {
    bool hasStatus;
    uint8 status;
  }

  mapping(bytes32 => FlightStatus) flights;

  /**********************************************************************/
  /*                        EVENTS                           */
  /**********************************************************************/
  
  // Event fired each time an oracle submits a response
  event LogFlightStatusInfo(string flight, uint256 timestamp, uint8 delayStatus, bool verified);


  /**********************************************************************/
  /*                        MODIFIERS                           */
  /**********************************************************************/

  modifier onlyOwner() {
    require(msg.sender == contractOwner, 'caller not owner');
    _;
  }

  constructor() {
    contractOwner = msg.sender;
  }


  function registerOracle() external payable {
    require(msg.value >= REGISTRATION_FEE, 'reg. fee is important');
    uint8[3] memory indexes = generateIndexes(msg.sender);
    oracles[msg.sender] = indexes;
  }


  function generateIndexes(address _account) internal returns(uint8[3] memory) {
    uint8[3] memory indexes;
    indexes[0] = getRandomIndex(_account);

    indexes[1] = indexes[0];
    while(indexes[1] == indexes[0]) {
      indexes[1] = getRandomIndex(_account);
    }

  
    indexes[2] == indexes[1];
    while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
      indexes[2] == getRandomIndex(_account);
    }

    return indexes;

  }


  // returns an array of non-duplicating  integers ranging from 0-9
  function getRandomIndex(address _account) internal returns(uint8) {
    uint8 maxValue  = 10;

    // pseudo random number.. the incrementing nonce value enhances the degree of randomness
    uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), _account))) % maxValue);
    // uint8 random = uint8()
    if(nonce > 250) {
      nonce = 0;
    }
    return random;
  }


  function getOracle(address _account) public view onlyOwner returns(uint8[3] memory) {
    return oracles[_account];
  }






}