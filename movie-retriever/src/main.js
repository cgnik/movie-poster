retriever = require('./retriever.js');
// exec
retriever.configure(process.argv);
retriever.start(retriever.configureAndSpawnRetrieve);

/* Examples
 * http://api.themoviedb.org/3/movie/348/images/vMNl7mDS57vhbglfth5JV7bAwZp.jpg
 * https://image.tmdb.org/t/p/w396/uU9R1byS3USozpzWJ5oz7YAkXyk.jpg
 */
