import { useState, useEffect } from "react";
import {
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    Text,
    Spacer,
} from "@chakra-ui/react";

export default function Header(props: any) {
    const [addr, setAddr] = useState("");

    useEffect(() => {
        setAddr(props.addr);
    }, [props.addr]);

    const handleClick = () => {
        props.updateAddr(addr);
    };

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
                    onInput={(e) => setAddr(e.target.value)}
                    value={addr}
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
