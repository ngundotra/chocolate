import { METAPLEX_PROGRAM_ID } from './Constants';
import { getConnection } from './Connection';
import { PublicKey } from '@solana/web3.js';
import { decodeTokenAccountInfo, getMintInfo } from './Token';
import { decodeMetadata } from './metaplex';
import axios from 'axios';

// extendBorsh();
let conn = getConnection();
// conn.getProgramAccounts(METAPLEX_PROGRAM_ID, {dataSlice: {length: 100, offset: 0}}).then(
//     (accounts) => {
//         console.log("Valid program id");
//         console.log(accounts);
//     },
//     (reason) => {
//         console.error("Invalid program id: ", reason);
//     }
// )

let mint_id = "EBAA3PK3gnFffbNrF6TBfiJHkUXPx4nvTakFSQqyauSF";
let mintPubkey = new PublicKey(mint_id);
// console.log(tokenPubkey.toString() === tokenId);

// getMintInfo(tokenPubkey).then(
//     (mintInfo) => {
//         console.log("We valid doe: ", mintInfo);
//     },
//     (reason) => {
//         console.error("fuck me: ", reason);
//     }
// );
// conn.getAccountInfo(tokenPubkey).then(
//     (tokenInfo) => {
//         console.log(tokenInfo);
//         let tokenData = (tokenInfo.data.slice(0,81));
//         console.log(tokenData);
//         console.log((new PublicKey(tokenData.mint)).toString());
//     },
//     (reason) => {
//         console.error("fuck me: ", reason);
//     }
// )

let prefix = Buffer.from("metadata");
let seeds = [prefix, METAPLEX_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()];
console.log('seeds: ', seeds);
PublicKey.findProgramAddress(
    seeds,
    METAPLEX_PROGRAM_ID,
).then(
    ([pubkey, bump_seeds]) => {
        console.log("found metadata pubkey: ", pubkey);
        conn.getAccountInfo(pubkey).then(
            (accountInfo) => {
                console.log("we valid: ", accountInfo);
                let metadata = decodeMetadata(accountInfo.data);
                console.log("[METAPLEX]uri: ", metadata.data.uri);
                axios.get(
                    metadata.data.uri,
                ).then(
                    (response) => { console.log("[URI]", response.data)},
                    (reason) => { console.error("failed to fetch URI: ", reason) },
                )
            },
            (reason) =>  {
                console.error("unable to fetch metadata: ", reason);
            }
        );
    },
    (reason) =>  {
        console.error("unable to create pubkey: ", reason);
    }
)
