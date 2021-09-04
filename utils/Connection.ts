import {
    Connection,
    clusterApiUrl
} from '@solana/web3.js';

export function getConnection(): Connection {
    let conn = new Connection(clusterApiUrl('mainnet-beta'));
    return conn;
}