let meta = require('ffmetadata');

const MOVIE_FIELD_MAP = {
   Title: 'title',
   Description: 'description',
   comment: 'description'
};
const update = (dst, src, map) => {
   if (dst && src && map) {
      Object.keys(map).forEach(k => dst[k] = src[map[k]] || dst[k]);
   }
   return dst;
};

module.exports = {
   update: update
};