
import { AccountInfo, AccountLayout, MintInfo, MintLayout, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
export type TokenAccountInfo = AccountInfo;
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