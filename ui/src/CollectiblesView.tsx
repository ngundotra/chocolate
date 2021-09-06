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
    Image,
    background
} from '@chakra-ui/react';
import { MetadataImage } from "./MetadataImage";
import { NFT_PUBKEY } from "./utils/Constants";
import { getMetadata } from "./utils/metaplex";
import { useState } from "react";
import { getNFTs } from "./utils/NFTEnrichment";
import './Loading.scss';

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

function renderDummyData() {
    return (
        <Tr>
            <Td>
                <Box width={500} height={100} className={'loading-element'} backgroundColor="purple.300" />
            </Td>
            <Td>
                <Box width={100} height={100} className={'loading-element'} />
            </Td>
        </Tr>
    )
}

export function CollectiblesView() {
    const initState = {
        isLoading: false,
        isLoaded: false,
        collectibles: Array<CollectibleState>(0),
            // { url: "https://arweave.net/SICKW7qkU5_WZl7wZNbWc1FmBbqMJm79hfaf-AQ_NrE" },
        // ]
    };
    const [state, setState] = useState(initState);

    if (!state.isLoading && !state.isLoaded)
    {
        setState({
            isLoading: true,
            isLoaded: false,
            collectibles: state.collectibles,
        });

        getNFTs(NFT_PUBKEY).then(
            (nfts) => {
                let collectibles = nfts.map((imageUrl) => { return {url: imageUrl.toString()} });
                console.log("should have loaded");
                setState({
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

    // console.log("[appstate] ", appState);
    if (state.isLoading)
        return (
            <Table>
                <Thead>
                    <Tr>
                        <Th>Url</Th>
                        <Th>Image</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {renderDummyData()} 
                </Tbody>
            </Table>
        )

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Url</Th>
                    <Th>Image</Th>
                </Tr>
            </Thead>
            <Tbody>
                {renderTableData(state.collectibles)} 
            </Tbody>
        </Table>
    )
}