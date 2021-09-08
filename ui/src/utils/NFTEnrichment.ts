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

export type NftEnrichment = {
    name: string,
    symbol: string,
    imageUrl: string,
    updateAuthority: string,
}

export async function getNftMetadataAccountInfo(mintPubkey: PublicKey): Promise<AccountInfo<Buffer> | null> {
    let metadataPubkeyId = await getMetadata(mintPubkey.toString());
    let metadataPubkey = new PublicKey(metadataPubkeyId);

    if (typeof metadataPubkey !== "undefined") {
        let accountInfo = await getAccountInfo(metadataPubkey, false);
        return accountInfo;
    };

    return null;
}

export async function getNFTs(publicKey: PublicKey): Promise<Array<NftEnrichment>> {
    let connection = getConnection();
    let tokenList = await connection.getTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID },
    );
    let tokens = tokenList.value;

    var nfts: NftEnrichment[] = []; 

    for(var i = 0; i < tokens.length; i++) {
        let tokenInfo = decodeTokenAccountInfo(tokens[i].account.data);
        // let mintInfo = await getMintInfo(new PublicKey(tokenInfo.mint));
        
        let metadataAccountInfo = await getNftMetadataAccountInfo(new PublicKey(tokenInfo.mint));
        if (typeof metadataAccountInfo === "undefined")
            continue;

        try {
            let onChainMetadata = decodeMetadata(metadataAccountInfo!.data);
            let uri = onChainMetadata.data.uri;
            let uriResponse = await axios.get(uri);
            var nftMetadata = uriResponse.data;
            let enrichment = {
                name: <string>nftMetadata.name,
                symbol: <string>nftMetadata.symbol,
                imageUrl: <string>nftMetadata.image,
                updateAuthority: onChainMetadata.updateAuthority,
            }
            nfts.push(enrichment);
        } catch (e) {
            console.error("NFT enrichment failed for token: ", tokenInfo.address, " reason: ", e);
        }
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