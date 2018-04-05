let meta = require('ffmetadata');

const MOVIE_FIELD_MAP = {
   Title: 'title',
   Description: 'overview',
   comment: 'overview',
   Date: 'release_date'
};

const merge = (dst, src, map) => {
   if (dst && src && map) {
      Object.keys(map).forEach(k => dst[k] = src[map[k]] || dst[k]);
   }
   return dst;
};

const read = (file) => {
   let data = {};
   meta.read(file, (e, d) => (data = {error: e, data: d}))
   return data;
};

const write = (file, input) => {
   let err = null, data = null;
   meta.write(file, input, {preserveStreams: true}, (e, d) => {
      err = e;
      data = d;
   });
   return err == null;
};

module.exports = {
   merge: merge,
   read: read,
   write: write,
   MOVIE_FIELD_MAP: MOVIE_FIELD_MAP
};