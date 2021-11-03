import { SimpleGrid, Spinner, Box } from "@chakra-ui/react";
import { CARD_SIZE, IndexedCollectible, MetadataImage } from "./MetadataImage";
import * as React from "react";
import { getNFTs, NftEnrichment } from "../utils/NFTEnrichment";
import { PublicKey } from "@solana/web3.js";

function renderTableData(collectibles: NftEnrichment[]) {
    return collectibles.map((collectible, index) => {
        return <MetadataImage key={index} collectible={collectible} />;
    });
}

export default function CollectiblesView(props: any) {
    const [isLoading, setIsLoading] = React.useState(false);
    let temp: any[] = [];
    const [collectibles, setCollectibles] = React.useState(temp);

    React.useEffect(() => {
        setCollectibles([]);
        async function getCollectibles() {
            setIsLoading(true);
            try {
                let pubKey = new PublicKey(props.addr);
                let collectibles = await getNFTs(pubKey);
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
