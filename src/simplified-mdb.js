let urlencode = require('urlencode');
let moviedb = new (require('themoviedatabase'))(movieDbKey);
let fetch = require('isomorphic-fetch');
let util = require('./simplified')

const config = () => moviedb.configuration().then(c => Promise.resolve(c.images.base_url));
const match = (name, titles) => Promise.resolve(titles[util.titleMatch(name, titles.map(t => t.title))]);
const search = (name) => moviedb.search.movies({query: `${urlencode(name)}`, language: "en-US"}).then(r => Promise.resolve(r.results || []));
const poster = (base, movie) => fetch(base + 'w780' + movie.poster_path).then(r => r.status < 300 ? Promise.resolve(r.body) : Promise.reject("No body"));
const check = (base_url, data) => (data ? poster(base_url, data) : Promise.reject(`No movie data : ${data}`));

module.exports = {
   config: config,
   search: search,
   match: match,
   check: check,
   poster: poster
};

/* Examples
 *
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */

// each file: config.[each search.match.check]
