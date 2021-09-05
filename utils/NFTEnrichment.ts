import {
    PublicKey,
    AccountInfo,
} from '@solana/web3.js';
import { u64, Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { decodeTokenAccountInfo, getMintInfo } from './Token';
import { NFT_PUBKEY } from './Constants';
import { getConnection } from './Connection';
import { getAccountInfo } from './FetchAccount';


let METAPLEX_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
let METAPLEX_METADATA_PREFIX = "metadata";

export async function getNFTMetadataAccountInfo(mintPubkey: PublicKey): Promise<AccountInfo<Buffer>> {
    let seeds = [Buffer.from(METAPLEX_METADATA_PREFIX), METAPLEX_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()];
    console.log('seeds: ', seeds);
    let metadataPubkey = await PublicKey.findProgramAddress(
        seeds,
        METAPLEX_PROGRAM_ID,
    )[0];

    console.log("metadata pubkey: ", metadataPubkey);

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
    tokens.forEach((token) => {
        let tokenInfo = decodeTokenAccountInfo(token.account.data);
        getMintInfo(new PublicKey(tokenInfo.mint)).then(
            (mintInfo) => {
                getNFTMetadataAccountInfo(new PublicKey(tokenInfo.mint)).then(
                    (accountInfo) => {
                        console.log("---------------------");
                        console.log("Found possible NFT!");
                        console.log("mintInfo: ", mintInfo);
                        // console.log(token.pubkey.toString());
                        // console.log((new PublicKey(mintInfo.mintAuthority!)).toString());
                        console.log(accountInfo);
                        console.log("---------------------");
                        nfts.push(token.pubkey.toString());
                    },
                    (error) => {
                        console.error("error'd", error);
                    }
                )
            }
        );
    });

    //     getMintInfo(new PublicKey(tokenInfo.mint)).then(
    //         (mintInfo) => {
    //             let supply = u64.fromBuffer(<Buffer><unknown>(mintInfo.supply));
    //             let one = u64.fromBuffer(Buffer.from(
    //                 [1,0,0,0,0,0,0,0]
    //             ));
    //             if (typeof accountInfo !== "undefined")
    //             {
    //                 console.log("---------------------");
    //                 console.log("Found possible NFT!");
    //                 // console.log(token.pubkey.toString());
    //                 // console.log((new PublicKey(mintInfo.mintAuthority!)).toString());
    //                 console.log(accountInfo);
    //                 console.log("---------------------");
    //                 nfts.push(token.pubkey.toString());
    //             };
    //         }
    //     );
    // });
    return( ["Penis!"] );
}

getNFTs(NFT_PUBKEY).then(
    (value: String[]) => console.log("done!")
)