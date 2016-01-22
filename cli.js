#! /usr/bin/env node

const fs = require('fs');
const program = require('commander');

var makeParcelGrid = require('./index.js');

program
  .version('1.1.1')
  .arguments('<geojsonFile>')
  .option('-a --minArea <area>', 'minimum area in square meters', /(.*)/, 0)
  .parse(process.argv);

if (process.argv.length < 3) {
  console.log('specify a file: parcelgridder test.geojson')
} else if (!fs.existsSync(process.argv[2])) {
  console.log('that file does not exist');
} else {
  fs.readFile(process.argv[2], { encoding: 'utf-8' }, function (err, gjsrc) {
    if (err) {
      throw err;
    }

    var gj = JSON.parse(gjsrc);
    makeParcelGrid(gj, function(err) {
      if (err) {
        console.log('Error in script:');
        console.log(JSON.stringify(err));
      } else {
        console.log('done');
      }
    }, program.minArea);
  });
}
