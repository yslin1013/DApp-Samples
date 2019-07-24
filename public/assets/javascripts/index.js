window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      loadInformations();
      setListeners();
    } catch (error) {      
      document.getElementById('status').innerHTML = 'User denied account access';
      console.error(error);
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    loadInformations();
    setListeners();
  } else {
    document.getElementById('status').innerHTML = 'No Metamask (or other Web3 Provider) installed';
  }
});

function loadInformations() {
  document.getElementById('coinbase').innerHTML = web3.eth.coinbase;
  web3.version.getNetwork((error, result) => {
    if(error) console.error(error);
    else document.getElementById('network-id').innerHTML = result;
  });
  web3.net.getPeerCount((error, result) => {
    if(error) console.error(error);
    else document.getElementById('peer-count').innerHTML = result;
  });
  web3.eth.getBlockNumber((error, result) => {
    if(error) console.error(error);
    else document.getElementById('block-number').innerHTML = result;
  });
  web3.eth.filter('latest', (error, result) => {
    if (error) console.error(error);
    else {
      web3.eth.getBlockNumber((error, result) => {
        if(error) console.error(error);
        else document.getElementById('block-number').innerHTML = result;
      });
    }
  });
  web3.eth.getGasPrice((error, result) => {
    if(error) console.error(error);
    else document.getElementById('gas-price').innerHTML = result.toString(10);
  });
  web3.version.getNode((error, result) => {
    if(error) console.error(error);
    else {
      document.getElementById('web3-verion').innerHTML = web3.version.api;
      document.getElementById('provider').innerHTML = result;
    }
  });
}

function setListeners() {
  document.getElementById("user-login").addEventListener("click", userLogin);
  document.getElementById("buy-tokens").addEventListener("click", buyTokens);
  document.getElementById("get-balance").addEventListener("click", getBalance);
  document.getElementById("donate-account").addEventListener("click", donateAccount);
  document.getElementById("cd-contract").addEventListener("click", cdContract);
  document.getElementById("deploy-contract").addEventListener("click", deployContract);
}

// -----------------------------

const signature = Cookies.get(web3.eth.coinbase);
const expiration = Math.floor(new Date().getTime() / (1000 * 60 * 60));
const seedphrase = web3.sha3(web3.eth.coinbase + expiration);
const message = web3.fromUtf8("Login with Metamask @" + web3.eth.coinbase);
let bIsLogin = checkUserLogin(signature, message);

function userLogin() {
  if (checkUserLogout()) return;
  if (!bIsLogin) {
    web3.personal.sign(message, web3.eth.coinbase, seedphrase, (error, signature) => {
      if(error) {
        setUserLogin();
        console.error(error);
      }
      else {
        Cookies.set(web3.eth.coinbase, signature, { expires: 1 });
        setUserLogout();
        alert("Login successful");
      }
    });
  }
}

function checkUserLogin(signature, message) {
  if(signature !== undefined) {
    web3.personal.ecRecover(message, signature, (error, address) => {
      if (error) {
        setUserLogin();
        console.error(error);
        return false;
      } else {
        if(address === web3.eth.coinbase) {
          setUserLogout();
          console.log(signature);
          return true;
        } else return false;
      }
    });
  } else return false;
}

function checkUserLogout() {
  let status = document.getElementById('user-login').innerHTML;
  let title = document.getElementById('user-login').title;
  if (status === "Logout (Metamask)" || title === "Logout with Metamask") {
    setUserLogin();
    alert("Logout successful");
    return true;
  } else return false;
}

function setUserLogin() {
  Cookies.remove(web3.eth.coinbase);
  document.getElementById('user-login').innerHTML = "Login (Metamask)";
  document.getElementById('user-login').title = "Login with Metamask";
}

function setUserLogout() {
  document.getElementById('user-login').innerHTML = "Logout (Metamask)";
  document.getElementById('user-login').title = "Logout with Metamask";
}

function buyTokens() {
  const contractAddress = '0xD0D6c01Eb198AB5F343f355F2DcBd58df3Ae360E';
  const abi = contractAbi;
  const MyContract = web3.eth.contract(abi).at(contractAddress);
  MyContract.buyTokens({
    to: contractAddress,
    value: document.getElementById('token-amount').value,
    gas: '80000',
    gasPrice: '20000000000'
  }, (error, transactionId) => {
    if (error) {
      document.getElementById('token').innerHTML = 'TX failed';
      console.error(error);
    } else {
      const link = '<a href="' + etherscanTxURL + transactionId + '" target="_blank">TX successful</a>';
      document.getElementById('token').innerHTML = link;
    }
  });
}

