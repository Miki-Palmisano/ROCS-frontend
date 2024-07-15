import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export default function Auth0Configuration ({ children }) {
    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin + window.location.pathname,
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            }}
            useRefreshTokens={true}
            cacheLocation="localstorage"
            >
            {children}
        </Auth0Provider>
    );
};