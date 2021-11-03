import { getConnection } from "./Connection";
import { PUBKEY } from "./Constants";
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from "@solana/web3.js";
import { decodeTokenAccountInfo, getMintInfo } from "./Token";

async function main() {
    let connection = getConnection();
    let acctBalance = await connection.getBalance(PUBKEY);
    getTokens();
}

async function getTokens() {
    let connection = getConnection();

    let tokenRes = await connection.getTokenAccountsByOwner(PUBKEY, {
        programId: TOKEN_PROGRAM_ID,
    });

    let tokens = tokenRes.value;

    tokens.forEach((token) => {
        let tokenInfo = decodeTokenAccountInfo(token.account.data);
        getMintInfo(new PublicKey(tokenInfo.mint)).then(
            (mintInfo) => {
                console.log("Token Info");
                console.log("---------------------");
                console.log(token.pubkey);
                console.log(tokenInfo);
                console.log(mintInfo);
                console.log("\n");
            }
        );
    });
}

main();
