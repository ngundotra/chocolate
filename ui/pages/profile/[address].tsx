import * as React from "react";
import { useRouter } from "next/router";

import { Box, Grid } from "@chakra-ui/react";

import Header from "../../components/Header";
import TokensView from "../../components/TokensView";

export default function ProfilePage() {
    const router = useRouter();
    let { address } = router.query;

    return (
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p="40px">
                <Header addr={address} />
                <TokensView addr={address} />
            </Grid>
        </Box>
    );
}
