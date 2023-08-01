import CaverExtKAS from "caver-js-ext-kas";
import dotenv from "dotenv";
dotenv.config();  

const loggerabi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "log_id",
        "type": "uint256"
      }
    ],
    "name": "find",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "user_id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "complaint_id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "event_type",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "date",
            "type": "string"
          }
        ],
        "internalType": "struct Logger.Log_info",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "user_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "complaint_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "event_type",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "date",
        "type": "string"
      }
    ],
    "name": "log",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "log_info",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "user_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "complaint_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "event_type",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "date",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const caver = new CaverExtKAS();
caver.initKASAPI(1001, process.env.accessKeyId, process.env.secretKeyId, {
  useNodeAPIWithHttp: false,
});

const keyringContainer = new caver.keyringContainer();
const keyring =
  keyringContainer.keyring.createFromPrivateKey(process.env.private_key);
keyringContainer.add(keyring);


// setInterval(async () => {
//   try {
//     const block = await caver.rpc.klay.getBlockNumber();
//   } catch (err) {
//     console.error(err);
//   }
// }, "30000");

const loggerContract = new caver.klay.Contract(
  loggerabi,
  process.env.contract_address
);
loggerContract.setWallet(keyringContainer);

export async function Log(user_id, complaint_id, event_type, date) {
  try {

    await loggerContract.methods.log(user_id, complaint_id, event_type, date).send({
      from: keyring.address,
      gas: 1000000
    })
  } catch (e) {
    console.log(e)
  }

}