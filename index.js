var fs = require('fs');
var turf = require('turf');

function makeParcelGrid(gj, callback) {

  // get box surrounding entire feature collection
  var box = turf.envelope(gj).geometry.coordinates[0];

  // console.log(JSON.stringify(box.geometry.coordinates[0]));
  // [[80.25510579800448,12.994117712984968],[80.27536802107099,12.994117712984968],[80.27536802107099,13.011951026715028],[80.25510579800448,13.011951026715028],[80.25510579800448,12.994117712984968]]

  // divide up the bounding box
  var xmin = box[0][0];
  var xmax = box[1][0];
  var ymin = box[0][1];
  var ymax = box[2][1];
  var xgap = xmax - xmin;
  var ygap = ymax - ymin;

  // make the feature envelopes one time by saving them in envelopes[]
  var envelopes = [];

  function doSquare(x, y) {
    // get a GeoJSON square at this x/y coordinate
    var mySquare = turf.bboxPolygon([xmin + x * xgap / 5, ymin + y * ygap / 5, xmin + (x+1) * xgap / 5, ymin + (y+1) * ygap / 5]);

    // make a list of GeoJSON features which are seen for the first time while looking at this square
    var msgj = {
      type: "FeatureCollection",
      features: []
    };

    for (var f = 0; f < gj.features.length; f++) {
      if (f >= envelopes.length) {
        // on the first pass, we will calculate the envelope for each individual feature
        envelopes.push(turf.envelope({ type: "FeatureCollection", features: [gj.features[f]]}));
      }

      // features which have not been seen before
      if (envelopes[f]) {
        // features which are Polygons (and not MultiPolygons)
        if (gj.features[f].geometry.type === "Polygon") {
          // check if the feature is inside the square
          if (turf.intersect(envelopes[f], mySquare)) {
            msgj.features.push(gj.features[f]);
            // setting to zero prevents this feature from being re-added
            envelopes[f] = 0;
          }
        } else {
          console.log('feature is not a polygon');
          console.log(JSON.stringify(gj.features[f]));
        }
      }
    }

    function nextSquare() {
      // advance to next square (usually the next column)
      x++;
      if (x >= 5) {
        // now go to the next row and first column
        y++;
        x = 0;
      }
      if (y >= 5) {
        // finished, do callback if possible
        if (typeof callback === 'function') {
          return callback();
        }
        return;
      }
      // move to next square
      doSquare(x, y);
    }

    console.log('finishing square ' + [x,y].join(','));
    if (msgj.features.length) {
      console.log(msgj.features.length);
      fs.writeFile(['square',x,y].join('-') + '.geojson', JSON.stringify(msgj), function (err) {
        if (err) {
          return callback(err);
        }
        nextSquare();
      });
    } else {
      nextSquare();
    }
  }

  // start at top left (0, 0)
  doSquare(0, 0);
}

module.exports = makeParcelGrid;
