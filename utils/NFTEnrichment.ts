import {
    PublicKey,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
    decodeTokenAccountInfo
} from './Token';
import {
    NFT_PUBKEY,
} from './Constants';
import {
    getConnection
} from './Connection';
import { forEach } from 'lodash';

export async function getNFTs(publicKey: PublicKey): Promise<Array<String>> {
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
    );
    let tokens = tokenList.value;

    var nfts = []; 
    tokens.forEach((token) => {
        let pubkey = token.pubkey;
        let tokenInfo = decodeTokenAccountInfo(token.account.data);
    });
    return( ["Penis!"] );
}

getNFTs(NFT_PUBKEY).then(
    (value: String[]) => console.log("done!")
)