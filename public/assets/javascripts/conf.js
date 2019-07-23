const ERC20tokenContract = "/*\n  Implement ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20\n*/\n\npragma solidity ^0.4.25;\n\n/**\n * @dev Wrappers over Solidity's arithmetic operations with added overflow\n * checks.\n *\n * Arithmetic operations in Solidity wrap on overflow. This can easily result\n * in bugs, because programmers usually assume that an overflow raises an\n * error, which is the standard behavior in high level programming languages.\n * `SafeMath` restores this intuition by reverting the transaction when an\n * operation overflows.\n *\n * Using this library instead of the unchecked operations eliminates an entire\n * class of bugs, so it's recommended to use it always.\n */\nlibrary SafeMath {\n    /**\n     * @dev Returns the addition of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `+` operator.\n     *\n     * Requirements:\n     * - Addition cannot overflow.\n     */\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\n        uint256 c = a + b;\n        require(c >= a, \"SafeMath: addition overflow\");\n\n        return c;\n    }\n\n    /**\n     * @dev Returns the subtraction of two unsigned integers, reverting on\n     * overflow (when the result is negative).\n     *\n     * Counterpart to Solidity's `-` operator.\n     *\n     * Requirements:\n     * - Subtraction cannot overflow.\n     */\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b <= a, \"SafeMath: subtraction overflow\");\n        uint256 c = a - b;\n\n        return c;\n    }\n\n    /**\n     * @dev Returns the multiplication of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `*` operator.\n     *\n     * Requirements:\n     * - Multiplication cannot overflow.\n     */\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\n        if (a == 0) {\n            return 0;\n        }\n\n        uint256 c = a * b;\n        require(c / a == b, \"SafeMath: multiplication overflow\");\n\n        return c;\n    }\n\n    /**\n     * @dev Returns the integer division of two unsigned integers. Reverts on\n     * division by zero. The result is rounded towards zero.\n     *\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\n     * uses an invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     * - The divisor cannot be zero.\n     */\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b > 0, \"SafeMath: division by zero\");\n        uint256 c = a / b;\n\n        return c;\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\n     * Reverts when dividing by zero.\n     *\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\n     * invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     * - The divisor cannot be zero.\n     */\n    function mod(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b != 0, \"SafeMath: modulo by zero\");\n        return a % b;\n    }\n}\n\n/**\n * @dev Contract module which provides a basic access control mechanism, where\n * there is an account (an owner) that can be granted exclusive access to\n * specific functions.\n *\n * This module is used through inheritance. It will make available the modifier\n * `onlyOwner`, which can be applied to your functions to restrict their use to\n * the owner.\n */\ncontract Ownable {\n    address public _owner;\n\n    event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);\n\n    /**\n     * @dev Initializes the contract setting the deployer as the initial owner.\n     */\n    constructor () internal {\n        _owner = msg.sender;\n        emit OwnershipTransferred(address(0), _owner);\n    }\n\n    /**\n     * @dev Throws if called by any account other than the owner.\n     */\n    modifier onlyOwner() {\n        require(isOwner(), \"Ownable: caller is not the owner\");\n        _;\n    }\n\n    /**\n     * @dev Returns true if the caller is the current owner.\n     */\n    function isOwner() public view returns (bool) {\n        return msg.sender == _owner;\n    }\n\n    /**\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\n     * Can only be called by the current owner.\n     */\n    function transferOwnership(address _newOwner) public onlyOwner {\n        _transferOwnership(_newOwner);\n    }\n\n    /**\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\n     */\n    function _transferOwnership(address _newOwner) internal {\n        require(_newOwner != address(0), \"Ownable: new owner is zero address\");\n        emit OwnershipTransferred(_owner, _newOwner);\n        _owner = _newOwner;\n    }\n}\n\ncontract Token {\n    /// @param _owner The address from which the balance will be retrieved\n    /// @return The balance\n    function balanceOf(address _owner) public view returns (uint256 amount) {}\n\n    /// @notice send `_value` token to `_to` from `msg.sender`\n    /// @param _to The address of the recipient\n    /// @param _value The amount of token to be transferred\n    /// @return Whether the transfer was successful or not\n    function transfer(address _to, uint256 _value) public returns (bool success) {}\n\n    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`\n    /// @param _from The address of the sender\n    /// @param _to The address of the recipient\n    /// @param _value The amount of token to be transferred\n    /// @return Whether the transfer was successful or not\n    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {}\n\n    /// @notice `msg.sender` approves `_addr` to spend `_value` tokens\n    /// @param _spender The address of the account able to transfer the tokens\n    /// @param _value The amount of wei to be approved for transfer\n    /// @return Whether the approval was successful or not\n    function approve(address _spender, uint256 _value) public returns (bool success) {}\n\n    /// @param _owner The address of the account owning tokens\n    /// @param _spender The address of the account able to transfer the tokens\n    /// @return Amount of remaining tokens allowed to spent\n    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {}\n\n    event Transfer(address indexed _from, address indexed _to, uint256 _value);\n    event Approval(address indexed _owner, address indexed _spender, uint256 _value);\n}\n\n\ncontract StandardToken is Token {\n    mapping (address => uint256) balances;\n    mapping (address => mapping (address => uint256)) allowed;\n    uint256 public totalSupply;\n\n    function balanceOf(address _owner) public view returns (uint256 amount) {\n        require(_owner != address(0), \"Zero owner address\");\n        return balances[_owner];\n    }\n\n    function transfer(address _to, uint256 _value) public returns (bool success) {\n        require(_to != address(0), \"Zero destination address\");\n        require(_to != address(this), \"Contract address\");\n        require(_value > 0, \"Transferred value <= 0\");\n        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _value);\n        balances[_to] = SafeMath.add(balances[_to], _value);\n        emit Transfer(msg.sender, _to, _value);\n        return true;\n    }\n\n    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {\n        require(_from != address(0), \"Zero source address\");\n        require(_to != address(0), \"Zero destination address\");\n        require(_to != address(this), \"Contract address\");\n        require(_value > 0, \"Transferred value <= 0\");\n        allowed[_from][msg.sender] = SafeMath.sub(allowed[_from][msg.sender], _value);\n        balances[_from] = SafeMath.sub(balances[_from], _value);\n        balances[_to] = SafeMath.add(balances[_to], _value);\n        emit Transfer(_from, _to, _value);\n        return true;\n    }\n\n    function approve(address _spender, uint256 _value) public returns (bool success) {\n        require(_spender != address(0), \"Zero spender address\");\n        require(_spender != address(this), \"Contract address\");\n        require(_value >= 0, \"Approved value < 0\");\n        allowed[msg.sender][_spender] = _value;\n        emit Approval(msg.sender, _spender, _value);\n        return true;\n    }\n\n    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {\n        require(_owner != address(0), \"Zero owner address\");\n        require(_spender != address(0), \"Zero spender address\");\n        return allowed[_owner][_spender];\n    }\n}\n\n\ncontract CustomizedToken is StandardToken, Ownable {\n    string public name;\n    string public symbol;\n    uint8 public decimals;\n\n    uint256 rate = 1;\n\n    constructor(\n        uint256 _initialAmount,\n        string memory _tokenName,\n        string memory _tokenSymbol,\n        uint8 _decimalUnits\n        ) public {\n        balances[msg.sender] = _initialAmount; // Give the creator all initial tokens\n        totalSupply = _initialAmount;          // Update total supply\n        name = _tokenName;                     // Set the name for display purposes\n        symbol = _tokenSymbol;                 // Set the symbol for display purposes\n        decimals = _decimalUnits;              // Amount of decimals for display purposes\n        emit Transfer(address(0), _owner, totalSupply);\n    }\n\n    /* This notifies clients about the amount burnt */\n    event Burn(address indexed _from, uint256 _value);\n\n    /* This notifies clients about the amount frozen */\n    event Freeze(address indexed _from, uint256 _value);\n\n    /* This notifies clients about the amount unfrozen */\n    event Unfreeze(address indexed _from, uint256 _value);\n\n    /* Token that can be irreversibly burned (destroyed) */\n    function burn(uint256 _value) public returns (bool success) {\n        require(_value > 0, \"Burned value <= 0\");\n        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _value);\n        totalSupply = SafeMath.sub(totalSupply, _value);\n        emit Burn(msg.sender, _value);\n        return true;\n    }\n\n    /* Token that can be minted (created) */\n    function mint(uint _value) public onlyOwner returns (bool success) {\n        require(_value > 0, \"Minted value <= 0\");\n        totalSupply = SafeMath.add(totalSupply, _value);\n        balances[_owner] = SafeMath.add(balances[_owner], _value);\n        emit Transfer(address(0), _owner, _value);\n        return true;\n    }\n\n    /* Return the frozen amount */\n    mapping (address => uint256) freezes;\n    function freezeOf(address _owner) public view returns (uint256 amount) {\n        require(_owner != address(0), \"Zero owner address\");\n        return freezes[_owner];\n    }\n\n    /* Token that can be frozen (locked) */\n    function freeze(uint256 _value) public returns (bool success) {\n        require(_value > 0, \"Frozen value <= 0\");\n        freezes[msg.sender] = SafeMath.add(freezes[msg.sender], _value);\n        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _value);\n        emit Freeze(msg.sender, _value);\n        return true;\n    }\n\n    /* Token that can be unfrozen (unlocked) */\n    function unfreeze(uint256 _value) public returns (bool success) {\n        require(_value > 0, \"Unfrozen value <= 0\");\n        freezes[msg.sender] = SafeMath.sub(freezes[msg.sender], _value);\n        balances[msg.sender] = SafeMath.add(balances[msg.sender], _value);\n        emit Unfreeze(msg.sender, _value);\n        return true;\n    }\n\n    /* Ether withdraw function */\n    function withdrawEther() public onlyOwner {\n        _owner.transfer(address(this).balance);\n    }\n\n    /* Fallback function */\n    function() external payable {}\n\n    function buyTokens() public payable returns (bool success) {\n        uint256 _value = SafeMath.mul(msg.value, rate);\n        require(_value > 0, \"Transferred tokens <= 0\");\n        balances[_owner] = SafeMath.sub(balances[_owner], _value);\n        balances[msg.sender] = SafeMath.add(balances[msg.sender], _value);\n        emit Transfer(_owner, msg.sender, _value);\n        return true;\n    }\n}";

