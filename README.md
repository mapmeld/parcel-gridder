# parcel-gridder

<img src="http://i.imgur.com/QETumnz.png"/>

## Requirements

Install node and npm

Then: ```npm install parcel-gridder -g```

## Usage

How parcel-gridder should work:

* load GeoJSON FeatureCollection of Polygons
* measure envelope / bbox of all features using Turf.js
* divide bounds into 25 (?) rectangles of equal size (5x5)
* remove excess squares
* use turf.intersect to return the polygons which intersect with the boundary
* save into multiple files for users

## Usage

### Command Line

```bash
parcelgridder source.geojson

# set a min area in square meters, calculated by TurfJS
parcelgridder source.geojson --minArea 10
```

### NodeJS

```javascript
makeParcelGrid(GeoJSONobject, function(err) {
  
}, minArea);
```

## Python files

Including some experimental Python files to do more / similar work

## License

Open source, MIT License
