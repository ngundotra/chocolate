import * as React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
import { useState } from 'react';

export function MetadataImage(props: ImageProps) {
    let [state, setState] = useState({url: ""});

    if (props.src && state.url == "") {
        fetch(props.src).then(
            (redirectResponse) => {
                fetch(redirectResponse.url).then(
                    (metadataResponse) => {
                        metadataResponse.json().then(
                            (metadata) => {
                                console.log(props.src, ":", metadata); 
                                setState({url: metadata.image})        
                            }
                        )
                    }
                )
            }
        )
    }

    return (<Image src={state.url}/>)
}