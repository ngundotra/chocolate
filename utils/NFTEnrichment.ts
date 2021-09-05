import {
    PublicKey,
    AccountInfo,
} from '@solana/web3.js';
import { u64, Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { decodeTokenAccountInfo, getMintInfo } from './Token';
import { NFT_PUBKEY } from './Constants';
import { getConnection } from './Connection';
import { getAccountInfo } from './FetchAccount';
import { decodeMetadata, getMetadata, Metadata } from './metaplex';
import axios from 'axios';

export async function getNftMetadataAccountInfo(mintPubkey: PublicKey): Promise<AccountInfo<Buffer>> {
    let metadataPubkeyId = await getMetadata(mintPubkey.toString());
    let metadataPubkey = new PublicKey(metadataPubkeyId);

    if (typeof metadataPubkey !== "undefined")
    {
        let accountInfo = await getAccountInfo(metadataPubkey, false);
        return accountInfo;
    };

    return null;
}

export async function getNFTs(publicKey: PublicKey): Promise<Array<String>> {
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
    );
    let tokens = tokenList.value;

    var nfts: string[] = []; 

    for(var i = 0; i < tokens.length; i++) {
        let tokenInfo = decodeTokenAccountInfo(tokens[i].account.data);
        let mintInfo = await getMintInfo(new PublicKey(tokenInfo.mint));
        
        let metadataAccountInfo = await getNftMetadataAccountInfo(new PublicKey(tokenInfo.mint));
        // console.log("---------------------");
        // console.log("Found possible NFT!");
        let metadata = decodeMetadata(metadataAccountInfo.data);
        // console.log(metadata.data.uri);
        // console.log("---------------------");
        nfts.push(metadata.data.uri);
    }
    return(nfts);
}

getNFTs(NFT_PUBKEY).then(
    (value: string[]) => {
        value.forEach(
            (uri) => {
                axios.get(uri).then(
                    (response) => {
                        // console.log('\n');
                        // console.log(`${response.data.name} <${response.data.symbol}>`);
                        console.log(response.data.image ?? "no image");
                    }
                )
            }
        )
    } 
)