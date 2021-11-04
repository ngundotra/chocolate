import * as React from "react";
import CollectiblesView from "./CollectiblesView";
import FungiblesView from "./FungiblesView";
import { Box, Text, Spinner } from "@chakra-ui/react";
import Star from "../components/Star";
import WalletName from "../components/WalletName";

import { render } from "react-dom";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export default function TokensView(props: any) {
    const [numTokensLoading, setTokenLoading] = React.useState(0);

    return (
        <Box px="20px">
            <Box>
                <Box d="inline-flex" alignItems="center">
                    <WalletName addr={props.addr} />
                    <Star addr={props.addr} />
                </Box>
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
