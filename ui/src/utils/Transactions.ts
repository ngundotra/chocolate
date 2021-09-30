import {
    PublicKey,
    ConfirmedSignatureInfo,
    Connection,
    ParsedConfirmedTransaction,
    ParsedInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokenInfo } from "./FungibleTokenRegistry";
import { getConnection } from './Connection';
import { TokenInfo } from '@solana/spl-token-registry';
import { WRAPPED_SOL_MINT } from './metaplex/programIds';

const SOLANA_TO_LAMPORTS = 0.000000001;

export async function getAllSuccessfulTransactions(publicKey: PublicKey, connection: Connection): Promise<Array<ConfirmedSignatureInfo>> {
    let transactionList = await connection.getConfirmedSignaturesForAddress2(publicKey)
    return transactionList.filter(tx => tx.err === null)
}

export async function getSuccessfulTokenTransactions(publicKey: PublicKey, transactions: Array<ConfirmedSignatureInfo>, connection: Connection, tokenMap: {
    [address: string]: TokenInfo;
} | undefined): Promise<AccountTransactions> {
    var transactionSignatures: string[] = []
    transactions.forEach(tx => { transactionSignatures.push(tx.signature); })
    // get all completed transaction info and determine which ones are swap transactions
    var parsedSplTokenTransactions = (await connection.getParsedConfirmedTransactions(transactionSignatures))
        .filter(
            tx => tx?.transaction.message.instructions?.find(
                instruction => (instruction as ParsedInstruction).program !== undefined && ((instruction as ParsedInstruction).program === "spl-token")
            ) !== undefined
        );
    let accountTransaction = {
        tokenSwapTransactions: []
    }
    let tokenAccounts = await getTokenAccountsForUser(connection, publicKey)
    parsedSplTokenTransactions.forEach(tx => populateAccountTransaction(tx, accountTransaction, connection, tokenAccounts, tokenMap))

    return accountTransaction
}

async function populateAccountTransaction(tx: (ParsedConfirmedTransaction | null), accountTransaction: AccountTransactions, connection: Connection, tokenAccounts: Set<PublicKey>, tokenMap: {
    [address: string]: TokenInfo;
} | undefined) {
    let balanceChangeMap = generateBalanceChangeMap(tx, connection);

    var swapTransaction: FungibleTokenSwapTransaction = {
        swappedToken: "",
        swappedTokenImg: undefined,
        swappedTokenAmt: 0,
        receivedToken: "",
        receivedTokenImg: undefined,
        receivedTokenAmt: 0
    }

    Array.from(balanceChangeMap.keys()).forEach(pubKey => {
        // if true this means we've encountered a wallet address owned by the owner
        if (tokenAccounts.has(pubKey)) {
            let accountMap = balanceChangeMap.get(pubKey)
            if (accountMap !== undefined) {
                if (accountMap.size != 1) {
                    throw new Error("account can't have more than one type of token");
                }

                // go through entries and populate valid tokens
                Array.from(accountMap.entries()).forEach(mintToAmt => {
                    let mint = mintToAmt[0]
                    let amt = mintToAmt[1]
                    if (tokenMap !== undefined && isValidToken(mintToAmt[0], tokenMap)) {
                        let name = tokenMap[mint].name
                        let img = tokenMap[mint].logoURI
                        if (mintToAmt[1] < 0) {
                            swapTransaction.swappedToken = name
                            swapTransaction.swappedTokenImg = img
                            swapTransaction.swappedTokenAmt = -amt
                        } else {
                            swapTransaction.receivedToken = name
                            swapTransaction.receivedTokenImg = img
                            swapTransaction.receivedTokenAmt = amt
                        }
                    }
                });
            }
        }
    });

    // this means we've encountered a case where the user has swapped solana for another token (and hence have used wrapped solana)
    if (swapTransaction.receivedToken !== "" && swapTransaction.swappedToken === "") {
        let fee = tx?.meta?.fee
        let wrappedSolInfo = tokenMap ? tokenMap[WRAPPED_SOL_MINT.toString()] : await getTokenInfo(WRAPPED_SOL_MINT.toString())
        if (fee && wrappedSolInfo !== null) {
            // since fee is in lamports
            swapTransaction.swappedTokenAmt = convertLamportsToSol(fee)
            swapTransaction.swappedToken = wrappedSolInfo?.name
            swapTransaction.swappedTokenImg = wrappedSolInfo.logoURI
        }

    }

    if (swapTransaction.swappedToken !== "" && swapTransaction.receivedToken !== "") {
        accountTransaction.tokenSwapTransactions.push(swapTransaction)
        console.log(swapTransaction)
    }
}

