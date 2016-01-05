#!/usr/bin/python

# reads in a traced GeoJSON file
# removes squares (since these are usually little squares along the lines in the trace)
# removes holes in polygons (since these are usually numbers and text inside of parcels)

import os, sys, json

if len(sys.argv) < 2:
    print('python cleanup-trace.py TRACED.GEOJSON')
else:
    gjsrc = sys.argv[1]
    gj = json.load(open(gjsrc, 'r'))
    output_gj = { "type": "FeatureCollection", "features": [] }

    for feature in gj['features']:
        if feature['geometry']['type'] == 'Polygon':
            vertices_count = len(feature['geometry']['coordinates'][0])
            if vertices_count == 5:
                continue
            feature['geometry']['coordinates'] = [feature['geometry']['coordinates'][0]]

        output_gj['features'].append(feature)

    open('trace-clean-tmp.geojson', 'w').write(json.dumps(gj))
    shpdir = gjsrc.replace('.geojson', '').replace('.json', '').replace('geojson', '').replace('json', '').replace('.geo.json', '')
    try:
        os.mkdir(shpdir)
    except:
        print('overwriting old shapefile')
    os.system('ogr2ogr -f \'ESRI Shapefile\' ' + shpdir + '/square.shp trace-clean-tmp.geojson -overwrite')
