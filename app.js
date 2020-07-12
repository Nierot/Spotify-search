const secrets = require('./secrets.json')
const SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const cors = require('cors');
const app = express();
const port = 6969;
let spotify;

async function initSpotify() {
    console.log("Initializing Spotify");
    var spotifyApi = new SpotifyWebApi({
        clientId: secrets['clientId'],
        clientSecret: secrets['clientSecret']
      });
      
    await spotifyApi.clientCredentialsGrant().then(
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
    let resp = 't';
    await spotify.searchTracks(query)
        .then(data => resp = data,
              async err => {
                  if (err.statusCode !== 200) {
                      spotify = await initSpotify();
                  }
                  await new Promise(r => setTimeout(r, 2000));
                  resp = await searchSpotify(query);
                });
    console.log(resp)
    return resp;
}

app.use(cors());

app.get('/', (req, res) => {
    res.send('<form action="/search" method="GET>' +
                '<input type="hidden" name="query">' +
                '<input type="text" name="query"/>' +
                '<button type="submit">Search spotify</button>' +
             '</form>');
});

app.get('/search', async (req, res) => {
    res.json(await searchSpotify(req.query.query));
})

app.use(express.static('public'));

app.listen(port, async () => {
    spotify = await initSpotify();
    console.log(`Listening at http://localhost:${port}`)
});