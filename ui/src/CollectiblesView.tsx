import { SimpleGrid, Spinner, Box } from "@chakra-ui/react";
import { MetadataImage } from "./MetadataImage";
import { useState, useEffect } from "react";
import { getNFTs } from "./utils/NFTEnrichment";
import { PublicKey } from "@solana/web3.js";

type CollectibleState = {
    url: string;
};

const CARD_SIZE = 200;

function renderTableData(collectibles: CollectibleState[]) {
    return collectibles.map((collectible, index) => {
        return (
            <MetadataImage key={index} maxW={CARD_SIZE} src={collectible.url} />
        );
    });
}

export function CollectiblesView(props: any) {
    const [isLoading, setIsLoading] = useState(false);
    let temp: any[] = [];
    const [collectibles, setCollectibles] = useState(temp);

    useEffect(() => {
        setCollectibles([]);
        async function getCollectibles() {
            setIsLoading(true);
            try {
                let pubKey = new PublicKey(props.addr);
                let nfts = await getNFTs(pubKey);
                let collectibles = nfts.map((imageUrl) => {
                    return { url: imageUrl.toString() };
                });
                setCollectibles(collectibles);
            } catch {
                console.error("Could not get NFTs for pubkey");
            }
            setIsLoading(false);
        }
        getCollectibles();
    }, [props.addr]);

    return (
        <Box>
            {isLoading ? (
                <Spinner />
            ) : (
                <SimpleGrid minChildWidth={CARD_SIZE} spacing="40px" p="40px">
                    {renderTableData(collectibles)}
                </SimpleGrid>
            )}
        </Box>
    );
}
