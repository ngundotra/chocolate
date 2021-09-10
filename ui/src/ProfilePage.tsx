import * as React from "react";

import { Box, Grid } from "@chakra-ui/react";

import { CollectiblesView } from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { ADDR, NFT_ADDR } from "./utils/Constants";
import { useParams } from 'react-router-dom';
import Header from "./Header";

export type ProfilePageParams = {
    id: string,
};

export type ProfilePageProps = {
    useRandomAddress: boolean,
}

export function ProfilePage(props: ProfilePageProps) {
    let address: string;
    if (props.useRandomAddress) {
        address = NFT_ADDR;
    } else {
        address = ADDR; 
    }
    const [addr, setAddr] = React.useState(address);

    return (
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p="40px">
                <Header addr={addr} updateAddr={setAddr} />
                <FungiblesView addr={addr} />
                <CollectiblesView addr={addr} />
            </Grid>
        </Box>
    );
}
