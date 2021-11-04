import * as React from "react";
import { useRouter } from "next/router";

import { Box, Grid } from "@chakra-ui/react";

import Header from "../../components/Header";
import TokensView from "../../components/TokensView";

export default function ProfilePage() {
    const router = useRouter();
    let { address } = router.query;

    return (
        <Box textAlign="center" fontSize="xl" px={30} py={20}>
            <Header addr={address} />
            <TokensView addr={address} />
        </Box>
    );
}
