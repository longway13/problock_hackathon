import Web3 from "web3";

// Cronos chain RPC endpoint
const web3 = new Web3('https://cronos-testnet.crypto.org:8545');

const sendTransaction = async () => {
  const sender = "0xAFD78d7ED133df801f1dF42732B33ECFaDC0bFb1";
  const receiver = '0x658B3716AeeF9D6827cc9eeFaC81933ca174A2DC';  // 수신자의 주소를 입력해주세요.

  const transactionParameters = {
    from: sender,
    to: receiver,
    value: web3.utils.toWei('0.1', 'ether')  // 보낼 양을 Ether 단위로 입력합니다.
  };

  const gas = await web3.eth.estimateGas(transactionParameters);

  const transaction = {
    ...transactionParameters,
    gas: web3.utils.toHex(gas),
  };

  const signedTx = await web3.eth.accounts.signTransaction(transaction, 'privateKey');  // 개인키를 사용하여 트랜잭션에 서명합니다.
  
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);  // 서명된 트랜잭션을 보냅니다.

  console.log(`Transaction hash: ${receipt.transactionHash}`);
};

sendTransaction().catch(console.error);