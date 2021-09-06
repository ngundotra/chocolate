import * as React from "react";

import { Box, Grid, Image } from "@chakra-ui/react";

import { CollectiblesView } from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { NFT_ADDR } from "./utils/Constants";

export function ProfilePage() {
    return (
        <Grid minH="100vh" p={3}>
            <Box marginTop="50px">
                <h1>Pubkey: {NFT_ADDR.toString()}</h1>
            </Box>
            <CollectiblesView />
            <FungiblesView />
        </Grid>
    );
}
