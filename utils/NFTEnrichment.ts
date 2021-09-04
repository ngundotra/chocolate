import {
    PublicKey,
} from '@solana/web3.js';

import {
    NFT_PUBKEY,
} from './Constants';
import {
    getConnection
} from './Connection';

export async function getNFTs(publicKey: PublicKey): Promise<Array<String>> {
    let progId = "A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7";
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey(progId) },
    );
    console.log(tokenList);
    return( ["Penis!"] );
}

getNFTs(NFT_PUBKEY).then(
    (value: String[]) => console.log("done!")
)