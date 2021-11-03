import type { AppProps /*, AppContext */ } from "next/app";
import { ChakraProvider, theme } from "@chakra-ui/react";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
