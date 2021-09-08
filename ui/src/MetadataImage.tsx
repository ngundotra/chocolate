import * as React from "react";
import { Box, Image, ImageProps, Badge, Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function MetadataImage(props: ImageProps) {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");

    useEffect(() => {
        if (props.src) {
            fetch(props.src).then((redirectResponse) => {
                fetch(redirectResponse.url).then((metadataResponse) => {
                    metadataResponse.json().then((metadata) => {
                        setUrl(metadata.image);
                        setName(metadata.name);
                        setSymbol(metadata.symbol);
                    });
                });
            });
        }
    }, [props.src]);

    return (
        <Box maxW={props.maxW} borderWidth="1px" borderRadius="lg">
            <Image maxW={props.maxW} src={url} alt={name} borderRadius="md" />

            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    <Badge
                        textTransform="uppercase"
                        borderRadius="full"
                        px="2"
                        colorScheme="teal"
                    >
                        {symbol}
                    </Badge>
                    <Link
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        ml="2"
                        isExternal
                        href={props.src}
                    >
                        {name}
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
