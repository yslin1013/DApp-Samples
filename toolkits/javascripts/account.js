document.getElementById("createAccount").addEventListener("click", async () => {
  const passphrase = document.getElementById("passphrase").value;
  /*
    web3.eth.accounts.create();
    Generates an account object with private key and public key.
    It's different from web3.eth.personal.newAccount() which creates an account
    over the network on the node via an RPC call.
  */
  let newAccount = await web3.eth.accounts.create();
  // console.log('New account = ' + JSON.stringify(newAccount));

  /*
    web3.eth.accounts.encrypt(privateKey, passphrase);
    Encrypts a private key to the web3 keystore v3 standard.
  */
  let keystore = await web3.eth.accounts.encrypt(newAccount.privateKey, passphrase);
  // console.log('New keystore = \n' + JSON.stringify(keystore));

  // Save new keystore file
  const text = JSON.stringify(keystore, null, 2);
  const filename = "keystore-" + keystore.address + '-' +  + new Date().getTime();
  const blob = new Blob([text], {type: "application/json"});
  saveAs(blob, filename);
});
