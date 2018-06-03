
/**
 * @module hurricane/App
 */

import $ from 'jquery';
import hurricane from './hurricane';
import decorations from './decorations';
import style from './style';
import FinderApp from '@timkeane/nyc-lib/dist/nyc/ol/FinderApp'
import CsvPoint from  '@timkeane/nyc-lib/dist/nyc/ol/format/CsvPoint'
import Decorate from  '@timkeane/nyc-lib/dist/nyc/ol/format/Decorate'
import Filters from  '@timkeane/nyc-lib/dist/nyc/ol/Filters'
import Tabs from  '@timkeane/nyc-lib/dist/nyc/Tabs'

class App extends FinderApp {
  /**
   * @desc Create an instance of App
   * @public
   * @constructor
   * @param {module:hurricane.Content~Content} content The hurricane content
   */
  constructor(content) {
    super({
      title: 'Hurricane Zone Finder',
      splashContent: $('#hurricane-splash'),
      facilityUrl: hurricane.CENTER_URL,
      facilityFormat: new CsvPoint({
        x: 'X',
        y: 'Y',
        defaultDataProjection: 'EPSG:2263'
      }),
      facilityStyle: style.center,
      decorations: [content, decorations.center],
      geoclientUrl: hurricane.GEOCLIENT_URL,
      directionsUrl: hurricane.DIRECTIONS_URL
    })
    this.content = content
    this.layer.setZIndex(1);
  }
  /**
   * @access protected
   * @override
   * @method
   * @returns {module:nyc/ol/Filters~Filters}
   */
  createFilters() {
    const filters = new Filters({
      target: $('<div id="acc-filter"></div>'),
      source: this.source,
      choiceOptions: [{
        radio: true,
        choices: [
          {name: 'ACCESSIBLE', values: ['N', 'Y'], label: 'All Centers', checked: true},
          {name: 'ACCESSIBLE', values: ['Y'], label: '<div></div>Only Accessible Centers', checked: false}
        ]
      }]
    })
    filters.on('change', this.resetList, this)
    return filters
  }
  /**
   * @access protected
   * @method
   * @override
   * @returns {module:nyc/Tabs~Tabs}
   */
  createTabs() {
    const tabs = new Tabs({target: '#tabs', tabs: [
      {tab: '#map', title: 'Map'},
      {tab: '#facilities', title: 'Evacutation Centers'},
      {tab: $('<div id="legend"></div>'), title: 'Legend'}
    ]})
    tabs.on('change', this.resizeMap, this)
    $(window).resize($.proxy(this.adjustTabs, this))
    return tabs
  }
  /**
   * @access protected
   * @method
   * @param {module:nycLocator~Locator.Result} location
   */
  located(location) {
    super.located(location)
    this.popup.show({
      coordinate: location.coordinate,
      html: this.content.locationMsg(location)
    })
  }
  /**
   * @private
   * @method
   */
  addZoneLayer() {
    this.zoneSource = new OlSourceVector({
      format: new Decorate({
        parentFormat: new OlFormatTopoJSON(),
        decorations: [content, decorations.zone]
      }),
      url: hurricane.ZONE_URL
    })
    this.zoneLayer = new OlLayerVector({
      source: this.zoneSource,
      style: style.zone,
      opacity: .6
    });
    this.map.addLayer(this.zoneLayer)
  }
}

export default App