import * as React from "react";
import {
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Text,
    Spacer,
} from "@chakra-ui/react";
import Router from "next/router";
import { useCookies } from "react-cookie";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export default function Header(props: any) {
    React.useEffect(() => {
        setDoRedirect(false);
        setWatchlist(false);
        setAddr("");
    }, [props.addr]);

    const [addr, setAddr] = React.useState("");
    const [doRedirect, setDoRedirect] = React.useState(false);
    const [openWatchlist, setWatchlist] = React.useState(false);
    const [nicknameCookies] = useCookies(["nicknames"]);
    const [watchlistCookies] = useCookies(["watchlist"]);

    const handleClick = () => {
        if (addr !== "") {
            setDoRedirect(true);
        }
    };

    const handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            handleClick();
        }
    };

    React.useEffect(() => {
        if (doRedirect) {
            Router.push(`/profile/${addr}`);
        }
    }, [doRedirect, addr]);

    function ListOfFavorites() {
        return watchlistCookies.watchlist.map((addr: any) => {
            let displayName = nicknameCookies.nicknames[addr]
                ? nicknameCookies.nicknames[addr]
                : addr;

            return (
                <Text
                    key={addr}
                    onClick={() => {
                        Router.push(`/profile/${addr}`);
                    }}
                >
                    {displayName}
                </Text>
            );
        });
    }

    return (
        <Box d="flex" alignItems="center" marginBottom="40px">
            <Text fontSize="xl" fontWeight="extrabold">
                Chocolate
            </Text>
            <Spacer />
            <InputGroup size="md" maxW="600px">
                <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Search wallet address..."
                    onInput={(e: any) => setAddr(e.target.value)}
                    value={addr}
                    onKeyPress={(e) => handleKeyPress(e)}
                />
                <InputRightElement width="4.5rem" mr="4px">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        Search
                    </Button>
                </InputRightElement>
            </InputGroup>
            <Spacer />
            <Text pr="30px" onClick={() => setWatchlist(true)}>
                Watchlist
            </Text>
            <SlidingPane
                className="some-custom-class"
                overlayClassName="some-custom-overlay-class"
                isOpen={openWatchlist}
                title="Watchlist"
                from="right"
                width="300px"
                onRequestClose={() => {
                    setWatchlist(false);
                }}
            >
                <ListOfFavorites />
            </SlidingPane>
        </Box>
    );
}
