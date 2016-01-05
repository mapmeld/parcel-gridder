#!/usr/bin/python

# reads the geo bounds from a KML/KMZ file
# applies them to a PNG or TIF
# uses gdal_translate command to save as a GeoTIFF

import sys, os, zipfile

if len(sys.argv) < 3:
    print('python georeference.py KML-or-KMZ PNG-or-TIF')
else:
    arg1 = sys.argv[1]
    arg2 = sys.argv[2]
    kml = None
    png = None
    if arg1.find('png') > -1 or arg2.find('kml') > -1 or arg2.find('kmz') > -1:
        png = arg1
        kml = arg2
    else:
        png = arg2
        kml = arg1
    tif = png.replace('png', 'tif')
    if tif == png:
        tif = tif + '.tif'
    if kml.find('kmz') > -1:
        fh = open(kml, 'rb')
        z = zipfile.ZipFile(fh)
        for name in z.namelist():
            if name.find('kml') > -1:
                z.extract(name, 'kmltmp')
                break
        kml = 'kmltmp'
    kmlsrc = open(kml, 'r').read()
    if kmlsrc.find('<north>') == -1 or kmlsrc.find('<south>') == -1 or kmlsrc.find('<east>') == -1 or kmlsrc.find('<west>') == -1:
        print('this file is not an image with north, south, east, and west boundaries =(')
    else:
        north = kmlsrc[kmlsrc.find('<north>') + 7 : kmlsrc.find('</north>')]
        south = kmlsrc[kmlsrc.find('<south>') + 7 : kmlsrc.find('</south>')]
        east = kmlsrc[kmlsrc.find('<east>') + 6 : kmlsrc.find('</east>')]
        west = kmlsrc[kmlsrc.find('<west>') + 6 : kmlsrc.find('</west>')]
        print('running the converter')
        os.system('gdal_translate -a_srs WGS84 -a_ullr ' + ' '.join([west, north, east, south, png, tif]))
