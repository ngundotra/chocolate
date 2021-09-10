import {
    PublicKey,
    AccountInfo,
} from '@solana/web3.js';
import { u64, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { decodeTokenAccountInfo, getMintInfo, getTokenAmount } from './Token';
import { NFT_PUBKEY } from './Constants';
import { getConnection } from './Connection';
import { getAccountInfo } from './FetchAccount';
import { decodeMetadata, getMetadata } from './metaplex';
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

        let mintAddr = new PublicKey(tokenInfo.mint);
        let mintInfo = await getMintInfo(new PublicKey(tokenInfo.mint));

        let amount = getTokenAmount(tokenInfo, mintInfo.decimals); 
        console.log(`Token Addr: ${tokenInfo.address}: ${tokenInfo}`);
        console.log(`Mint Addr: ${mintAddr.toString()}: ${tokenInfo}`);
        // let tokenAddr = new PublicKey(tokenInfo.address);
        // console.log(`${tokenAddr.toString()} Token amount: ${amount}`);
        // if (tokenInfo.amount?.toNumber() == 0)
        //     continue;
        
        let metadataAccountInfo = await getNftMetadataAccountInfo(mintAddr);
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