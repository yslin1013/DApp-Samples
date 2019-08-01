window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      initialize(); loadInformations();      
      const status = (checkUserLogin() ? 'Status (login)' : 'Status (logout)');
      sendNotification('info', 'Welcome', 'Metamask connected; ' + status);
    } catch (error) {
      sendNotification('error', 'Warning', error.message);
    }
  } else {
    sendNotification('error', 'Welcome', 'No Metamask connected');
  }
});

function initialize() { 
  document.querySelector('#login-open').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  document.querySelector('#res-panel').style.display = 'none';
  document.querySelector('#user-panel').style.display = 'none';
  document.querySelector('#login-open').addEventListener('click', openLogin);
  document.querySelector('#login-cross').addEventListener('click', closeLogin);
  document.querySelector('#login-cancel').addEventListener('click', closeLogin);
  document.querySelector('#login-user').addEventListener('click', loginUser);
  document.querySelector('#logout-open').addEventListener('click', setLogoutStatus);
  document.querySelector('#res-cross').addEventListener('click', closeNotification);
  document.querySelector('#product-list').addEventListener('click', loadProductList);
  document.querySelector('#product-buy').addEventListener('click', purchaseProduct);
}

function loadInformations() {
  console.log('Coinbase: ' + web3.eth.coinbase);
  web3.version.getNetwork((error, result) => {
    if(error) console.error(error);
    else console.log('Network: ' + result);
  });
  web3.net.getPeerCount((error, result) => {
    if(error) console.error(error);
    else console.log('Peer count: ' + result);
  });
  web3.eth.getBlockNumber((error, result) => {
    if(error) console.error(error);
    else console.log('Block number: '  + result);
  });
  web3.eth.getGasPrice((error, result) => {
    if(error) console.error(error);
    else console.log('Gas price: ' + result.toString(10));
  });
  web3.version.getNode((error, result) => {
    if(error) console.error(error);
    else {
      console.log('Web3 version: ' + web3.version.api);
      console.log('Provider: ' + result);
    }
  });
}

let nColor = 'w3-pale-blue', nNewColor;
function sendNotification(type, title, msg) {
  switch (type) {
    case 'info':
      nNewColor = 'w3-pale-blue';
      break;
    case 'error':
      nNewColor = 'w3-pale-red';
      break;
    default:
      nNewColor = 'w3-pale-blue';
      break;
  }
  let classAttr = document.querySelector('#res-panel').className;
  document.querySelector('#res-panel').className = classAttr.replace(nColor, nNewColor);
  document.querySelector('#res-panel').style.display = 'block';
  document.querySelector('#res-title').innerHTML = title;
  document.querySelector('#res-msg').innerHTML = msg;
  nColor = nNewColor;
}

function openLogin() {
  document.getElementById('login-panel').style.display = 'block';
}

function closeLogin() {
  document.getElementById('login-panel').style.display = 'none';
}

function closeNotification() {
  document.getElementById('res-panel').style.display = 'none';
}

// ---------------------

const message = web3.fromUtf8('Login with Metamask @PD');
const seed = Math.floor(new Date().getTime());
const seedphrase = web3.sha3(web3.eth.coinbase + seed);
let cookieSig = Cookies.get(web3.eth.coinbase);
let sessionKey = sessionStorage.getItem('key');
const expiration = 1;   // unit: day

// triggered by window.onload
function checkUserLogin() {
  if (checkCookieSession(cookieSig)) {
    verifySignature(cookieSig, message);
    return true;
  } else {
    setLogoutStatus();
    return false;
  }
}

// triggered by login button
function loginUser() {
  const name = document.querySelector('#name').value;
  const password = document.querySelector('#password').value;
  if (!name || !password) {
    document.querySelector('#pw-msg').innerHTML = 'REQUIRED: Username & Password';
    return;
  } else {
    if (!verifySignature(cookieSig, message)) {
      createSignature(message, seedphrase);
    }
  }
}

function verifySignature(signature, message) {
  if (!signature || !message) return;
  web3.personal.ecRecover(message, signature, (error, address) => {
    if(address === web3.eth.coinbase) {
      setLoginStatus();
      return true;
    } else {
      if (error) console.error(error);
      setErrorStatus(error.message);
      return false;
    }
  });
}

