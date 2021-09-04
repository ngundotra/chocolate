import { getConnection } from "./Connection";
import { PUBKEY, TOKEN_PROGRAM_ID } from "./Constants";
import { Token } from '@solana/spl-token';
import { decodeTokenAccountInfo } from "./Token";

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
        console.log(token.pubkey);
        let tokenInfo = decodeTokenAccountInfo(token.account.data);
        console.log(tokenInfo);
        console.log("\n");
    });
}

main();
