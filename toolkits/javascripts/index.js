let contractData = document.getElementById('contractData');
let etherscan = document.getElementById('etherscan');
let previousTimestamp, previousData;

window.addEventListener('load', async () => {
  window.web3 = new Web3(new Web3.providers.HttpProvider(infuraURL));
  printBlockchainInfo();  
});

function printBlockchainInfo() {
  web3.eth.getBlock('latest', (error, result) => {
    if (error) console.error(error);
    else console.log('Block Gaslimit = ' + result.gasLimit);
  });
}

async function parseData(QrCodeData) {
  const currentTimestamp = Math.floor(new Date().getTime()/scanRate);
  if ((previousTimestamp !== currentTimestamp || 
      previousData !== QrCodeData) && 
      QrCodeData !== '' && QrCodeData !== undefined) {
    if (web3.utils.isAddress(QrCodeData)) {
      window.location.href = etherscanURL + '/address/' + QrCodeData;
    } else if (validURL(QrCodeData)) {
      window.location.href = QrCodeData;
    } else {
      dataText = QrCodeData + currentTimestamp;
      prepareTransaction(dataText);
    }
    previousTimestamp = currentTimestamp;
    previousData = QrCodeData;
  }
}

function prepareTransaction(dataText) {
  console.log('Data to be uploaded on chain = ' + dataText);
  const file = document.getElementById("keystore").files[0];
  const passphrase = document.getElementById("v-passphrase").value;
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async (evt) => {
      try {
        const keystore = evt.target.result;
        const account = await web3.eth.accounts.decrypt(keystore, passphrase);
        const count = await web3.eth.getTransactionCount(account.address);
        const dataTextToHex = web3.utils.utf8ToHex(dataText).replace('0x', '');
        let rawTx = {
          nonce: count,
          gasPrice: 6000000000,
          from: account.address,
          to: contractAddress,
          value: '0x00',
          data: '0x93a09352' + zeroPadding('20', 64) + 
                zeroPadding(dataTextToHex.length.toString(16), 64) + 
                dataTextToHex
        };
        console.log('Raw Tx to be sent = ' + JSON.stringify(rawTx, null, 2));
        rawTx.gasLimit = await web3.eth.estimateGas(rawTx);
        console.log('Estimated gas used = ' + rawTx.gasLimit);
        sendTransaction(rawTx, account.privateKey);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    reader.onerror = function (evt) {
      alert("Error reading file");
    }
  } else alert("No keystore file or passphrase");
}

function sendTransaction(rawTx, key) {
  const tx = new ethereumjs.Tx(rawTx);
  const pkBuffer = new ethereumjs.Buffer.Buffer(key.replace('0x', ''), 'hex');
  tx.sign(pkBuffer);
  const serializedTx = tx.serialize();
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .on('transactionHash', (hash) => {
    console.log('Tx hash = ' + hash);
    const url = etherscanURL + '/tx/' + hash;
    etherscan.innerHTML = "<a href='" + url + "' target='_blank'>CLICK HERE</a>";
  })
  .on('receipt', (receipt) => {
    console.log(receipt);
    retrieveData();
  })
  .on('error', (error) => {
    alert(error.message);
  });
}

function retrieveData() {
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  contract.methods.getValue().call((error, result) => {
    if (error) console.log(error);
    else contractData.innerText = result;
  });
}

function retrieveEthBalance(accountAddress) {
  web3.eth.getBalance(accountAddress, (error, result) => {
    if (error) console.log(error);
    else console.log(web3.utils.fromWei(result, 'ether') + ' ETH');
  });
}

// [Reference] https://gist.github.com/ksuzushima/1b1c5d79cf198595376bebdb7547e35a
function zeroPadding(number, length) {
  return (Array(length).join('0') + number).slice(-length);
}

// [Reference] https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/49849482
function validURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?' +         // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' +                      // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                  // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' +                         // query string
    '(\\#[-a-z\\d_]*)?$', 'i');                          // fragment locator
  return !!pattern.test(str);
}
