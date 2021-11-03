import * as React from "react";
import { Image, ImageProps, Spinner } from "@chakra-ui/react";
import { useState } from "react";

export function RedirectImage(props: ImageProps) {
    let [state, setState] = useState({
        isLoading: false,
        isLoaded: false,
        url: "",
    });

    if (!state.isLoading && !state.isLoaded) {
        setState({
            isLoading: true,
            isLoaded: false,
            url: state.url,
        });

        // Load image by parsing metadata json... smh
        fetch(props.src!).then((redirectResponse) => {
            console.log(props.src, ":", redirectResponse.url);
            setState({
                isLoading: false,
                isLoaded: true,
                url: redirectResponse.url,
            });
        });
    }

    if (state.isLoading) {
        return <Spinner width={200} height={200} />;
    }
    return (
        <Image src={state.url} width={200} height={200} alt={"nft image?"} />
    );
}
