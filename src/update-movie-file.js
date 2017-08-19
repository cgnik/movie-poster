const ffmeta = require('ffmetadata')

ffmeta.read(process.argv[2], function(err, data) {
   if (err) console.error("Error reading metadata", err);
   else console.log(data);
});