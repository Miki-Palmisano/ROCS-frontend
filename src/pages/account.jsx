import Cookie from "js-cookie";
import { useEffect } from "react";

export default function Account() {
    const token = Cookie.get('token');

    useEffect(() => {
        if(token === undefined) window.location.href = '/';
    }, [token]);

    return (
        <div>
            Account
        </div>
    );
}