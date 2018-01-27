const _ = require('lodash');

class MergeMap {
   constructor(propertyMap, constantMap) {
      this.propertyMap = propertyMap || {};
      this.constantMap = constantMap || {};
   }

   meta(data, propertyMap, constantMap) {
      if (data) {
         const pm = propertyMap || this.propertyMap;
         return _.extend(Object.keys(pm).reduce((accum, k) => {
            if (data[pm[k]]) {
               accum[k] = data[pm[k]];
            }
            return accum;
         }, {}), constantMap || this.constantMap);
      }
      return {};
   }
}

module.exports = MergeMap;