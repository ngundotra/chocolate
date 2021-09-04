import {
    PublicKey,
} from '@solana/web3.js';

import {
    NFT_PUBKEY,
    TOKEN_PROGRAM_ID
} from './Constants';
import {
    getConnection
} from './Connection';

export async function getNFTs(publicKey: PublicKey): Promise<Array<String>> {
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
    );
    console.log(tokenList);
    return( ["Penis!"] );
}

getNFTs(NFT_PUBKEY).then(
    (value: String[]) => console.log("done!")
)