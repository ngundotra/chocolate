import * as React from "react";

import {
    Box,
    Table,
    Tr,
    Thead,
    Tbody,
    Td,
    Th,
} from '@chakra-ui/react';
import { RedirectImage } from "./RedirectImage";
import { NFT_PUBKEY } from "./utils/Constants";
import { useState } from "react";
import { NftEnrichment, getNFTs } from "./utils/NFTEnrichment";
import './Loading.scss';


function renderTableData(collectibles: NftEnrichment[]) {
    return collectibles.map((collectible,index) => {
        return (
            <Tr key={index}>
                <Td>{collectible.symbol}</Td>
                <Td>{collectible.name}</Td>
                <Td>{collectible.updateAuthority}</Td>
                <Td><RedirectImage src={collectible.imageUrl} /></Td>
            </Tr>
        )
    });
}

function renderDummyData() {
    return (
        <Tr>
            <Td>
                <Box width={300} height={100} className={'loading-element'} backgroundColor="purple.300" />
            </Td>
            <Td>
                <Box width={300} height={100} className={'loading-element'} backgroundColor="purple.300" />
            </Td>
            <Td>
                <Box width={300} height={100} className={'loading-element'} backgroundColor="purple.300" />
            </Td>
            <Td>
                <Box width={100} height={100} className={'loading-element'} />
            </Td>
        </Tr>
    )
}

type TableSkeletonProps = {
    rows: JSX.Element[]
}
function tableSkeleton(props: TableSkeletonProps) {
    return ( 
        <Table>
            <Thead>
                <Tr>
                    <Th>Symbol</Th>
                    <Th>Name</Th>
                    <Th>Update Authority</Th>
                    <Th>Image</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.rows} 
            </Tbody>
        </Table>
    )
}

export function CollectiblesView() {
    const initState = {
        isLoading: false,
        isLoaded: false,
        collectibles: Array<NftEnrichment>(0),
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
            (collectibles) => {
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

    if (state.isLoading)
        return tableSkeleton({rows: [renderDummyData()]})

    return tableSkeleton({rows: renderTableData(state.collectibles)})
}