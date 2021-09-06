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
        getWalletData(props.pubkey);
    }, [props.pubkey]);

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
                p="6"
                textTransform="uppercase"
            >
                <Text fontWeight="bold" letterSpacing="wide">
                    Net worth
                </Text>
                <Text isNumeric fontWeight="semibold" color="gray.500" ml="3">
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
        // Create row for each token. Filter out tokens with zero quantity
        const tokenView = walletTokens
            .filter((token) => token.amount > 0)
            .map((token) => {
                return (
                    <Tr
                        fontWeight="semibold"
                        textTransform="uppercase"
                        key={token.name}
                    >
                        <Td>
                            <Box d="flex" alignItems="center">
                                <Image
                                    maxW="50px"
                                    src={token.image}
                                    alt={token.name}
                                />
                                <Text ml="15px" as="h6" maxW="250px">
                                    {token.name}
                                </Text>
                            </Box>
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
        return (
            <Table letterSpacing="wide" variant="simple" p="5" m="3">
                <Thead
                    fontWeight="bold"
                    fontSize="small"
                    textTransform="uppercase"
                >
                    <Th>Token</Th>
                    <Th># owned</Th>
                    <Th>Price</Th>
                    <Th>Total value</Th>
                </Thead>
                <Tbody>{tokenView}</Tbody>
            </Table>
        );
    };

    return (
        <>
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
        </>
    );
}
