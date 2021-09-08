import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const accountInfoCache = new CacheContainer(new MemoryStorage());
// CACHE EXPIRY: 120s (2min)
const TTL = 120000000;

/**
 * Get list of all tokens on Solana
 *
 * @returns Array of TokenInfo objects
 */
async function getRegistry() {
    return new TokenListProvider().resolve().then((tokens) => {
        const tokenList = tokens.filterByClusterSlug("mainnet-beta").getList();
        return tokenList;
    });
}

/**
 * Returns list of all tokens on Solana. Checks cache if list of tokens
 * exists. If not, add list to cache.
 *
 * NOTE: Currently, cache does not work (threads?)
 *
 * @returns Array of TokenInfo objects
 */
async function getTokenListCached() {
    const cachedAccountInfo = await accountInfoCache.getItem<
        TokenInfo[] | null
    >("tokenRegistry");

    if (typeof cachedAccountInfo !== "undefined") {
        return cachedAccountInfo;
    }

    let tokenRegistry = await getRegistry();

    await accountInfoCache.setItem("tokenRegistry", tokenRegistry, {
        ttl: TTL,
    });
    return tokenRegistry;
}

/**
 * Returns dictionary of token address to token info
 *
 * @returns Map of {address : TokenInfo}
 */
export async function getTokenMap() {
    let tokenRegistry = await getTokenListCached();
    if (tokenRegistry != null) {
        return tokenRegistry.reduce(
            (map: { [address: string]: TokenInfo }, tokenInfo) => {
                map[tokenInfo.address] = tokenInfo;
                return map;
            },
            {}
        );
    }
}

/**
 * Given address, return token's mint info. Return null if token does not exist.
 *
 * @param mintAddress Address of mint
 * @returns TokenInfo object of given address
 */
export async function getTokenInfo(mintAddress: String) {
    let tokenRegistry = await getTokenListCached();
    if (tokenRegistry != null) {
        for (let i = 0; i < tokenRegistry.length; i++) {
            let tokenInfo = tokenRegistry[i];
            if (tokenInfo.address === mintAddress) {
                return tokenInfo;
            }
        }
    }
    return null;
}

/**
 * Given address, return token name. Return null if token does not exist.
 *
 * @param mintAddress
 * @returns name of token given address
 */
export async function getTokenName(mintAddress: String) {
    let tokenInfo = await getTokenInfo(mintAddress);

    return tokenInfo ? tokenInfo.name : null;
}
