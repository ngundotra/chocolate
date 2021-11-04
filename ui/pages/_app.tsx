import type { AppProps /*, AppContext */ } from "next/app";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { CookiesProvider } from "react-cookie";
import ReactTooltip from "react-tooltip";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CookiesProvider>
            <ChakraProvider theme={theme}>
                <ReactTooltip />
                <Component {...pageProps} />
            </ChakraProvider>
        </CookiesProvider>
    );
}
