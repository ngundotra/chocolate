import * as React from "react";

import {
    Box,
    Grid,
    HStack,
    VStack,
    Table,
    Tr,
    Thead,
    Tbody,
    Td,
    Th,
    Text,
    Image
} from '@chakra-ui/react';
import { MetadataImage } from "./MetadataImage";
import { NFT_PUBKEY } from "./utils/Constants";
import { getMetadata } from "./utils/metaplex";
import { useState } from "react";
import { getNFTs } from "./utils/NFTEnrichment";

type CollectibleState = {
    url: string,
};

function renderTableData(collectibles: CollectibleState[]) {
    return collectibles.map((collectible,index) => {
        return (
            <Tr key={index}>
                <Td>{collectible.url}</Td>
                <Td><MetadataImage src={collectible.url} /></Td>
            </Tr>
        )
    });
}

export function CollectiblesView() {
    const initState = {
        isLoading: false,
        isLoaded: false,
        collectibles: [
            { url: "https://arweave.net/SICKW7qkU5_WZl7wZNbWc1FmBbqMJm79hfaf-AQ_NrE" },
        ]
    };
    const [appState, setAppState] = useState(initState);//useState(new Array<CollectibleState>(0));

    if (!appState.isLoading && !appState.isLoaded)
    {
        setAppState({
            isLoading: true,
            isLoaded: false,
            collectibles: appState.collectibles,
        });

        getNFTs(NFT_PUBKEY).then(
            (nfts) => {
                let collectibles = nfts.map((imageUrl) => { return {url: imageUrl.toString()} });
                setAppState({
                    isLoaded: true,
                    isLoading: false,
                    collectibles: collectibles,
                });
            },
            (reason) => {
                console.log("Could not get NFTs for pubkey provided: ", reason);
            }
        )
    }

    console.log("[appstate] ", appState);

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Url</Th>
                    <Th>Image</Th>
                </Tr>
            </Thead>
            <Tbody>
                {renderTableData(appState.collectibles)}
            </Tbody>
        </Table>
    )
}