import * as React from "react";

import { Box, Grid, Spacer } from "@chakra-ui/react";

import { CollectiblesView } from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { ADDR, NFT_ADDR } from "./utils/Constants";
import { useParams } from 'react-router-dom';
import Header from "./Header";

export type ProfilePageParams = {
    id: string,
};

type UrlParams = {
    address: string,
} 

export function ProfilePage() {
    let { address } = useParams<UrlParams>();
    // todo(ngundotra): setup isLoading/needsRedirect/redirectAddr state
    const [addr, setAddr] = React.useState(address);

    return (
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p="40px">
                <Header addr={addr} updateAddr={setAddr} />
                <FungiblesView addr={addr}/>
                <CollectiblesView addr={addr} />
            </Grid>
        </Box>
    );
}
