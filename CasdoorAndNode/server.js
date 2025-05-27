const uuidv4 = require('uuid').v4;
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const axios = require('axios');
const app = express();
const port = 3000;

const CASDOOR_ENDPOINT = process.env.CASDOOR_ENDPOINT || 'http://localhost:8000';
const CASDOOR_CLIENT_ID = process.env.CASDOOR_CLIENT_ID;
const CASDOOR_CLIENT_SECRET = process.env.CASDOOR_CLIENT_SECRET;
const CASDOOR_ORGANIZATION_NAME = process.env.CASDOOR_ORGANIZATION_NAME;
const CASDOOR_APPLICATION_NAME = process.env.CASDOOR_APPLICATION_NAME;
const APP_REDIRECT_URI = process.env.APP_REDIRECT_URI || 'http://localhost:3000/callback';

if (!CASDOOR_CLIENT_ID || !CASDOOR_CLIENT_SECRET) {
    console.error('Error: CASDOOR_CLIENT_ID and CASDOOR_CLIENT_SECRET must be set in .env');
    process.exit(1);
}

app.use(session({
    secret: 'oij3j20asopd239r3wej0asoa_asd120ewjdsa98/=ok12',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('public'));

app.get('/login', (req, res) => {
    var state = uuidv4();
    req.session.oauthState = state; 

    const authorizeUrl = `${CASDOOR_ENDPOINT}/login/oauth/authorize?` +
        `client_id=${CASDOOR_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(APP_REDIRECT_URI)}&` +
        `scope=profile email openid&` +
        `state=${state}&` +
        `organization=${CASDOOR_ORGANIZATION_NAME}&` +
        `application=${CASDOOR_APPLICATION_NAME}`;
    res.redirect(authorizeUrl);
});

app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code not received.');
    }

    if (state !== req.session.oauthState) {
        delete req.session.oauthState; 
        return res.status(403).send('State mismatch, potential CSRF attack.');
    }

    delete req.session.oauthState; 

    try {
        const tokenResponse = await axios.post(`${CASDOOR_ENDPOINT}/api/login/oauth/access_token`, null, {
            params: {
                grant_type: 'authorization_code',
                client_id: CASDOOR_CLIENT_ID,
                client_secret: CASDOOR_CLIENT_SECRET,
                code: code,
                redirect_uri: APP_REDIRECT_URI,
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const { access_token, id_token } = tokenResponse.data;

        if (!access_token) {
            throw new Error('No access token received.');
        }

        const userInfoResponse = await axios.get(`${CASDOOR_ENDPOINT}/api/userinfo`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': 'application/json'
            }
        });

        const userInfo = userInfoResponse.data;

        req.session.user = userInfo;
        req.session.isAuthenticated = true;
        console.log('User logged in:', userInfo.name || userInfo.preferred_username);

        res.redirect('/');

    } catch (error) {
        console.error('Casdoor callback error:', error.response ? error.response.data : error.message);
        res.status(500).send('Authentication failed: ' + (error.response ? error.response.data.error_description || error.response.data.error : error.message));
    }
});

app.get('/api/user', (req, res) => {
    if (req.session.isAuthenticated && req.session.user) {
        res.json({
            isAuthenticated: true,
            user: {
                id: req.session.user.sub,
                name: req.session.user.name || req.session.user.preferred_username,
                email: req.session.user.email,
                picture: req.session.user.picture
            }
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post('/api/update-profile', isAuthenticated, async (req, res) => {
    const { newDisplayName } = req.body;
    const accessToken = req.session.accessToken;
    const userId = req.session.user.sub; // Or req.session.user.name, depending on Casdoor's update-user API
    const userName = req.session.user.name; // Casdoor's /api/update-user often takes 'name' as identifier

    if (!newDisplayName || newDisplayName.trim() === "") {
        return res.status(400).json({ message: "New display name cannot be empty." });
    }

    if (!accessToken) {
        return res.status(401).json({ message: "Access token missing from session. Please log in again." });
    }

    try {
        const updateUserPayload = {
            id: userId, 
            name: userName,
            displayName: newDisplayName
        };

        const casdoorUpdateResponse = await axios.post(`${CASDOOR_ENDPOINT}/api/update-user`, updateUserPayload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const userInfoResponse = await axios.get(`${CASDOOR_ENDPOINT}/api/userinfo`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        const updatedUserInfo = userInfoResponse.data;
        req.session.user = updatedUserInfo;
        console.log(`User ${userName} display name updated to: ${newDisplayName}`);

        res.json({
            success: true,
            message: `Profile updated successfully! New display name: ${newDisplayName}`,
            user: {
                id: updatedUserInfo.sub,
                name: updatedUserInfo.name || updatedUserInfo.preferred_username,
                email: updatedUserInfo.email,
                picture: updatedUserInfo.picture,
                displayName: updatedUserInfo.displayName || updatedUserInfo.display_name || updatedUserInfo.name
            }
        });

    } catch (error) {
        console.error('Error updating profile with Casdoor:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            message: `Failed to update profile: ${error.response?.data?.error || error.message}`
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out.');
        }
        console.log('User logged out.');
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log(`Casdoor Endpoint: ${CASDOOR_ENDPOINT}`);
    console.log(`Casdoor Client ID: ${CASDOOR_CLIENT_ID}`);
    console.log(`App Redirect URI: ${APP_REDIRECT_URI}`);
});