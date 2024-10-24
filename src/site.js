// The base API Management URI
const baseUri = "https://api-beta.literadev.com";

// The Microsoft Entra ID application registration client ID
const clientId = "722b9421-31fc-4890-afc3-e4071864de2e";

// The Microsoft Entra ID tenant ID
const tenantId = "rbarchtenant.onmicrosoft.com";

// The scope for the access token request to call the Microsoft Graph API
// If a refresh token is also required for the application, add "offline_access" to the scope
// e.g. const scope = "https://graph.microsoft.com/.default offline_access"
const scope = "https://rbarchtenant.onmicrosoft.com/IEFTestApp/Read"

// Redirects the user to the login endpoint with the appropriate parameters to begin the authentication flow
const login = () => {
    window.location.href =
        `https://rbarchtenant.b2clogin.com/rbarchtenant.onmicrosoft.com/B2C_1A_SIGNUPORSIGNIN_MULTIPLEEMAILSELECT/oauth2/v2.0/authorize?response_type=code&response_mode=query&redirect_uri=https://api-beta.literadev.com/auth/callback&client_id=722b9421-31fc-4890-afc3-e4071864de2e&scope=https://graph.microsoft.com/.default`
        //'https://rbarchtenant.b2clogin.com/rbarchtenant.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_LOSIGNIN&client_id=${clientId}&nonce=defaultNonce&redirect_uri=${baseUri}/auth/callback&scope=${scope}&response_type=code&prompt=login'
};
// Logs the user out of the application by redirecting to the logout endpoint of Microsoft Entra ID which will in turn call the logout endpoint of the application to remove the cookie
// This allows the user to be logged out of Microsoft Entra ID and the single-page application itself by deleting the cookie
// If you do not want to log the user out of Microsoft Entra ID, you can remove the redirect to the logout endpoint of Microsoft Entra ID and just call the logout endpoint of the application
const logout = () => {
    window.location.href = `https://rbarchtenant.b2clogin.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${baseUri}/auth/logout`;
};

// Calls the graph endpoint and displays the result
const callApi = async () => {
    // Display loading message
    document.getElementById("result").innerText = "Loading...";

    // Call the Graph API endpoint
    await fetch(`${baseUri}/graph/me`, {
        credentials: "include",
    })
        .then(async (response) => {
            if (response.status === 401) {
                document.getElementById("result").innerText = "User is not authenticated.";
            } else {
                document.getElementById("result").innerText = JSON.stringify(await response.json(), null, 4);
            }
        })
        .catch((error) => {
            document.getElementById("result").innerText = error;
        });
};

// Exports the functions to be used in the HTML
export { login, logout, callApi };
