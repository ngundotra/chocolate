import {
    Connection,
    clusterApiUrl
} from '@solana/web3.js';

var localConnection: Connection | null = null;

export function getConnection(): Connection {
    if (!localConnection)
        localConnection = new Connection(clusterApiUrl('mainnet-beta'));
    return localConnection;
}