var _ = require('underscore');
var lastfm = require('./lastfm');

const genres = [
  {
    id: 1,
    name: 'Acoustic',
    tags: ['singer-songwriter', 'acoustic', 'easy listening', 'Alt-country', 'americana', 'indie folk', 'bluegrass']
  },
  {
  	id: 2,
    name: 'Ambient',
  	tags: ['ambient', 'chillout', 'downtempo', 'dark ambient', 'new age', 'minimal', 'atmospheric', 'drone', 'ethereal', 'relaxing', 'minimalism', 'Dreamy', 'cinematic', 'minimalist', 'chill out', 'piano ambient', 'ambient piano']
  },
  {
  	id: 3,
    name: 'Blues',
  	tags: ['blues', 'blues rock']
  },
  {
  	id: 4,
    name: 'Classical',
  	tags: ['Classical', 'piano', 'contemporary classical', 'neoclassical', 'baroque', 'composer', 'opera', 'modern classical', 'violin', 'orchestral', 'composers', 'post-classical', 'contemporary piano', 'neo-classical', 'cello', 'symphonic']
  },
  {
  	id: 5,
    name: 'Classic Rock',
  	tags: [ 'classic rock', 'oldies', 'classic', 'glam rock', 'Southern Rock', 'hair metal', 'powerpop']
  },
  {
  	id: 6,
    name: 'Country',
  	tags: ['country', 'Alt-country', 'rockabilly', 'americana', 'classic country']
  },
  {
  	id: 7,
    name: 'Electronic/Dance',
  	tags: ['electronic', 'experimental', 'instrumental', 'breakbeat', 'dance', 'chillout', 'electronica', 'industrial', 'psychedelic', 'trance', 'House', 'electro', 'synthpop', 'noise', 'Drum and bass', 'dubstep', 'Disco', 'drone', 'electropop', 'psytrance', 'party', 'progressive trance', 'synth pop', 'remix', 'club', 'glitch', 'trip hop', 'dancehall', 'deep house', 'minimal techno', 'Progressive House', 'breakcore', 'bass', 'dnb', 'vocal trance', 'Drum n Bass', 'Electroclash', 'eurodance', 'indietronica', 'electro house', 'synth', 'goa', '8-bit', 'chill out', 'jungle', 'ninja tune', 'big beat', 'new rave', 'psychill', 'electro-industrial', 'psychedelic trance', 'uplifting trance', 'Rave', 'chillwave']
  },
  {
    id: 9,
    name: 'House and Techno',
    tags: ['techno', 'downtempo', 'idm', 'darkwave', 'ebm', 'dark electro', 'deep house', 'minimal techno', 'Progressive House', 'tech house']
  },
  {
  	id: 9,
    name: 'Folk',
  	tags: ['folk', 'folk rock', 'neofolk', 'indie folk', 'bluegrass', 'freak folk', 'folk-rock']
  },
  {
  	id: 10,
    name: 'Funk',
  	tags: ['funk', 'funky', 'groovy']
  },
  {
  	id: 11,
    name: 'Indie',
  	tags: ['alternative', 'indie', 'alternative rock', 'indie rock', 'chillout', 'psychedelic', 'post-rock', 'new wave', 'american', 'indie pop', 'emo', 'Grunge', 'britpop', 'synthpop', 'Mellow', 'new age', 'shoegaze', 'Lo-Fi', 'Garage Rock', 'dream pop', 'art rock', 'soft rock', 'Alt-country', 'emocore', 'indie folk', 'Dreamy', 'post-grunge', 'indietronica', 'chill out', 'underground', 'twee', 'freak folk', 'chillwave']
  },
  {
  	id: 12,
    name: 'Jazz',
  	tags: ['jazz', 'Smooth Jazz', 'Fusion', 'acid jazz', 'nu jazz', 'saxophone', 'Bossa Nova', 'vocal jazz', 'jazz fusion', 'free jazz', 'jazzy', 'jazz vocal', 'jazz piano', 'nu-jazz', 'trumpet', 'contemporary jazz', 'bebop']
  },
  {
  	id: 13,
    name: 'Oldies',
  	tags: ['new wave', 'oldies', 'Disco', 'swing', 'motown', 'Big Band']
  },
  {
  	id: 14,
    name: 'Pop',
  	tags: ['pop', 'indie pop', 'britpop', 'synthpop', 'pop rock', 'j-pop', 'electropop', 'dream pop', 'JPop', 'synth pop', 'k-pop', 'mpb', 'power pop', 'futurepop', 'Pop-Rock', 'Kpop']
  },
  {
  	id: 15,
    name: 'R&B and Soul',
  	tags: ['soul', 'rnb', 'rhythm and blues', 'r&b', 'gospel', 'Neo-Soul', 'urban']
  },
  {
  	id: 16,
    name: 'Rap/Hip Hop',
  	tags: ['Hip-Hop', 'rap', 'hip hop', 'underground hip-hop', 'hiphop', 'Gangsta Rap', 'underground hip hop', 'breaks', 'instrumental hip-hop', 'urban', 'turntablism']
  },
  {
  	id: 17,
    name: 'Reggae / Ska',
  	tags: ['reggae', 'ska', 'dub', 'Stoner Rock', 'dancehall', 'ska punk', 'stoner', 'roots reggae']
  },
  {
  	id: 18,
    name: 'Rock',
  	tags: ['rock', 'alternative rock', 'classic rock', 'indie rock', 'hard rock', 'Progressive rock', 'punk rock', 'post-rock', 'new wave', 'emo', 'Psychedelic Rock', 'Grunge', 'blues rock', 'pop rock', 'Progressive', 'shoegaze', 'J-rock', 'Stoner Rock', 'folk rock', 'Garage Rock', 'art rock', 'soft rock', 'rockabilly', 'glam rock', 'space rock', 'rock n roll', 'Rock and Roll', 'krautrock', 'post rock', 'Southern Rock', 'emocore', 'industrial rock', 'rapcore', 'Experimental Rock', 'christian rock', 'math rock', 'psychobilly', 'garage', 'post-grunge', 'jrock', 'power pop', 'stoner', 'Pop-Rock', 'powerpop', 'Surf', 'prog', 'folk-rock', 'melodic rock', 'Deutschrock', 'noise rock']
  },
  {
  	id: 19,
    name: 'Heavy Rock / Metal',
  	tags: ['metal', 'hard rock', 'black metal', 'death metal', 'hardcore', 'heavy metal', 'thrash metal', 'metalcore', 'Progressive metal', 'Melodic Death Metal', 'Power metal', 'emo', 'post-hardcore', 'doom metal', 'Gothic Metal', 'Gothic', 'screamo', 'Nu Metal', 'symphonic metal', 'grindcore', 'darkwave', 'folk metal', 'deathcore', 'industrial metal', 'alternative metal', 'Brutal Death Metal', 'hardcore punk', 'Gothic Rock', 'Sludge', 'Female fronted metal', 'Technical Death Metal', 'speed metal', 'viking metal', 'visual kei', 'melodic hardcore', 'russian rock', 'post rock', 'atmospheric black metal', 'goth', 'depressive black metal', 'Post-Metal', 'melodic metal', 'mathcore', 'industrial rock', 'pagan metal', 'progressive death metal', 'melodic black metal', 'Symphonic Black Metal', 'math rock', 'groove metal', 'Nu-metal', 'Symphonic Rock', 'thrash', 'hair metal', 'goregrind', 'old school death metal', 'stoner metal', 'Doom', 'martial industrial', 'deathrock', 'raw black metal', 'NWOBHM', 'nsbm', 'Blackened Death Metal', 'sludge metal', 'Avant-garde Metal', 'hardstyle', 'post hardcore', 'heavy']
  },
  {
  	id: 20,
    name: 'Punk',
  	tags: ['punk', 'punk rock', 'post-punk', 'pop punk', 'hardcore punk', 'emocore', 'Crust', 'psychobilly', 'ska punk', 'Oi', 'Post punk', 'horror punk']
  }
];

module.exports = {
  getGenres: function() {
    return genres;
  },
  getGenreNames: function() {
    return _.pluck(genres, 'name');
  },
  getGenresFromTags: function(tags) {
  	return _.pluck(_.filter(genres, function(genre) {
  		return _.intersection(genre.tags, tags).length;
  	}), 'id');
  },
  getArtistGenres: function(artist) {
    var _this = this;
    // todo: run down tags until we match a genre
    return lastfm.getArtistTagArray(artist)
    .then(function(tags) {
      if(!tags.length) {
        return [];
      }
      return _this.getGenresFromTags(tags);
    })
    .catch(function(err) {
      console.error('Could not get genre for', artist);
    });
  }
}
