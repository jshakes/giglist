var _ = require('underscore');

const genres = [
  {
    name: 'Acoustic',
    tags: ['singer-songwriter', 'acoustic', 'american', 'easy listening', 'Alt-country', 'americana', 'indie folk', 'bluegrass']
  },
  {
  	name: 'Ambient',
  	tags: ['experimental', 'chillout', 'downtempo', 'Mellow', 'dark ambient', 'new age', 'minimal', 'easy listening', 'atmospheric', 'drone', 'ethereal', 'relaxing', 'minimalism', 'Dreamy', 'cinematic', 'minimalist', 'goa', 'chill out', 'ninja tune', 'piano ambient', 'ambient piano', 'chillwave']
  },
  {
  	name: 'Blues',
  	tags: ['blues', 'blues rock']
  },
  {
  	name: 'Classical',
  	tags: ['Classical', 'piano', 'contemporary classical', 'epic', 'neoclassical', 'baroque', 'composer', 'opera', 'modern classical', 'violin', 'orchestral', 'composers', 'post-classical', 'contemporary piano', 'neo-classical', 'cello', 'symphonic']
  },
  {
  	name: 'Classic Rock',
  	tags: [ 'classic rock', 'oldies', 'classic', 'glam rock', 'Southern Rock', 'hair metal', 'powerpop']
  },
  {
  	name: 'Country',
  	tags: ['country', 'Alt-country', 'rockabilly', 'americana', 'classic country']
  },
  {
  	name: 'Electronic/Dance',
  	tags: ['electronic', 'experimental', 'instrumental', 'dance', 'chillout', 'electronica', 'industrial', 'psychedelic', 'trance', 'House', 'electro', 'techno', 'downtempo', 'idm', 'synthpop', 'noise', 'Drum and bass', 'darkwave', 'ebm', 'dubstep', 'Disco', 'drone', 'electropop', 'psytrance', 'party', 'progressive trance', 'synth pop', 'remix', 'dark electro', 'noise rock', 'club', 'glitch', 'trip hop', 'dancehall', 'deep house', 'minimal techno', 'Progressive House', 'breakcore', 'bass', 'dnb', 'vocal trance', 'Drum n Bass', 'Electroclash', 'eurodance', 'indietronica', 'electro house', 'synth', 'tech house', 'goa', '8-bit', 'chill out', 'jungle', 'ninja tune', 'big beat', 'new rave', 'psychill', 'electro-industrial', 'psychedelic trance', 'uplifting trance', 'Rave', 'chillwave']
  },
  {
  	name: 'Folk',
  	tags: ['folk', 'folk rock', 'neofolk', 'indie folk', 'bluegrass', 'freak folk', 'folk-rock']
  },
  {
  	name: 'Funk',
  	tags: ['funk', 'funky', 'groovy']
  },
  {
  	name: 'Indie',
  	tags: ['alternative', 'indie', 'alternative rock', 'indie rock', 'chillout', 'psychedelic', 'post-rock', 'new wave', 'american', 'indie pop', 'emo', 'Grunge', 'britpop', 'synthpop', 'Mellow', 'new age', 'shoegaze', 'Lo-Fi', 'Garage Rock', 'dream pop', 'art rock', 'soft rock', 'Alt-country', 'emocore', 'indie folk', 'Dreamy', 'post-grunge', 'indietronica', 'chill out', 'underground', 'twee', 'freak folk', 'chillwave']
  },
  {
  	name: 'Jazz',
  	tags: ['jazz', 'Smooth Jazz', 'Fusion', 'acid jazz', 'nu jazz', 'saxophone', 'Bossa Nova', 'vocal jazz', 'jazz fusion', 'free jazz', 'jazzy', 'jazz vocal', 'jazz piano', 'nu-jazz', 'trumpet', 'contemporary jazz', 'bebop']
  },
  {
  	name: 'Oldies',
  	tags: ['new wave', 'oldies', 'Disco', 'swing', 'motown', 'Big Band']
  },
  {
  	name: 'Pop',
  	tags: ['pop', 'indie pop', 'britpop', 'synthpop', 'pop rock', 'j-pop', 'electropop', 'dream pop', 'JPop', 'synth pop', 'k-pop', 'mpb', 'power pop', 'futurepop', 'Pop-Rock', 'Kpop']
  },
  {
  	name: 'R&B and Soul',
  	tags: ['soul', 'rnb', 'rhythm and blues', 'r&b', 'gospel', 'Neo-Soul', 'urban']
  },
  {
  	name: 'Rap/Hip Hop',
  	tags: ['Hip-Hop', 'rap', 'hip hop', 'underground hip-hop', 'breakbeat', 'hiphop', 'Gangsta Rap', 'underground hip hop', 'breaks', 'instrumental hip-hop', 'urban', 'turntablism']
  },
  {
  	name: 'Reggae / Ska',
  	tags: ['reggae', 'ska', 'dub', 'Stoner Rock', 'dancehall', 'ska punk', 'stoner', 'roots reggae']
  },
  {
  	name: 'Rock',
  	tags: ['rock', 'alternative rock', 'classic rock', 'indie rock', 'hard rock', 'Progressive rock', 'british', 'punk rock', 'post-rock', 'new wave', 'emo', 'Psychedelic Rock', 'Grunge', 'britpop', 'ska', 'blues rock', 'pop rock', 'Progressive', 'shoegaze', 'J-rock', 'Stoner Rock', 'folk rock', 'Garage Rock', 'art rock', 'soft rock', 'rockabilly', 'glam rock', 'space rock', 'rock n roll', 'Rock and Roll', 'krautrock', 'post rock', 'Southern Rock', 'emocore', 'industrial rock', 'rapcore', 'Experimental Rock', 'christian rock', 'math rock', 'psychobilly', 'garage', 'post-grunge', 'jrock', 'power pop', 'stoner', 'Pop-Rock', 'powerpop', 'Surf', 'prog', 'folk-rock', 'melodic rock', 'Deutschrock']
  },
  {
  	name: 'Heavy Rock / Metal',
  	tags: ['metal', 'hard rock', 'black metal', 'death metal', 'hardcore', 'heavy metal', 'thrash metal', 'metalcore', 'Progressive metal', 'Melodic Death Metal', 'Power metal', 'emo', 'post-hardcore', 'doom metal', 'Gothic Metal', 'Gothic', 'screamo', 'Nu Metal', 'symphonic metal', 'grindcore', 'darkwave', 'folk metal', 'deathcore', 'industrial metal', 'alternative metal', 'Brutal Death Metal', 'hardcore punk', 'Gothic Rock', 'Sludge', 'Female fronted metal', 'Technical Death Metal', 'speed metal', 'viking metal', 'visual kei', 'noise rock', 'melodic hardcore', 'russian rock', 'post rock', 'atmospheric black metal', 'goth', 'depressive black metal', 'Post-Metal', 'melodic metal', 'mathcore', 'industrial rock', 'pagan metal', 'progressive death metal', 'melodic black metal', 'Symphonic Black Metal', 'math rock', 'groove metal', 'Nu-metal', 'Symphonic Rock', 'thrash', 'hair metal', 'goregrind', 'old school death metal', 'stoner metal', 'Doom', 'martial industrial', 'deathrock', 'raw black metal', 'NWOBHM', 'nsbm', 'Blackened Death Metal', 'sludge metal', 'Avant-garde Metal', 'hardstyle', 'post hardcore', 'heavy']
  },
  {
  	name: 'Punk',
  	tags: ['punk', 'punk rock', 'british', 'post-punk', 'pop punk', 'hardcore punk', 'emocore', 'Crust', 'psychobilly', 'ska punk', 'Oi', 'Post punk', 'horror punk']
  },
  {
  	name: 'World',
  	tags: ['japanese', 'german', 'french', 'russian', 'swedish', 'polish', 'j-pop', 'Canadian', 'finnish', 'J-rock', 'latin', 'celtic', 'deutsch', 'anime', 'italian', 'spanish', 'brazilian', 'UK', 'irish', 'australian', 'norwegian', 'Korean', 'brasil', 'mpb', 'english', 'icelandic', 'dutch', 'african', 'world', 'World Music', 'salsa', 'Ukrainian', 'Czech', 'germany', 'Scottish', 'Asian', 'chinese', 'ethnic', 'brazil', 'japan', 'france', 'turkish', 'arabic', 'Sweden', 'Flamenco', 'Greek', 'danish', 'tango', 'england', 'samba', 'balkan', 'traditional', 'Gypsy', 'scandinavian']
  },
  {
  	name: 'Other',
  	tags: ['instrumental', 'psychedelic', 'lounge', 'chill', 'Avant-Garde', 'melancholic', 'melancholy', 'christian', 'christmas', 'USA', 'romantic', 'Ballad', 'dark', 'relax', 'vocal', 'smooth', 'guitar virtuoso', 'medieval', 'avantgarde', 'old school', 'spoken word']
  }
];

module.exports = {
  getGenreFromTag: function(tag) {

  	return _.filter(genres, function(genre) {
  		return genre.tags.indexOf(tag) > -1;
  	})[0].name;
  }
}
