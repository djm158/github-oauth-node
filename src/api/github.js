const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:30043/api/github/callback');

router.get('/login', (req, res) => {
//   res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync ( async(req, res) => {
    if(!req.query.code) throw new Error('No code provided');

    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`, {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
        },
    });

    const json = await response.json();
    // const res = await response;
    res.redirect(`/?token=${json.access_token}`);
}));
module.exports = router;