// The base API Management URI
const baseUri = "https://poc-multi-region-frontend.azurefd.net";

// The Azure AD B2C application registration client ID
const clientId = "722b9421-31fc-4890-afc3-e4071864de2e";

// The Azure AD B2C tenant ID
const tenantId = "rbarchtenant.onmicrosoft.com";

// The Azure AD B2C login policy
const login_policy = "B2C_1A_LOSIGNINROUTING";

// The scope for the id token request
const scope = "openid"

// Redirects the user to the login endpoint with the appropriate parameters to begin the authentication flow
const login = () => {
    window.location.href =
        `https://rbarchtenant.b2clogin.com/${tenantId}/${login_policy}/oauth2/v2.0/authorize?response_type=id_token&response_mode=query&redirect_uri=${baseUri}/auth/routingcallback&client_id=${clientId}&scope=${scope}`
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

    try {
        // Call the Graph API endpoint with manual redirect handling
        const response = await fetch(`${baseUri}/api/me`, {
            credentials: "include",
            redirect: "manual" // Do not automatically follow redirects
        });

if (response.status === 401) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const redirectUrl = `${baseUri}/${data.login_path}`; // Extract login_path from response body
        if (redirectUrl) {
            console.warn('Redirecting to:', redirectUrl);
            // Optionally notify the user or redirect the browser
            document.getElementById("result").innerText = "User is not authenticated. Redirecting to login page...";
            // You might want to redirect the user or take other actions
            window.location.href = redirectUrl;
        }
    } else {
        document.getElementById("result").innerText = "Unexpected response format.";
    }
} else {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                document.getElementById("result").innerText = JSON.stringify(data, null, 2);
            } else {
                document.getElementById("result").innerText = "Unexpected response format.";
            }
        }
    } catch (error) {
        document.getElementById("result").innerText = `Error: ${error.message}`;
    }
};

// Exports the functions to be used in the HTML
export { login, logout, callApi, altLogin };
