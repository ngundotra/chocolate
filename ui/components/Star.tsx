import * as React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Box } from "@chakra-ui/react";
import { useCookies } from "react-cookie";

export default function Star(props: any) {
    const [clicked, setClicked] = React.useState(false);
    const [cookies, setCookie] = useCookies(["watchlist"]);

    React.useEffect(() => {
        let cookieList = cookies && cookies["watchlist"];
        if (cookieList && cookieList.includes(props.addr)) {
            setClicked(true);
        } else {
            setClicked(false);
        }
    }, [cookies, props.addr]);

    function updateWatchListCookie(toAdd: boolean) {
        let cookieList;
        if (cookies["watchlist"] == undefined) {
            cookieList = [];
        } else {
            cookieList = cookies["watchlist"];
        }

        if (toAdd) {
            cookieList.push(props.addr);
        } else {
            const index = cookieList.indexOf(props.addr);
            if (index > -1) {
                cookieList.splice(index, 1);
            }
        }

        setCookie("watchlist", JSON.stringify(cookieList), { path: "/" });
    }

    return (
        <Box>
            {clicked ? (
                <AiFillStar
                    color="orange"
                    onClick={() => updateWatchListCookie(false)}
                    data-tip="Remove from watchlist"
                />
            ) : (
                <AiOutlineStar
                    onClick={() => updateWatchListCookie(true)}
                    data-tip="Add to watchlist"
                />
            )}
        </Box>
    );
}
