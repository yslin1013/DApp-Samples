pragma solidity ^0.4.25;

contract RandomNumber {
    uint8[256] public numbers;
    uint8 private randomOutput;
    uint8 private index;
    address public owner;
    bool start = false;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function random(uint8 number) public {
        require(number < 256);
        numbers[index++] = number;
        uint8 randomNumber = numbers[0];
        for (uint8 i = 1; i < index; i++) {
            randomNumber ^= numbers[i];
        }
        randomOutput = randomNumber;
        start = true;
    }
    
    function getNumber() public view returns (uint8) {
        require(start == true && randomOutput != 0);
        return randomOutput;
    }
}