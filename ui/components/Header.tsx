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

export default function Header(props: any) {
    React.useEffect(() => {
        setDoRedirect(false);
    }, [props.addr]);

    const givenAddr = props.addr;
    const [addr, setAddr] = React.useState("");
    const [doRedirect, setDoRedirect] = React.useState(false);

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

    if (doRedirect) {
        Router.push(`/profile/${addr}`);
    }
    return (
        <Box d="flex" alignItems="center" px="40px">
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
        </Box>
    );
}
