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

export async function getNftMetadataAccountInfo(mintPubkey: PublicKey): Promise<AccountInfo<Buffer> | null> {
    let metadataPubkeyId = await getMetadata(mintPubkey.toString());
    let metadataPubkey = new PublicKey(metadataPubkeyId);

    if (typeof metadataPubkey !== "undefined") {
        let accountInfo = await getAccountInfo(metadataPubkey, false);
        return accountInfo;
    };

    return null;
}

export async function getNFTs(publicKey: PublicKey): Promise<Array<any>> {
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
    );
    let tokens = tokenList.value;

    var nfts: string[] = []; 

    for(var i = 0; i < tokens.length; i++) {
        let tokenInfo = decodeTokenAccountInfo(tokens[i].account.data);
        // let mintInfo = await getMintInfo(new PublicKey(tokenInfo.mint));
        
        let metadataAccountInfo = await getNftMetadataAccountInfo(new PublicKey(tokenInfo.mint));
        if (typeof metadataAccountInfo === "undefined")
            continue;

        // console.log("---------------------");
        // console.log("Found possible NFT!");
        let onChainMetadata = decodeMetadata(metadataAccountInfo!.data);
        // console.log(metadata.data.uri);
        // console.log("---------------------");
        let uri = onChainMetadata.data.uri;
        let response = await axios.get(uri);
        // console.log(`enrichment: ${response.data.image}`);
        nfts.push(response.data);
    }
    return(nfts);
}

getNFTs(NFT_PUBKEY).then(
    (value) => {
        value.forEach(
            (imageUrl) => {
                console.log(imageUrl); 
            }
        )
    } 
)