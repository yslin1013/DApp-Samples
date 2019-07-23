window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (err) {
      document.getElementById('status').innerHTML = 'User denied account access: ' + err;
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    document.getElementById('status').innerHTML = 'No Metamask (or other Web3 Provider) installed';
  }
});

function buyTokens() {
  const contractAddress = '0xD0D6c01Eb198AB5F343f355F2DcBd58df3Ae360E';
  const abi = contractAbi;
  const MyContract = web3.eth.contract(abi).at(contractAddress);
  MyContract.buyTokens({
    to: contractAddress,
    value: document.getElementById('tokenAmount').value,
    gas: 80000,
    gasPrice: 40000000000
  }, (err, transactionId) => {
    if (err) {
      document.getElementById('token').innerHTML = 'TX failed: ' + err;
    } else {
      document.getElementById('token').innerHTML = '<a href="https://ropsten.etherscan.io/tx/' + transactionId + '" target="_blank">TX successful</a>';
    }
  });
}

function getBalance() {
  const ethAccount = web3.eth.accounts[0];
  web3.eth.getBalance(ethAccount, (err, result) => {
    if (err) {
      document.getElementById('account').innerHTML = 'Get balance error: ' + err;
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
      document.getElementById('donate').innerHTML = 'Donation failed: ' + err;
    } else {
      document.getElementById('donate').innerHTML = 'Donation successful: ' + '<a href="https://ropsten.etherscan.io/tx/' + transactionId + '" target="_blank">' + transactionId + '</a>';
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
      document.getElementById('compile').innerHTML = 'Compilation failed';
      return;
    }
    else {
      document.getElementById('compile').innerHTML = 'Compilation completed';
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
        document.getElementById('deploy').innerHTML = 'Deployment failed: ' + err;
      }
      if (contract.address) {
        document.getElementById('deploy').innerHTML = 'Contract deployed: ' + '<a href="https://ropsten.etherscan.io/address/' + contract.address + '" target="_blank">' + contract.address + '</a>';
      } else {
        document.getElementById('deploy').innerHTML = 'Transaction sent: ' + '<a href="https://ropsten.etherscan.io/tx/' + contract.transactionHash + '" target="_blank">' + contract.transactionHash + '</a>';
      }
    });
  }); 
}

function deployContract() {
  const bytecode = contractBytecode;
  const abi = contractAbi;
  const MyContract = web3.eth.contract(abi);
  const myContractInstance = MyContract.new('200000000', 'ZZZ Token', 'ZZZ', '2',
  {
    from: web3.eth.accounts[0],
    data: '0x' + bytecode,
    gas: '4700000',
    gasPrice: '6000000000'
  }, function (err, contract) {
    if (err) {
      document.getElementById('deploy').innerHTML = 'Deployment failed: ' + err;
    }
    if (contract.address) {
      document.getElementById('deploy').innerHTML = 'Contract deployed: ' + '<a href="https://ropsten.etherscan.io/address/' + contract.address + '" target="_blank">' + contract.address + '</a>';
    } else {
      document.getElementById('deploy').innerHTML = 'Transaction sent: ' + '<a href="https://ropsten.etherscan.io/tx/' + contract.transactionHash + '" target="_blank">' + contract.transactionHash + '</a>';
    }
  });
}

// Scan for new account switching 
let account = web3.eth.accounts[0];
const accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    location.reload();
  }
}, 100);


// Countdown Timer
const contractAddress = '0xa3e21c114b98b8b7d9a5ff9ab7e0ef0d59e7cb84';
const abi = timerAbi;
const MyContract = web3.eth.contract(abi).at(contractAddress);

let distance, previous;
const x = setInterval(function() {
  MyContract.secondsRemaining((err, result) => {
    if (err) {
      document.getElementById("sync").innerHTML = 'Get remaining time failed' + err;
    } else {
      const current = parseInt(result.toString());
      if(previous !== current) {
        previous = current;
        distance = current;
        document.getElementById("sync").innerHTML = "Synced !";
      } else {
        if (distance > 0) distance--;
        document.getElementById("sync").innerHTML = "Sync with SC timestamp";
      }
    }
  });

  let days = Math.floor(distance / (60 * 60 * 24));
  let hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
  let minutes = Math.floor((distance % (60 * 60)) / 60);
  let seconds = Math.floor(distance % 60);
  if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    document.getElementById("timer").innerHTML = "Syncing ...";
  } else {
    if (hours >= 0 && hours < 10) hours = "0" + hours;
    if (minutes >= 0 && minutes < 10) minutes = "0" + minutes;
    if (seconds >= 0 && seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").innerHTML = (days + ":" + hours + ":" + minutes + ":" + seconds);
  }
  if (distance < 0) clearInterval(x);

}, 1000);