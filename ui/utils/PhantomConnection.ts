import { resolve } from "dns";
import React from "react";

function isPhantomInstalled() {
    return window && window.solana && window.solana.isPhantom ? true : false;
}

export function phantomConnect() {
    if (isPhantomInstalled() === true) {
        try {
            window.solana.connect();
        } catch (e) {
            console.error("Error connecting to Phantom Wallet", e);
        }
    } else {
        // Open Phantom webpage
        window.open("https://phantom.app/", "_blank");
    }
}

export function isPhantomConnected() {
    return window.solana && window.solana.isConnected === true;
}

export function SetupPhantom(): Promise<string> {
    phantomConnect();
    return new Promise((resolve, reject) => {
        window.solana.on("connect", () => {
            console.log("connected!");
            resolve(window.solana.publicKey.toString());
        });
    });
}
