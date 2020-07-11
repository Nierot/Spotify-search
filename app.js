const secrets = require('./secrets.json')
const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express();
const port = 6969;
let spotify;

async function initSpotify() {
    console.log("Initializing Spotify")
    var spotifyApi = new SpotifyWebApi({
        clientId: secrets['clientId'],
        clientSecret: secrets['clientSecret']
      });
      
    spotifyApi.clientCredentialsGrant().then(
        data => {
            console.log('The access token is ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        err => {
            console.log('Something went wrong!', err);
        }
    )
    return spotifyApi;
}


async function searchSpotify(query) {
    console.log(query)
    console.log(`Spotify Object: ${spotify}`)

    let resp = 't';
    await spotify.searchTracks(query)
        .then(data => resp = data,
              err => resp = err);
    console.log(resp)
    return resp;
}

app.get('/', (req, res) => {
    res.send('<form action="/search" method="GET>' +
                '<input type="hidden" name="query">' +
                '<input type="text" name="query"/>' +
                '<button type="submit">Search spotify</button>' +
             '</form>');
});

app.get('/search', async (req, res) => {
    res.json(await searchSpotify(req.query.query))
})

app.use(express.static('public'));

app.listen(port, async () => {
    spotify = await initSpotify();
    console.log(`Listening at http://localhost:${port}`)
});