function getBalance() {
  const ethAccount = web3.eth.accounts[0];
  web3.eth.getBalance(ethAccount, (error, result) => {
    if (error) {
      document.getElementById('account').innerHTML = 'Get balance error';
      console.error(error);
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
    gas: '80000',
    gasPrice: '20000000000'
  }, (error, transactionId) => {
    if (error) {
      document.getElementById('donate').innerHTML = 'Donation failed';
      console.error(error);
    } else {
      const link = '<a href="' + etherscanTxURL + transactionId + '" target="_blank">Donation successful</a>';
      document.getElementById('donate').innerHTML = link;
    }
  });
}

function cdContract() {
  // issue: soljson-v0.5.10+commit.5a6ea5b1.js
  BrowserSolc.loadVersion("soljson-v0.4.25+commit.59dbf8f1.js", (compiler) => {
    const source = ERC20tokenContract;
    const optimize = 1;
    const result = compiler.compile(source, optimize);
    if (Object.keys(result.contracts).length == 0) {
      document.getElementById('compile').innerHTML = 'Compilation failed';
      return;
    } else {
      document.getElementById('compile').innerHTML = 'Compilation completed';
    }

    const bytecode = result.contracts[':CustomizedToken'].bytecode;
    const abi = result.contracts[':CustomizedToken'].interface;
    const MyContract = web3.eth.contract(JSON.parse(abi));
    const myContractInstance = MyContract.new('1000000', 'ABC Token', 'ABC', '0', {
      from: web3.eth.accounts[0],
      data: '0x' + bytecode,
      gas: '4700000',
      gasPrice: '8000000000'
    }, (error, contract) => {
      if (error) {
        document.getElementById('deploy').innerHTML = 'Deployment failed';
        console.error(error);
      } else {
        if (contract.address) {
          const link = '<a href="' + etherscanAddressURL  + contract.address + '" target="_blank">Contract deployed</a>';
          document.getElementById('deploy').innerHTML = link;
        } else {
          const link = '<a href="' + etherscanTxURL + contract.transactionHash + '" target="_blank">Transaction successful</a>';
          document.getElementById('deploy').innerHTML = link;
        } 
      }
    });
  }); 
}

function deployContract() {
  const bytecode = contractBytecode;
  const abi = contractAbi;
  const MyContract = web3.eth.contract(abi);
  const myContractInstance = MyContract.new('200000000', 'ZZZ Token', 'ZZZ', '2', {
    from: web3.eth.accounts[0],
    data: '0x' + bytecode,
    gas: '4700000',
    gasPrice: '8000000000'
  }, (error, contract) => {
    if (error) {
      document.getElementById('deploy').innerHTML = 'Deployment failed';
      console.error(error);
    } else {
      if (contract.address) {
        const link = '<a href="' + etherscanAddressURL  + contract.address + '" target="_blank">Contract deployed</a>';
        document.getElementById('deploy').innerHTML = link;
      } else {
        const link = '<a href="' + etherscanTxURL + contract.transactionHash + '" target="_blank">Transaction successful</a>';
        document.getElementById('deploy').innerHTML = link;
      }
    }
  });
}

function getSolcVersion() {
  BrowserSolc.getVersions((soljsonSources, soljsonReleases) => {
    console.log(soljsonSources);
    console.log(soljsonReleases);
  });
}

// -------------------------------------------------

// Scan for account switching 
let account = web3.eth.accounts[0];
const accountInterval = setInterval(() => {
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
const x = setInterval(() => {
  MyContract.secondsRemaining((error, result) => {
    if (error) {
      document.getElementById("sync").innerHTML = 'Get remaining time failed' + error;
    } else {
      const current = parseInt(result.toString());
      if(previous !== current) {
        previous = current;
        distance = current;
        synchronizeTimer();
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
    synchronizeTimer();
  } else {
    if (hours >= 0 && hours < 10) hours = "0" + hours;
    if (minutes >= 0 && minutes < 10) minutes = "0" + minutes;
    if (seconds >= 0 && seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").innerHTML = (days + ":" + hours + ":" + minutes + ":" + seconds);
  }
  if (distance < 0) clearInterval(x);
}, 1000);

function synchronizeTimer() {
  setTimeout(() => {
    document.getElementById("timer").innerHTML = "Syncing ...";
  }, 2000);
}
