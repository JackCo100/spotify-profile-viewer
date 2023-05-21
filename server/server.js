const express = require('express')
const querystring = require('querystring');
var cookieParser = require('cookie-parser');
require('dotenv').config()
const port = 5000

const app = express()
app.use(express.json());
app.use(cookieParser());

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri

async function getProfile(access_token){
  var profile = await fetch('https://api.spotify.com/v1/me', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + access_token },
  })
  var profile_json = await profile.json()
  return profile_json
}

async function getTopArtists(access_token){
  var artists = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + access_token },
  })
  var artists_json = await artists.json()
  return artists_json
}

var generateRandomString = function(length) { //part of the Spotify API functionality
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
app.get('/login', function(req, res) { //spotify login

  var state = generateRandomString(16);
  res.cookie("spotify_state", state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', async function(req, res) { //this handles the response from spotify login
  var code = req.query.code || null;
  var state = req.query.state || null;
  var error = req.query.error || null;
  var storedState = req.cookies ? req.cookies["spotify_state"] : null;
  var access_token = ''
  console.log(error)
  if(error != null){
    res.redirect('http://localhost:3000/#' +
      querystring.stringify({
        error: 'access_denied'
      }));
  }
  if (state === null || state !== storedState) {
    res.redirect('localhost:3000/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    const params = new URLSearchParams();
    params.append('code', code)
    params.append('redirect_uri', redirect_uri)
    params.append('grant_type','authorization_code')
    var token_res = await fetch('https://accounts.spotify.com/api/token', { //get access token 
      method: 'POST',
      body: params,
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
      },
    })
    var access_json = await token_res.json()
    access_token = access_json.access_token
    res.setHeader('Content-Type', 'application/json');
    res.cookie("spotify_token", access_token, {maxAge: 3600000});
    res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            //refresh_token: refresh_token
          }));
  }
});

app.get('/profile', async function(req, res) {
  var profile = await getProfile(req.header('Authorization'))
  var artists = await getTopArtists(req.header('Authorization'))
  console.log(artists)
  res.json([profile, artists])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})