function createSignature(message, seedphrase) {
  if (!message || !seedphrase) return;
  web3.personal.sign(message, web3.eth.coinbase, seedphrase, (error, signature) => {
    if (error) {
      console.error(error);
      setErrorStatus(error.message);
      return false;
    } else {
      setCookieSession(web3.eth.coinbase, signature);
      setLoginStatus();
      return true;
    }
  });
}

function setLoginStatus() {
  document.querySelector('#login-open').style.display = 'none';
  document.querySelector('#login-panel').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'block';
  loadUserProfile();
}

function setLogoutStatus(event) {
  Cookies.remove(web3.eth.coinbase);
  sessionStorage.clear();
  cookieSig = undefined;
  sessionKey = undefined;
  document.querySelector('#login-open').style.display = 'block';
  document.querySelector('#login-panel').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  document.querySelector('#user-panel').style.display = 'none';
  document.querySelector('#product-panel').style.display = 'none';
  if (event) location.reload();
}

function setErrorStatus(error) {
  Cookies.remove(web3.eth.coinbase);
  document.querySelector('#login-open').style.display = 'block';
  document.querySelector('#login-panel').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  sendNotification('error', 'Warning', error.substr(0, error.indexOf('\n')));
}

function checkCookieSession(signature) {
  if (typeof(Storage) !== 'undefined') {
    if (signature !== undefined && signature.toString().includes('0x')) {
      if (sessionKey && sessionKey === signature) return true;
      else return false;
    } else return false;
  } else {
    console.log('No Web Storage support');
    return false;
  }
}

function setCookieSession(account, signature) {
  Cookies.set(account, signature, { expires: expiration });  // path & domain
  if (typeof(Storage) !== 'undefined') {
    if (!sessionStorage.getItem('key')) {
      sessionStorage.setItem('name', document.querySelector('#name').value);
      sessionStorage.setItem('address', account);
      sessionStorage.setItem('key', signature);
    }
  } else {
    console.log('No Web Storage support');
  }
}

// --------------------------

const ownerAddress = "0xEA72FC4d14Ecb42E6B5a8E94ac976216283a8833";
const contractAddress = "0xD0D6c01Eb198AB5F343f355F2DcBd58df3Ae360E";
const tokenContract = web3.eth.contract(contractAbi).at(contractAddress);

function loadUserProfile() {
  const userName = sessionStorage.getItem('name');
  const userAddress = sessionStorage.getItem('address');
  if (!userAddress || !userName) return;

  tokenContract.balanceOf(userAddress, (error, result) => {
    if (error) {
      console.error(error);
      sendNotification('error', 'Warning', error.substr(0, error.indexOf('\n')));
    } else {
      document.querySelector('#user-panel').style.display = 'block';
      document.querySelector('#user-name').innerHTML = userName;
      document.querySelector('#user-address').innerHTML = userAddress;
      document.querySelector('#user-balance').innerHTML = 'Token Balance = ' + parseInt(result);
    }
  });
}

function loadProductList() {
  const userName = sessionStorage.getItem('name');
  const userAddress = sessionStorage.getItem('address');
  if (!userAddress || !userName) return;
  document.querySelector('#product-panel').style.display = 'block';
}

function purchaseProduct() {
  tokenContract.transfer(ownerAddress, 100, {
    to: tokenContract,
    gas: '80000',
    gasPrice: '20000000000'
  }, (error, transactionId) => {
    if (error) {
      console.error(error);
    } else {
      console.log(transactionId);
      waitForReceipt(transactionId);
    }
  });
}

function waitForReceipt(txId) {
  const wait = setInterval(() => {
    web3.eth.getTransactionReceipt(txId, (error, receipt) => {
      if (error) {
        clearInterval(wait);
        console.error(error);
      } else if (receipt) {
        clearInterval(wait);
        alert("Tokens are received.");
      } else {}
    });
  }, 2000);
}

let account = web3.eth.coinbase;
const accountInterval = setInterval(() => {
  if (account === undefined) return;
  if (web3.eth.coinbase !== account) {
    account = web3.eth.coinbase;
    location.reload();
  }
}, 1000);