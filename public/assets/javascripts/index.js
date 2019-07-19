window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      buyTokenBtn();
    } catch (err) {
      $('#status').html('User denied account access', err);
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    buyTokenBtn();
  } else {
    $('#status').html('No Metamask (or other Web3 Provider) installed');
  }
});

const buyTokenBtn = () => {
  const contractAddress = '0xd79FCE3432a5E1f19699485eBD482C7Ff71D6176';
  const abi = buyTokenAbi;
  const MyContract = web3.eth.contract(abi).at(contractAddress);
  $('.seta').click(() => {
    MyContract.buyTokens({
      to: contractAddress,
      value: 10,
      gas: 80000,
      gasPrice: 40000000000
    }, (err, transactionId) => {
      if (err) {
        console.log('TX failed', err);
        $('#status').html('TX failed');
      } else {
        console.log('TX successful', transactionId);
        $('#status').html('TX successful: ' + '<a href="https://ropsten.etherscan.io/tx/' + transactionId + '" target="_blank">' + transactionId + '</a>');
      }
    });
  });
  $('.setb').click(() => {
    MyContract.buyTokens({
      to: contractAddress,
      value: 50,
      gas: 80000,
      gasPrice: 40000000000
    }, (err, transactionId) => {
      if (err) {
        console.log('TX failed', err);
        $('#status').html('TX failed');
      } else {
        console.log('TX successful', transactionId);
        $('#status').html('TX successful: ' + '<a href="https://ropsten.etherscan.io/tx/' + transactionId + '" target="_blank">' + transactionId + '</a>');
      }
    });
  });
  $('.setc').click(() => {
    MyContract.buyTokens({
      to: contractAddress,
      value: 100,
      gas: 80000,
      gasPrice: 40000000000
    }, (err, transactionId) => {
      if (err) {
        console.log('TX failed', err);
        $('#status').html('TX failed');
      } else {
        console.log('TX successful', transactionId);
        $('#status').html('TX successful: ' + '<a href="https://ropsten.etherscan.io/tx/' + transactionId + '" target="_blank">' + transactionId + '</a>');
      }
    });
  });
}

let account = web3.eth.accounts[0];
const accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    location.reload();
  }
}, 100);

function getBalance() {
  const ethAccount = web3.eth.accounts[0];
  web3.eth.getBalance(ethAccount, (err, result) => {
    if (err) {
      console.log('Get balance error: ', err);
    } else {
      const ethBalance = result.toString();
      const ethBalanceInEther = web3.fromWei(ethBalance, 'ether');
      const response = `${ethAccount}<br />${ethBalanceInEther}`;
      document.getElementById('account').innerHTML = response;
      return true;
    }
  });
}

function donateAccount() {
  const srcAccount = web3.eth.accounts[0];
  const destAccount = '0xEA72FC4d14Ecb42E6B5a8E94ac976216283a8833';
  const amountEther = 0.01;
  web3.eth.sendTransaction({
    from: srcAccount,
    to: destAccount,
    value: web3.toWei(amountEther, 'ether'),
    gas: 80000,
    gasPrice: 20000000000
  }, (err, transactionId) => {
    if (err) {
      console.log('Donation failed', err);
      $('#donate').html('Donation failed');
    } else {
      console.log('Donation successful', transactionId);
      $('#donate').html('Donation successful');
    }
  });
}

function getSolcVersion() {
  BrowserSolc.getVersions(function (soljsonSources, soljsonReleases) {
    console.log(soljsonSources);
    console.log(soljsonReleases);
  });
}

function cdContract() {
  // issue: soljson-v0.5.10+commit.5a6ea5b1.js
  BrowserSolc.loadVersion("soljson-v0.4.25+commit.59dbf8f1.js", function (compiler) {
    const source = ERC20tokenContract;
    const optimize = 1;
    const result = compiler.compile(source, optimize);
    if (Object.keys(result.contracts).length == 0) {
      console.log('Compilation failed');
      $('#complie').html('Compilation failed');
      return;
    }
    else {
      console.log('Compilation completed');
      $('#complie').html('Compilation completed');
    }

    const bytecode = result.contracts[':CustomizedToken'].bytecode;
    const abi = result.contracts[':CustomizedToken'].interface;
    const MyContract = web3.eth.contract(JSON.parse(abi));
    const myContractInstance = MyContract.new('1000000', 'ABC Token', 'ABC', '0', {
      from: web3.eth.accounts[0],
      data: '0x' + bytecode,
      gas: '4700000',
      gasPrice: '6000000000'
    }, function (err, contract) {
      if (err) {
        console.log('Deployment failed', err);
        $('#deploy').html('Deployment failed');
      }
      if (contract.address) {
        console.log("MyContract deployed at address: " + contract.address);
        $('#deploy').html('Contract deployed: ' + '<a href="https://ropsten.etherscan.io/address/' + contract.address + '" target="_blank">' + contract.address + '</a>');
      } else {
        console.log("MyContract is waiting to be mined at transaction hash: " + contract.transactionHash);
        $('#deploy').html('Transaction sent: ' + '<a href="https://ropsten.etherscan.io/tx/' + contract.transactionHash + '" target="_blank">' + contract.transactionHash + '</a>');
      }
    });
  }); 
}

function deployContract() {
  const bytecode = contractBytecode;
  const abi = contractAbi;
  const MyContract = web3.eth.contract(abi);
  const myContractInstance = MyContract.new('2000000', 'ABC Token', 'ABC', '0',
  {
    from: web3.eth.accounts[0],
    data: '0x' + bytecode,
    gas: '4700000',
    gasPrice: '6000000000'
  }, function (err, contract) {
    if (err) {
      console.log('Deployment failed', err);
      $('#deploy').html('Deployment failed');
    }
    if (contract.address) {
      console.log("MyContract deployed at address: " + contract.address);
      $('#deploy').html('Contract deployed: ' + '<a href="https://ropsten.etherscan.io/address/' + contract.address + '" target="_blank">' + contract.address + '</a>');
    } else {
      console.log("MyContract is waiting to be mined at transaction hash: " + contract.transactionHash);
      $('#deploy').html('Transaction sent: ' + '<a href="https://ropsten.etherscan.io/tx/' + contract.transactionHash + '" target="_blank">' + contract.transactionHash + '</a>');
    }
  });
}