const contractBytecode = "608060405260016007553480156200001657600080fd5b50604051620016d2380380620016d28339810160408181528251602084015191840151606085015160038054600160a060020a031916331790819055929593840194919093019291600160a060020a0316906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a33360009081526020818152604090912085905560028590558351620000bc916004919086019062000136565b508151620000d290600590602085019062000136565b506006805460ff831660ff199091161790556003546002546040805191825251600160a060020a03909216916000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef919081900360200190a350505050620001db565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200017957805160ff1916838001178555620001a9565b82800160010185558215620001a9579182015b82811115620001a95782518255916020019190600101906200018c565b50620001b7929150620001bb565b5090565b620001d891905b80821115620001b75760008155600101620001c2565b90565b6114e780620001eb6000396000f3006080604052600436106101065763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde038114610108578063095ea7b31461019257806318160ddd146101ca57806323b872dd146101f1578063313ce5671461021b57806342966c68146102465780636623fc461461025e57806370a08231146102765780637362377b146102975780638f32d59b146102ac57806395d89b41146102c1578063a0712d68146102d6578063a9059cbb146102ee578063b2bdfa7b14610312578063cd4217c114610343578063d0febe4c14610364578063d7a78db81461036c578063dd62ed3e14610384578063f2fde38b146103ab575b005b34801561011457600080fd5b5061011d6103cc565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561015757818101518382015260200161013f565b50505050905090810190601f1680156101845780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561019e57600080fd5b506101b6600160a060020a036004351660243561045a565b604080519115158252519081900360200190f35b3480156101d657600080fd5b506101df6105dd565b60408051918252519081900360200190f35b3480156101fd57600080fd5b506101b6600160a060020a03600435811690602435166044356105e3565b34801561022757600080fd5b50610230610842565b6040805160ff9092168252519081900360200190f35b34801561025257600080fd5b506101b660043561084b565b34801561026a57600080fd5b506101b660043561091c565b34801561028257600080fd5b506101df600160a060020a0360043516610a03565b3480156102a357600080fd5b50610106610a81565b3480156102b857600080fd5b506101b6610b1c565b3480156102cd57600080fd5b5061011d610b2d565b3480156102e257600080fd5b506101b6600435610b88565b3480156102fa57600080fd5b506101b6600160a060020a0360043516602435610cc3565b34801561031e57600080fd5b50610327610e6e565b60408051600160a060020a039092168252519081900360200190f35b34801561034f57600080fd5b506101df600160a060020a0360043516610e7d565b6101b6610efb565b34801561037857600080fd5b506101b6600435611004565b34801561039057600080fd5b506101df600160a060020a03600435811690602435166110eb565b3480156103b757600080fd5b50610106600160a060020a03600435166111d9565b6004805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104525780601f1061042757610100808354040283529160200191610452565b820191906000526020600020905b81548152906001019060200180831161043557829003601f168201915b505050505081565b6000600160a060020a03831615156104bc576040805160e560020a62461bcd02815260206004820152601460248201527f5a65726f207370656e6465722061646472657373000000000000000000000000604482015290519081900360640190fd5b600160a060020a03831630141561051d576040805160e560020a62461bcd02815260206004820152601060248201527f436f6e7472616374206164647265737300000000000000000000000000000000604482015290519081900360640190fd5b6000821015610576576040805160e560020a62461bcd02815260206004820152601260248201527f417070726f7665642076616c7565203c20300000000000000000000000000000604482015290519081900360640190fd5b336000818152600160209081526040808320600160a060020a03881680855290835292819020869055805186815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a350600192915050565b60025481565b6000600160a060020a0384161515610645576040805160e560020a62461bcd02815260206004820152601360248201527f5a65726f20736f75726365206164647265737300000000000000000000000000604482015290519081900360640190fd5b600160a060020a03831615156106a5576040805160e560020a62461bcd02815260206004820152601860248201527f5a65726f2064657374696e6174696f6e20616464726573730000000000000000604482015290519081900360640190fd5b600160a060020a038316301415610706576040805160e560020a62461bcd02815260206004820152601060248201527f436f6e7472616374206164647265737300000000000000000000000000000000604482015290519081900360640190fd5b6000821161075e576040805160e560020a62461bcd02815260206004820152601660248201527f5472616e736665727265642076616c7565203c3d203000000000000000000000604482015290519081900360640190fd5b600160a060020a038416600090815260016020908152604080832033845290915290205461078c9083611240565b600160a060020a03851660008181526001602090815260408083203384528252808320949094559181529081905220546107c69083611240565b600160a060020a0380861660009081526020819052604080822093909355908516815220546107f590836112a9565b600160a060020a0380851660008181526020818152604091829020949094558051868152905191939288169260008051602061149c83398151915292918290030190a35060019392505050565b60065460ff1681565b60008082116108a4576040805160e560020a62461bcd02815260206004820152601160248201527f4275726e65642076616c7565203c3d2030000000000000000000000000000000604482015290519081900360640190fd5b336000908152602081905260409020546108be9083611240565b336000908152602081905260409020556002546108db9083611240565b60025560408051838152905133917fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5919081900360200190a2506001919050565b6000808211610975576040805160e560020a62461bcd02815260206004820152601360248201527f556e66726f7a656e2076616c7565203c3d203000000000000000000000000000604482015290519081900360640190fd5b3360009081526008602052604090205461098f9083611240565b3360009081526008602090815260408083209390935581905220546109b490836112a9565b3360008181526020818152604091829020939093558051858152905191927f2cfce4af01bcb9d6cf6c84ee1b7c491100b8695368264146a94d71e10a63083f92918290030190a2506001919050565b6000600160a060020a0382161515610a65576040805160e560020a62461bcd02815260206004820152601260248201527f5a65726f206f776e657220616464726573730000000000000000000000000000604482015290519081900360640190fd5b50600160a060020a031660009081526020819052604090205490565b610a89610b1c565b1515610adf576040805160e560020a62461bcd02815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600354604051600160a060020a0390911690303180156108fc02916000818181858888f19350505050158015610b19573d6000803e3d6000fd5b50565b600354600160a060020a0316331490565b6005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104525780601f1061042757610100808354040283529160200191610452565b6000610b92610b1c565b1515610be8576040805160e560020a62461bcd02815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b60008211610c40576040805160e560020a62461bcd02815260206004820152601160248201527f4d696e7465642076616c7565203c3d2030000000000000000000000000000000604482015290519081900360640190fd5b610c4c600254836112a9565b600255600354600160a060020a0316600090815260208190526040902054610c7490836112a9565b60038054600160a060020a0390811660009081526020818152604080832095909555925484518781529451921693909260008051602061149c83398151915292918290030190a3506001919050565b6000600160a060020a0383161515610d25576040805160e560020a62461bcd02815260206004820152601860248201527f5a65726f2064657374696e6174696f6e20616464726573730000000000000000604482015290519081900360640190fd5b600160a060020a038316301415610d86576040805160e560020a62461bcd02815260206004820152601060248201527f436f6e7472616374206164647265737300000000000000000000000000000000604482015290519081900360640190fd5b60008211610dde576040805160e560020a62461bcd02815260206004820152601660248201527f5472616e736665727265642076616c7565203c3d203000000000000000000000604482015290519081900360640190fd5b33600090815260208190526040902054610df89083611240565b3360009081526020819052604080822092909255600160a060020a03851681522054610e2490836112a9565b600160a060020a0384166000818152602081815260409182902093909355805185815290519192339260008051602061149c8339815191529281900390910190a350600192915050565b600354600160a060020a031681565b6000600160a060020a0382161515610edf576040805160e560020a62461bcd02815260206004820152601260248201527f5a65726f206f776e657220616464726573730000000000000000000000000000604482015290519081900360640190fd5b50600160a060020a031660009081526008602052604090205490565b600080610f0a3460075461130d565b905060008111610f64576040805160e560020a62461bcd02815260206004820152601760248201527f5472616e7366657272656420746f6b656e73203c3d2030000000000000000000604482015290519081900360640190fd5b600354600160a060020a0316600090815260208190526040902054610f899082611240565b600354600160a060020a0316600090815260208190526040808220929092553381522054610fb790826112a9565b336000818152602081815260409182902093909355600354815185815291519293600160a060020a039091169260008051602061149c8339815191529281900390910190a3600191505090565b600080821161105d576040805160e560020a62461bcd02815260206004820152601160248201527f46726f7a656e2076616c7565203c3d2030000000000000000000000000000000604482015290519081900360640190fd5b3360009081526008602052604090205461107790836112a9565b33600090815260086020908152604080832093909355819052205461109c9083611240565b3360008181526020818152604091829020939093558051858152905191927ff97a274face0b5517365ad396b1fdba6f68bd3135ef603e44272adba3af5a1e092918290030190a2506001919050565b6000600160a060020a038316151561114d576040805160e560020a62461bcd02815260206004820152601260248201527f5a65726f206f776e657220616464726573730000000000000000000000000000604482015290519081900360640190fd5b600160a060020a03821615156111ad576040805160e560020a62461bcd02815260206004820152601460248201527f5a65726f207370656e6465722061646472657373000000000000000000000000604482015290519081900360640190fd5b50600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b6111e1610b1c565b1515611237576040805160e560020a62461bcd02815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b610b19816113ac565b6000808383111561129b576040805160e560020a62461bcd02815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b5050808203805b5092915050565b600082820183811015611306576040805160e560020a62461bcd02815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b60008083151561132057600091506112a2565b5082820282848281151561133057fe5b0414611306576040805160e560020a62461bcd02815260206004820152602160248201527f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f60448201527f7700000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b600160a060020a0381161515611432576040805160e560020a62461bcd02815260206004820152602260248201527f4f776e61626c653a206e6577206f776e6572206973207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b600354604051600160a060020a038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a36003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa165627a7a72305820524d0682d9c1e47ffdef214b06c2d7d7647fc22135e94dfe7f6509f4db2348f20029";

const contractAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"mint","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"_owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"freezeOf","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyTokens","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_tokenSymbol","type":"string"},{"name":"_decimalUnits","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Unfreeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_previousOwner","type":"address"},{"indexed":true,"name":"_newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];

const timerAbi = [{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"constant": true,"inputs": [],"name": "secondsRemaining","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}];