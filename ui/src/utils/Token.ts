
import { AccountInfo, AccountLayout, MintInfo, MintLayout } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { getAccountInfo } from "./FetchAccount";
import { u64 } from '@solana/spl-token';

export type TokenAccountInfo = AccountInfo;

export function decodeTokenAccountInfo(buffer: Buffer): AccountInfo {
    let accountInfo: AccountInfo = AccountLayout.decode(buffer);

    // todo(ngundotra): figure out why BN is invoked when accessing accountInfo.address???
    let tokenPubkey = new PublicKey(buffer.slice(0, 32));
    let mintPubkey = new PublicKey(accountInfo.mint);

    accountInfo.address = tokenPubkey;
    accountInfo.mint = mintPubkey;

    return accountInfo;
}

/**
 * Parse and return amount of a given token in an account.
 *
 * @param tokenInfo This can be found via decodeTokenAccountInfo()
 * @param mintInfo This can be found via getTokenInfo()
 * @returns Amount of tokens in account
 */
export function getTokenAmount(tokenInfo: AccountInfo, decimals: number | null) {
    let amount = u64
        .fromBuffer(tokenInfo.amount as unknown as Buffer)
        .toNumber();
    let output = decimals ? amount / 10 ** decimals! : amount;
    console.log("provided decimals: ", decimals, " amount: ", amount, " output: ", output);
    return output;
}

export async function getMintInfo(pubkey: PublicKey): Promise<MintInfo> {
    let accountInfo = await getAccountInfo(pubkey, false);
    if (!accountInfo)
        throw new Error("Mint info for token is null");

    let mintInfo: MintInfo = MintLayout.decode(accountInfo.data);
    return mintInfo;
}