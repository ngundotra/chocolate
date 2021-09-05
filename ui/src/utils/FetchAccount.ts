/*

Caches one off queries for specific Pubkey data

*/

import { AccountInfo, PublicKey } from "@solana/web3.js";
import { getConnection } from "./Connection";
import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import { TokenAccountInfo } from "./Token";

const accountInfoCache = new CacheContainer(new MemoryStorage());
// CACHE EXPIRY: 120s (2min) 
const TTL = 120;

export async function getAccountInfo(pubkey: PublicKey, refreshCache: boolean): Promise<AccountInfo<Buffer> | null> {
    const cachedAccountInfo = await accountInfoCache.getItem<AccountInfo<Buffer> | null>(pubkey.toString());

    if (cachedAccountInfo) {
        return cachedAccountInfo;
    } 

    let connection = getConnection();
    let accountInfo = connection.getAccountInfo(pubkey);
    await accountInfoCache.setItem(pubkey.toString(), accountInfo, {ttl: TTL});
    return accountInfo;
} 