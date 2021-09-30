import { getConnection } from "./Connection";
import { u64, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { decodeTokenAccountInfo } from "./Token";
import { getTokenName } from "./FungibleTokenRegistry";
import { TokenInfo } from "@solana/spl-token-registry";
const CoinGecko = require("coingecko-api");

// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

/**
 * Get all fungible tokens for given account and return tokens with
 * relevant data.
 *
 * @param accountAddr PublicKey of target token account
 * @returns Wallet data wrapped in promise
 */
export async function getFungibleTokens(accountAddr: PublicKey, tokenMap: {
    [address: string]: TokenInfo;
} | undefined) {
    // Connect to chain
    let connection = getConnection();
    // Get tokens in account
    let tokenRes;
    try {
        tokenRes = await connection.getTokenAccountsByOwner(accountAddr, {
            programId: TOKEN_PROGRAM_ID,
        });
    } catch {
        throw new Error("Couldn't load user data");
    }

    let tokens = tokenRes.value;

    // Initialize CoinGecko map and wallet data
    let coinMap = await getCoinMap();
    let tokenArr: any[] = [];
    let walletData = {
        addr: accountAddr.toString(),
        netWorth: 0,
        tokens: tokenArr,
    };

    // Iterate through all tokens in account
    for (let i = 0; i < tokens.length; i++) {
        let currToken = tokens[i];
        let tokenInfo = decodeTokenAccountInfo(currToken.account.data);
        let mintAddr = new PublicKey(tokenInfo.mint).toString();

        let tokenName = await getTokenName(mintAddr);

        // Continue if token exists in registry
        if (tokenName != null && tokenMap != null) {
            let mintInfo = tokenMap[mintAddr];

            let amount = getTokenAmount(tokenInfo, mintInfo);

            // Filter out tokens with zero quantity
            if (amount > 0) {
                let price = await getTokenPrice(mintInfo, coinMap);

                // Add relevant tokendata to wallet data
                let newToken = {
                    name: tokenName,
                    amount: amount,
                    price: price,
                    website:
                        mintInfo &&
                        mintInfo.extensions &&
                        mintInfo.extensions.website,
                    image: mintInfo && mintInfo.logoURI,
                };
                walletData.tokens.push(newToken);

                // Update wallet total net worth
                let value = amount * price;
                walletData.netWorth += value;
            }
        }
    }
    return walletData;
}

/**
 * Parse and return amount of a given token in an account.
 *
 * @param tokenInfo This can be found via decodeTokenAccountInfo()
 * @param mintInfo This can be found via getTokenInfo()
 * @returns Amount of tokens in account
 */
function getTokenAmount(tokenInfo: any, mintInfo: TokenInfo | null) {
    if (mintInfo == null) {
        return 0;
    }
    let amount = u64
        .fromBuffer(tokenInfo.amount as unknown as Buffer)
        .toNumber();
    let decimals = mintInfo.decimals;
    return amount / 10 ** decimals;
}

/**
 * Gets current token price on coingecko
 *
 * @param tokenId Coingecko token id
 * @returns Price of token
 */
async function getTokenPriceById(tokenId: string) {
    if (tokenId == null || tokenId === "") {
        return 0;
    }
    try {
        let response = await CoinGeckoClient.coins.fetch(tokenId, {
            tickers: false,
            developer_data: false,
            community_data: false,
            localization: false,
        });
        return response.data.market_data.current_price.usd;
    } catch {
        throw new Error("Couldn't load data from CoinGecko");
    }
}

/**
 * Gets current token price on coingecko
 *
 * @param ticker Ticker of token
 * @param coinMap Mapping of {ticker : coingecko id}
 * @returns
 */
async function getTokenPriceByTicker(
    ticker: string,
    coinMap: { [symbol: string]: string }
) {
    let tokenId = coinMap[ticker];

    return await getTokenPriceById(tokenId);
}

/**
 * Gets current token price on coingecko
 *
 * @param mintInfo This can be found via getTokenInfo()
 * @param coinmap Mapping of {ticker : coingecko id}
 * @returns
 */
async function getTokenPrice(
    mintInfo: TokenInfo | null,
    coinmap: { [symbol: string]: string }
) {
    if (mintInfo == null) {
        return 0;
    }
    let ticker = mintInfo.symbol.toLowerCase();
    return await getTokenPriceByTicker(ticker, coinmap);
}

/**
 * Gets mapping of all tokens in coin gecko for future calls.
 *
 * @returns Mapping of {ticker : coingecko id}
 */
async function getCoinMap() {
    let res = await CoinGeckoClient.coins.list();
    let coinList = res.data;

    if (coinList != null) {
        return coinList.reduce(
            (map: { [symbol: string]: string }, tokenInfo: any) => {
                map[tokenInfo.symbol] = tokenInfo.id;
                return map;
            },
            {}
        );
    }
}
