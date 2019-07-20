pragma solidity ^0.5.10;

contract Timer {
    uint256 public deadline;
    constructor() public {
        deadline = now + 365 days;
    }
    
    function secondsRemaining() public view returns (uint256) {
        if (deadline <= now) {
            return 0;
        } else {
            return deadline - now;
        }
    }
}