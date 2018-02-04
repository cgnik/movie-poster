let urlencode = require('urlencode');
let moviedb = new (require('themoviedatabase'))(movieDbKey);
let fetch = require('isomorphic-fetch');


const fetchPoster = (base_url) => fetch(base_url + 'w780' + t["poster_path"]);
const config = () => moviedb.configuration();
const search = (name) => moviedb.search.movies({query: `${urlencode(name)}`}).then(r => r['results'] || []);
const configImageFetch = (name, data) => (data ? config() : Promise.reject(`No movie data for ${name} : ${data}`));


module.exports = {
   fetchPoster: fetchPoster,
   configImageFetch: configImageFetch,
   config: config,
   search: search
};


/* Examples
 *
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
