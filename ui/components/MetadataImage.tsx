import * as React from "react";
import { Box, Image, ImageProps, Badge, Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { NftEnrichment } from "../utils/NFTEnrichment";

export const CARD_SIZE = 200;

export type IndexedCollectible = {
    key: number;
    collectible: NftEnrichment;
};

export function MetadataImage(props: IndexedCollectible) {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");

    useEffect(() => {
        fetch(props.collectible.imageUrl).then((redirectResponse) => {
            // let redirectUrl = redirectResponse.url;
            setUrl(props.collectible.imageUrl);
            setName(props.collectible.name);
            setSymbol(props.collectible.symbol);
            console.log("redirect url: ", props.collectible.imageUrl);
        });
    }, [
        props.collectible.imageUrl,
        props.collectible.name,
        props.collectible.symbol,
    ]);

    return (
        <Box maxW={CARD_SIZE} borderWidth="1px" borderRadius="lg">
            <Image maxW={CARD_SIZE} src={url} alt={name} borderRadius="md" />

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
                        href={url}
                    >
                        {name}
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