async function getTokenAccountsForUser(connection: Connection, publicKey: PublicKey): Promise<Set<PublicKey>> {
    let tokenRes;
    try {
        tokenRes = await connection.getTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
        });
    } catch {
        throw new Error("Couldn't load user data");
    }
    return new DeepSet(tokenRes.value.map(info => info.pubkey))
}

function convertLamportsToSol(lamports: number) {
    return lamports * SOLANA_TO_LAMPORTS
}

function generateBalanceChangeMap(tx: (ParsedConfirmedTransaction | null), connection: Connection): Map<PublicKey, Map<string, number>> {
    let balanceChangeMap = new Map<PublicKey, Map<string, number>>()

    // grab pre and post balances for the transaction as well as the relevant accounts
    let preBalances = tx?.meta?.preTokenBalances
    let postBalances = tx?.meta?.postTokenBalances
    let pubKeyList = tx?.transaction.message.accountKeys

    if (preBalances !== null && postBalances !== null) {
        // add the post balances to the map as if it's the starting amount
        postBalances?.forEach(post => {
            if (pubKeyList !== undefined) {
                let account = pubKeyList[post.accountIndex].pubkey
                if (post.uiTokenAmount.uiAmount) {
                    balanceChangeMap.has(account) ? balanceChangeMap.get(account)?.set(post.mint, post.uiTokenAmount.uiAmount) :
                        balanceChangeMap.set(account, new Map([[post.mint, post.uiTokenAmount.uiAmount]]))
                }
            }
        })

        // subtract the prebalances from the map to get the result, ignoring accounts/tokens not in post balances
        preBalances?.forEach(pre => {
            if (pubKeyList !== undefined) {
                let account = pubKeyList[pre.accountIndex].pubkey
                if (balanceChangeMap.has(account)) {
                    if (balanceChangeMap.get(account)?.has(pre.mint)) {
                        let uiAmt = balanceChangeMap.get(account)?.get(pre.mint)
                        if (uiAmt && pre.uiTokenAmount.uiAmount) {
                            balanceChangeMap.get(account)?.set(pre.mint, uiAmt - pre.uiTokenAmount.uiAmount)
                        }
                    }
                }
            }
        })
    }

    return balanceChangeMap
}

export function isValidToken(mint: string, tokenMap: {
    [address: string]: TokenInfo;
}): boolean {
    return tokenMap[mint] !== undefined;
}

export async function retrieveAccountTransactionsObject(publicKey: PublicKey, tokenMap: {
    [address: string]: TokenInfo;
} | undefined): Promise<AccountTransactions> {
    let connection = getConnection();

    let transactions = await getAllSuccessfulTransactions(publicKey, connection)
    return await getSuccessfulTokenTransactions(publicKey, transactions, connection, tokenMap);
}

export type AccountTransactions = {
    tokenSwapTransactions: Array<FungibleTokenSwapTransaction>
}

export type FungibleTokenSwapTransaction = {
    swappedToken: string
    swappedTokenImg: string | undefined
    swappedTokenAmt: number
    receivedToken: string
    receivedTokenImg: string | undefined
    receivedTokenAmt: number
}

export class DeepSet<T> extends Set<T> {

    add(o: T) {
        for (let i of Array.from(this.values()))
            if (this.deepCompare(o, i))
                return this;
        super.add.call(this, o);
        return this;
    };

    has(o: T) {
        for (let i of Array.from(this.values()))
            if (this.deepCompare(o, i))
                return true;
        return false;
    }

    private deepCompare(o: T, i: T) {
        return JSON.stringify(o) === JSON.stringify(i)
    }
}
