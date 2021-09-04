import { getConnection } from "./Connection";
import { PUBKEY, TOKEN_PROGRAM_ID } from "./Constants";

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
        console.log(token);
    });
}

main();
