
// import * as BufferLayout from "@solana/buffer-layout";

// /**
//  * Layout for a public key
//  */
// const publicKey = (property: string = 'publicKey'): BufferLayout.Layout => {
//     return BufferLayout.blob(32, property);
// };
import { AccountInfo, AccountLayout, MintInfo, MintLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { getAccountInfo } from "./FetchAccount";

export function decodeTokenAccountInfo(buffer: Buffer): AccountInfo {
    let accountInfo: AccountInfo = AccountLayout.decode(buffer);
    return accountInfo;
}

export async function getMintInfo(pubkey: PublicKey): Promise<MintInfo> {
    let accountInfo = await getAccountInfo(pubkey, false);
    if (!accountInfo)
        throw new Error("Mint info for token is null");

    let mintInfo: MintInfo = MintLayout.decode(accountInfo.data);
    return mintInfo;
}

export type TokenAccountInfo = AccountInfo;