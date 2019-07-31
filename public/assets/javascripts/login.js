window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      initialize();
      checkUserLogin();
      sendNotification('w3-pale-blue', 'Welcome', 'Metamask connected');
    } catch (error) {
      sendNotification('w3-pale-red', 'Warning', error.message);
    }
  } else {
    sendNotification('w3-pale-red', 'Welcome', 'No Metamask connected');
  }
});

function initialize() {
  document.querySelector('#login-open').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  document.querySelector('#login-open').addEventListener('click', openLogin);
  document.querySelector('#login-cross').addEventListener('click', closeLogin);
  document.querySelector('#login-cancel').addEventListener('click', closeLogin);
  document.querySelector('#login-user').addEventListener('click', loginUser);
  document.querySelector('#logout-open').addEventListener('click', setLogoutStatus);
  document.querySelector('#res-cross').addEventListener('click', closeNotification)
}

let notificationType = 'w3-pale-blue';
function sendNotification(type, title, msg) {
  let classAttr = document.querySelector('#res-panel').className;
  document.querySelector('#res-panel').className = classAttr.replace(notificationType, type);
  document.querySelector('#res-panel').style.display = 'block';
  document.querySelector('#res-title').innerHTML = title;
  document.querySelector('#res-msg').innerHTML = msg;
  notificationType = type;
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

const message = web3.fromUtf8('Login with Metamask @' + web3.eth.coinbase);
const expiration = Math.floor(new Date().getTime() / (1000 * 60)); // 1 min
const seedphrase = web3.sha3(web3.eth.coinbase + expiration);
let cookieSig = Cookies.get(web3.eth.coinbase);
let sessionKey = sessionStorage.sessionKey;

// triggered by window.onload
function checkUserLogin() {
  if (checkCookieSession(web3.eth.coinbase, cookieSig)) {
    verifySignature(cookieSig, message);
    console.log("Login: " + true);
  } else {
    setLogoutStatus();
    console.log("Login: " + false);
  }
}

// triggered by login button
function loginUser() {
  const usrname = document.querySelector('#usrname').value;
  const psw = document.querySelector('#psw').value;
  if (!usrname || !psw) {
    document.querySelector('#psw-msg').innerHTML = 'REQUIRED: Username & Password';
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
    if (address === web3.eth.coinbase) {
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
  sendNotification('w3-pale-green', 'Login', 'User logged in');
}

function setLogoutStatus() {
  Cookies.remove(web3.eth.coinbase);
  sessionStorage.clear();
  cookieSig = undefined;
  sessionKey = undefined;
  document.querySelector('#login-open').style.display = 'block';
  document.querySelector('#login-panel').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  sendNotification('w3-pale-yellow', 'Logout', 'User logged out');
}

function setErrorStatus(error) {
  Cookies.remove(web3.eth.coinbase);
  document.querySelector('#login-open').style.display = 'block';
  document.querySelector('#login-panel').style.display = 'none';
  document.querySelector('#logout-open').style.display = 'none';
  sendNotification('w3-pale-red', 'Warning', error.substr(0, error.indexOf('\n')));
}

function checkCookieSession(account, signature) {
  if (typeof (Storage) !== 'undefined') {
    if (signature !== undefined && signature.toString().includes('0x')) {
      if (sessionKey && sessionKey === signature) return true;
      else return false;
    }
  } else {
    console.log('No Web Storage support');
    return false;
  }
}

function setCookieSession(account, signature) {
  Cookies.set(account, signature, {
    expires: 1
  }); // 1 day, path & domain
  if (typeof (Storage) !== 'undefined') {
    if (!sessionStorage.sessionKey) {
      sessionStorage.sessionKey = signature;
    }
    console.log('Cookie and session is set');
  } else {
    console.log('No Web Storage support');
  }
}