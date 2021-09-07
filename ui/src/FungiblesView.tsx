import * as React from "react";
import {
    Box,
    Spinner,
    Image,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    LinkBox,
    LinkOverlay,
} from "@chakra-ui/react";
import { getFungibleTokens } from "./utils/FungibleTokenAccount";
import { PublicKey } from "@solana/web3.js";

/**
 * Display fungible tokens and total value
 */
export default function FungiblesView(props: any) {
    // Create state variables
    let temp: any[] = [];
    const [walletTokens, setWalletTokens] = React.useState(temp);
    const [walletValue, setWalletvalue] = React.useState(0);
    const [isLoadingWallet, setIsLoadingWallet] = React.useState(false);

    /**
     * Load wallet data on page load
     */
    React.useEffect(() => {
        try {
            let pubKey = new PublicKey(props.addr);
            getWalletData(pubKey);
        } catch {
            console.error("Invalid public key");
        }
    }, [props.addr]);

    /**
     *  Get wallet data and set loading variables
     * */
    async function getWalletData(addr: PublicKey) {
        setIsLoadingWallet(true);
        let data = await getFungibleTokens(addr);
        let tokens: any[] = data.tokens;

        setWalletTokens(tokens);
        setWalletvalue(data.netWorth);
        setIsLoadingWallet(false);
    }

    /**
     * Display networth
     */
    const NetWorthSection = () => {
        return (
            <Box
                d="flex"
                justifyContent="center"
                alignItems="center"
                p="6"
                textTransform="uppercase"
            >
                <Text
                    fontWeight="bold"
                    color="gray.500"
                    letterSpacing="wide"
                    fontSize="md"
                >
                    Net worth
                </Text>
                <Text fontWeight="semibold" ml="3" fontSize="lg">
                    {"$"}
                    {walletValue.toFixed(2)}
                </Text>
            </Box>
        );
    };

    /**
     * Display table of fungible tokens owned
     */
    const TokenSection = () => {
        // Create row for each token.
        let tokenView;

        if (walletTokens.length > 0) {
            tokenView = walletTokens.map((token) => {
                return (
                    <Tr
                        fontWeight="semibold"
                        textTransform="uppercase"
                        key={token.name}
                    >
                        <Td>
                            <LinkBox
                                d="flex"
                                alignItems="center"
                                w="fit-content"
                            >
                                <Image
                                    maxW="50px"
                                    src={token.image}
                                    alt={token.name}
                                />
                                <LinkOverlay
                                    href={token.website}
                                    isExternal
                                    ml="15px"
                                    maxW="250px"
                                >
                                    {token.name}
                                </LinkOverlay>
                            </LinkBox>
                        </Td>

                        <Td color="gray.500" fontSize="xs">
                            {token.amount}
                        </Td>
                        <Td color="gray.500" fontSize="xs">
                            ${token.price.toFixed(2)}
                        </Td>

                        <Td fontSize="xs">
                            ${(token.price * token.amount).toFixed(2)}
                        </Td>
                    </Tr>
                );
            });
        } else {
            tokenView = (
                <Tr>
                    <Td fontSize="small">No fungible tokens</Td>
                </Tr>
            );
        }
        return (
            <Table letterSpacing="wide" variant="simple" p="5" m="3">
                <Thead
                    fontWeight="bold"
                    fontSize="small"
                    textTransform="uppercase"
                >
                    <Tr>
                        <Th>Token</Th>
                        <Th># owned</Th>
                        <Th>Price</Th>
                        <Th>Total value</Th>
                    </Tr>
                </Thead>
                <Tbody>{tokenView}</Tbody>
            </Table>
        );
    };

    return (
        <Box>
            {isLoadingWallet ? (
                <Spinner />
            ) : (
                <>
                    <NetWorthSection />
                    <TokenSection />
                </>
            )}
        </Box>
    );
}
