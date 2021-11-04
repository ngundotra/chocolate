import * as React from "react";
import Router from "next/router";
import { useCookies } from "react-cookie";

export default function Index() {
    const [nicknames, setNicknames] = useCookies(["nicknames"]);
    const [watchlist, setWatchlist] = useCookies(["watchlist"]);

    React.useEffect(() => {
        // Set some defaults for watchlist
        let nicknameList = {
            B2vr8ETSKMiXYa543gKadryfhYtEKjmUVpoxW7tUQ6MP: "Edison's Wallet",
            "9fETpNpWQY2jhXXd8WEhfaLVdNsvBAT4J2gPHqyZKw7H": "Noah's Wallet",
        };

        let watchlist = [
            "B2vr8ETSKMiXYa543gKadryfhYtEKjmUVpoxW7tUQ6MP",
            "9fETpNpWQY2jhXXd8WEhfaLVdNsvBAT4J2gPHqyZKw7H",
        ];
        setWatchlist("watchlist", JSON.stringify(watchlist), { path: "/" });
        setNicknames("nicknames", JSON.stringify(nicknameList), { path: "/" });
        // Redirect
        Router.push("/profile/9fETpNpWQY2jhXXd8WEhfaLVdNsvBAT4J2gPHqyZKw7H");
    });

    return <div>Hello World</div>;
}
