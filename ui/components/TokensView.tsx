import * as React from "react";
import CollectiblesView from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { Box, Grid, Spacer, Text, Spinner } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

export default function TokensView(props: any) {
    const [numTokensLoading, setTokenLoading] = React.useState(0);
    return (
        <Box>
            <Box>
                <Text> {props.addr} </Text>
                <StarIcon />
            </Box>
            {numTokensLoading !== 0 ? (
                <Spinner />
            ) : (
                <Box>
                    <FungiblesView
                        addr={props.addr}
                        updateTokenLoading={setTokenLoading}
                    />
                    <CollectiblesView
                        addr={props.addr}
                        updateTokenLoading={setTokenLoading}
                    />
                </Box>
            )}
        </Box>
    );
}
