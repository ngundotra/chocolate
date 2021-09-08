import * as React from "react";

import { Grid } from "@chakra-ui/react";

import { CollectiblesView } from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { NFT_ADDR } from "./utils/Constants";
import Header from "./Header";

export function ProfilePage() {
    const [addr, setAddr] = React.useState(NFT_ADDR.toString());
    return (
        <Grid minH="100vh" p="40px">
            <Header addr={addr} updateAddr={setAddr} />
            <FungiblesView addr={addr} />
            <CollectiblesView addr={addr} />
        </Grid>
    );
}
