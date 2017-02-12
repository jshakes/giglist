# livelist

## Local development

`npm i`, `npm run dev`, [http://localhost:3000](http://localhost:3000)

## Managing cities

To create a city run (create in DB and make empty Spotify playlists):

`npm run city:create [LATITUDE],[LONGITUDE]`

To fetch latest events and populate the playlists with tracks based on them:

`npm run city:update [CITY ID]`

To delete a city:

`npm run city:delete [CITY ID]`

To truncate a city's playlists (empty tracks in database and on Spotify):

`npm run city:truncate [CITY ID]`
