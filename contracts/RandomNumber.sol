pragma solidity ^0.4.25;

contract RandomNumber {
    uint8[256] public numbers;
    uint8 private index;
    uint8 private result;
    bool private start;
    address public owner;
    
    constructor() public {
        owner = msg.sender;
        start = false;
    }
    
    function random(uint8 number) public {
        require(number < 256);
        if(!start) start = true;
        numbers[index++] = number;
        result = numbers[0];
        for (uint8 i = 1; i < index; i++) {
            result ^= numbers[i];
        }
    }
    
    function getNumber() public view returns (uint8) {
        require(start == true);
        return result;
    }
}