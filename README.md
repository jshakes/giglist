# livelist

A Node.js application that generates Spotify playlists for cities based on artists playing there in the coming weeks.

## Local development

This application uses `process.env` variables to access credentials. For local development you should supply these by creating a `.env` file at the root containing the following key=value pairs:

```
MONGO_URL=[YOUR MONGO URL]
LASTFM_API_KEY=[YOUR LAST FM KEY]
SONGKICK_API_KEY=[YOUR SONGKICK API KEY]
SPOTIFY_USERNAME=[YOUR APPLICATION'S SPOTIFY USERNAME]
SPOTIFY_CLIENT_ID=[YOUR SPOTIFY CLIENT ID]
SPOTIFY_CLIENT_SECRET=[YOUR SPOTIFY CLIENT SECRET]
SPOTIFY_REFRESH_TOKEN=[YOUR SPOTIFY REFRESH TOKEN]
ROLLBAR_TOKEN=[YOUR ROLLBAR TOKEN] // (optional)
```

On first install: `$ npm i`

For local development: `$ npm run dev`

The application will run at [http://localhost:3000](http://localhost:3000) by default

### Tests

Testing is handled by jest. To run the full test suite: `$ npm run test`

## Managing cities

To create a city run (create in DB and make empty Spotify playlists):

`npm run city:create [LATITUDE],[LONGITUDE]`

To fetch latest events and populate the playlists with tracks based on them:

`npm run city:update [CITY ID]`

To delete a city:

`npm run city:delete [CITY ID]`

To truncate a city's playlists (empty tracks in database and on Spotify):

`npm run city:truncate [CITY ID]`
