let urlencode = require('urlencode');
let moviedb = new (require('themoviedatabase'))(movieDbKey);
let fetch = require('isomorphic-fetch');


const movieImageFileFetch = (base_url) => fetch(base_url + 'w780' + t["poster_path"]);
const movieConfig = () => moviedb.configuration();
const movieSearch = (name) => moviedb.search.movies({query: `${urlencode(name)}`}).then(r => r['results'] || []);
const movieImageFetch = (name, data) => (data ? movieConfig() : Promise.reject(`No movie data for ${name} : ${data}`));


module.exports = {
   movieImageFileFetch: movieImageFileFetch,
   movieImageFetch: movieImageFetch,
   movieConfig: movieConfig,
   movieSearch: movieSearch
};


/* Examples
 *
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
