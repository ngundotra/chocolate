import { getConnection } from "./Connection";
import { PUBKEY, TOKEN_PROGRAM_ID } from "./Constants";
import { u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { decodeTokenAccountInfo } from "./Token";
import { getTokenInfo, getTokenName } from "./TokenRegistry";
import { TokenInfo } from "@solana/spl-token-registry";
const CoinGecko = require("coingecko-api");

// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

// DEMO
async function demo() {
    // Target account
    let account = PUBKEY;
    // Get wallet data
    let walletData = await getFungibleTokens(account);

    // Print wallet net worth
    console.log("Wallet value: ", walletData.netWorth);

    // Print each token owned
    for (let i = 0; i < walletData.tokens.length; i++) {
        let token: any = walletData.tokens[i];
        console.log(
            token.name.padEnd(10).substring(0, 10),
            "\t\t\tAmount: ",
            (Math.floor(token.amount * 100) / 100).toFixed(2),
            "\t\t\tPrice: ",
            (Math.floor(token.price * 100) / 100).toFixed(2),
            "\t\t\tValue: ",
            token.price * token.amount
        );
    }
}
demo();

/**
 * Get all fungible tokens for given account and return tokens with
 * relevant data.
 *
 * @param accountAddr PublicKey of target token account
 * @returns Wallet data wrapped in promise
 */
async function getFungibleTokens(accountAddr: PublicKey) {
    // Connect to chain
    let connection = getConnection();

    // Get tokens in account
    let tokenRes = await connection.getTokenAccountsByOwner(accountAddr, {
        programId: TOKEN_PROGRAM_ID,
    });
    let tokens = tokenRes.value;

    // Initialize coin gecko and wallet data
    let coinMap = await getCoinMap();
    let tokenArr: any[] = [];
    let walletData = {
        addr: accountAddr.toString(),
        netWorth: 0,
        tokens: tokenArr,
    };

    for (let i = 0; i < tokens.length; i++) {
        let currToken = tokens[i];
        let tokenInfo = decodeTokenAccountInfo(currToken.account.data);
        let mintAddr = new PublicKey(tokenInfo.mint).toString();

        let tokenName = await getTokenName(mintAddr);

        // Continue if token exists in registry
        if (tokenName != null) {
            let mintInfo = await getTokenInfo(mintAddr);

            let amount = getTokenAmount(tokenInfo, mintInfo);
            let price = await getTokenPrice(mintInfo, coinMap);

            // Add relevant tokendata to wallet data
            let newToken = {
                name: tokenName,
                amount: amount,
                price: price,
                image: mintInfo && mintInfo.logoURI,
            };
            walletData.tokens.push(newToken);

            // Update wallet total net worth
            let value = amount * price;
            walletData.netWorth += value;
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
    let amount = u64.fromBuffer(<Buffer>(<unknown>tokenInfo.amount)).toNumber();
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
    if (tokenId == null || tokenId == "") {
        return 0;
    }
    let response = await CoinGeckoClient.coins.fetch(tokenId, {
        tickers: false,
        developer_data: false,
        community_data: false,
        localization: false,
    });
    return response.data.market_data.current_price.usd;
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
