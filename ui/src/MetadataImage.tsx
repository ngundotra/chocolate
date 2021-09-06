import * as React from 'react';
import { Image, ImageProps, Spinner } from '@chakra-ui/react';
import { useState } from 'react';

export function MetadataImage(props: ImageProps) {
    let [state, setState] = useState({
        isLoading: false,
        isLoaded: false,
        url: ""
    });

    if (!state.isLoading && !state.isLoaded) {
        setState({
            isLoading: true,
            isLoaded: false,
            url: state.url,
        });

        // Load image by parsing metadata json... smh
        fetch(props.src!).then(
            (redirectResponse) => {
                fetch(redirectResponse.url).then(
                    (metadataResponse) => {
                        metadataResponse.json().then(
                            (metadata) => {
                                console.log(props.src, ":", metadata); 
                                setState({
                                    isLoading: false,
                                    isLoaded: true,
                                    url: metadata.image
                                });
                            }
                        )
                    }
                )
            }
        )
    }

    if (state.isLoading) {
        return <Spinner width={200} height={200}/>
    }
    return (<Image src={state.url} width={200} height={200}/>)
}