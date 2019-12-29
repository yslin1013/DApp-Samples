const scanRate = 90000; // unit: ms
const infuraURL = 'https://ropsten.infura.io/v3/59d3bc73a3d7456685cc9670141a6e46';
const etherscanURL = 'https://ropsten.etherscan.io';
const contractAddress = '0xb64e0539e9587222a0f9078193cd5cabbb471466';
const contractAbi = [{
  "constant": true,
  "inputs": [],
  "name": "getValue",
  "outputs": [{
    "name": "",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "_value",
    "type": "string"
  }],
  "name": "setValue",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "name": "_value",
    "type": "string"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}];