import BufferLayout from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';

/**
* Layout for a public key
*/
export const publicKey = (property = 'publicKey'): unknown => {
    const publicKeyLayout = BufferLayout.blob(32, property);
    
    const _decode = publicKeyLayout.decode.bind(publicKeyLayout);
    const _encode = publicKeyLayout.encode.bind(publicKeyLayout);
    
    publicKeyLayout.decode = (buffer: Buffer, offset: number) => {
        const data = _decode(buffer, offset);
        return <Buffer><unknown>(new PublicKey(data));
    };
    
    publicKeyLayout.encode = (key: Buffer, buffer: Buffer, offset: number) => {
        return _encode((<PublicKey><unknown>key).toBuffer(), buffer, offset);
    };
    
    return publicKeyLayout;
}

/**
* Layout for a Rust String type
*/
export const rustString = (property = 'string'): unknown => {
    const rsl = BufferLayout.struct(
        [
            BufferLayout.u32('length'),
            BufferLayout.u32('lengthPadding'),
            BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), 'chars'),
        ],
        property,
    );
    const _decode = rsl.decode.bind(rsl);
    const _encode = rsl.encode.bind(rsl);
    
    rsl.decode = (buffer: Buffer, offset: number) => {
        const data = _decode(buffer, offset);
        return data.chars.toString('utf8');
    };
    
    rsl.encode = (str: Buffer, buffer: Buffer, offset: number) => {
        const data = {
            chars: Buffer.from(<string><unknown>str, 'utf8'),
        };
        return _encode(data, buffer, offset);
    };
    
    return rsl;
};