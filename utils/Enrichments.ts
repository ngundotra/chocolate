import {
    Connection
} from '@solana/web3.js';
import {
    getConnection
} from './Connection';
import {
    PUBKEY,
} from './Constants';

async function main() {
    let connection = getConnection();
    let out = await connection.getBalance(PUBKEY);
    console.log(out);
}

main();