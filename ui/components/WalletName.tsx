import * as React from "react";
import { Box, Text, Input } from "@chakra-ui/react";
import { useCookies } from "react-cookie";

export default function WalletName(props: any) {
    const [nickname, setNickname] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    const [cookies, setCookie] = useCookies(["nicknames"]);

    React.useEffect(() => {
        setIsEditing(false);
    }, []);

    const wrapperRef = React.useRef(null);
    const nicknameInputRef = React.useRef<HTMLInputElement>();
    useOutsideAlerter(wrapperRef);

    React.useEffect(() => {
        let cookieList = cookies && cookies["nicknames"];
        if (cookieList[props.addr]) {
            setNickname(cookieList[props.addr]);
        } else {
            setNickname("");
        }
    }, [cookies, props.addr]);

    React.useEffect(() => {
        let cookieList;
        if (cookies["nicknames"] == undefined) {
            cookieList = {};
        } else {
            cookieList = cookies["nicknames"];
        }

        cookieList[props.addr] = nickname;
        setCookie("nicknames", JSON.stringify(cookieList), { path: "/" });
    }, [nickname]);

    /**
     * Hook that alerts clicks outside of the passed ref
     */
    function useOutsideAlerter(ref: any) {
        React.useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsEditing(false);
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            setIsEditing(false);
        }
    };

    React.useEffect(() => {
        if (nicknameInputRef && nicknameInputRef.current) {
            nicknameInputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <Box ref={wrapperRef} px={3}>
            {isEditing ? (
                // Display input field and address
                <Box onClick={() => setIsEditing(true)}>
                    <Input
                        m={0}
                        p={0}
                        fontSize="xl"
                        ref={nicknameInputRef}
                        textAlign="center"
                        variant="unstyled"
                        type="text"
                        placeholder="Set nickname..."
                        onInput={(e: any) => setNickname(e.target.value)}
                        value={nickname}
                        onKeyPress={(e) => handleKeyPress(e)}
                    />
                    <Text color="grey" fontSize="sm" fontStyle="italic">
                        {props.addr}
                    </Text>
                </Box>
            ) : nickname == "" ? (
                // Display address
                <Text p={3} onClick={() => setIsEditing(true)}>
                    {props.addr}
                </Text>
            ) : (
                // Display nickname and address
                <Box>
                    <Text onClick={() => setIsEditing(true)}>{nickname}</Text>
                    <Text color="grey" fontSize="sm" fontStyle="italic">
                        {props.addr}
                    </Text>
                </Box>
            )}
        </Box>
    );
}
