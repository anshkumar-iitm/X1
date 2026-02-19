import algosdk from 'algorand-sdk';

const ALGOD_SERVER = process.env.VITE_ALGORAND_SERVER || 'https://mainnet-api.algonode.cloud';
const ALGOD_PORT = 443;
const ALGOD_TOKEN = '';

let algodClient: any = null;

function getAlgodClient() {
  if (!algodClient) {
    algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
  }
  return algodClient;
}

export async function getAccountInfo(address: string) {
  try {
    const client = getAlgodClient();
    const accountInfo = await client.accountInformation(address).do();
    return {
      address,
      amount: accountInfo.amount / 1e6, // Convert from microAlgos to Algos
      amountWithoutPendingRewards: accountInfo['amount-without-pending-rewards'] / 1e6
    };
  } catch (error) {
    console.error('Failed to get account info:', error);
    throw error;
  }
}

export async function getTransactionParams() {
  try {
    const client = getAlgodClient();
    const params = await client.getTransactionParams().do();
    return params;
  } catch (error) {
    console.error('Failed to get transaction params:', error);
    throw error;
  }
}

export async function sendPayment(
  sender: string,
  signer: any,
  receiver: string,
  amount: number
) {
  try {
    const client = getAlgodClient();
    const params = await getTransactionParams();

    // Convert amount from Algos to microAlgos
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      amount: Math.round(amount * 1e6),
      suggestedParams: params
    });

    // Sign transaction with MyAlgo
    const signedTxn = await signer.signTxn([txn]);
    const txId = signedTxn[0].txID;

    // Send transaction
    await client.sendRawTransaction(signedTxn[0].blob).do();

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);

    return {
      txId,
      amount,
      receiver,
      sender,
      confirmedRound: confirmedTxn['confirmed-round']
    };
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
}

export function getExplorerUrl(txId: string) {
  return `https://allo.info/tx/${txId}`;
}

export default {
  getAlgodClient,
  getAccountInfo,
  getTransactionParams,
  sendPayment,
  getExplorerUrl
};
