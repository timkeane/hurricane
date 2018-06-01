new nyc.ol.FinderApp({
  title: 'Hurricane Zone Finder',
  splashContent: $('#hurricane-splash'),
  geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  facilityTabTitle: 'Evacutation Centers',
  facilityUrl: 'data/center.csv',
  facilityFormat: new nyc.ol.format.CsvPoint({
    x: 'X',
    y: 'Y',
    defaultDataProjection: 'EPSG:2263'
  }),
  facilityStyle: centerStyle,
  decorations: centerDecorations,
  directionsUrl: 'https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=pka&sensor=false&libraries=visualization'
});

var HurricaneApp = function(finderApp) {
}

var zoneSrc = new ol.source.Vector({
  format: new ol.format.TopoJSON(),
  url: 'data/zone.json'
})
var zoneLyr = new ol.layer.Vector({
  source: zoneSrc,
  style: zoneStyle,
  opacity: .6
});
finderApp.map.addLayer(zoneLyr);
finderApp.layer.setZIndex(1);

var filters = new nyc.ol.Filters({
  target: $('<div id="acc-filter"></div>'),
  source: finderApp.source,
  choiceOptions: [{
    radio: true,
    choices: [
      {name: 'ACCESSIBLE', values: ['N', 'Y'], label: 'All Centers', checked: true},
      {name: 'ACCESSIBLE', values: ['Y'], label: '<div></div>Only Accessible Centers', checked: false}
    ]
  }]
});
filters.on('change', finderApp.resetList, finderApp)
$('#facilities').prepend(filters.getContainer())