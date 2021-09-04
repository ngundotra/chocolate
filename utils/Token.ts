
// import * as BufferLayout from "@solana/buffer-layout";

// /**
//  * Layout for a public key
//  */
// const publicKey = (property: string = 'publicKey'): BufferLayout.Layout => {
//     return BufferLayout.blob(32, property);
// };
import { AccountInfo, AccountLayout } from "@solana/spl-token";

export function decodeTokenAccountInfo(buffer: Buffer): AccountInfo {
    let accountInfo: AccountInfo = AccountLayout.decode(buffer);
    return accountInfo;
}