pragma solidity ^0.4.25;

contract Storage {
    string value;

    constructor(string _value) public {
        value = _value;
    }

    function setValue(string _value) external returns (bool) {
        value = _value;
        return true;
    }

    function getValue() external view returns (string) {
        return value;
    }
}