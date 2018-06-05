
/**
 * @module hurricane/App
 */

import $ from 'jquery'
import hurricane from './hurricane'
import decorations from './decorations'
import style from './style'
import FinderApp from '@timkeane/nyc-lib/dist/nyc/ol/FinderApp'
import CsvPoint from  '@timkeane/nyc-lib/dist/nyc/ol/format/CsvPoint'
import Decorate from  '@timkeane/nyc-lib/dist/nyc/ol/format/Decorate'
import Filters from  '@timkeane/nyc-lib/dist/nyc/ol/Filters'
import FeatureTip from '@timkeane/nyc-lib/dist/nyc/ol/FeatureTip';
import Tabs from  '@timkeane/nyc-lib/dist/nyc/Tabs'
import Slider from  '@timkeane/nyc-lib/dist/nyc/Slider'

import OlFormatTopoJSON from 'ol/format/topojson'
import OlSourceVector from 'ol/source/vector'
import OlLayerVector from 'ol/layer/vector'

class App extends FinderApp {
  /**
   * @desc Create an instance of App
   * @public
   * @constructor
   * @param {module:hurricane.Content~Content} content The hurricane content
   */
  constructor(content) {
    const centers = content.message('filter_centers')
    super({
      title: `<span><span><span>${content.message('banner_text')}</span></span></span>`,
      splashOptions: {
        message: `<div class="orders">${content.message('splash_msg')}</div>`,
        buttonText: [content.message('btn_text')]
      },
      facilityUrl: hurricane.CENTER_URL,
      facilityFormat: new CsvPoint({
        x: 'X',
        y: 'Y',
        defaultDataProjection: 'EPSG:2263'
      }),
      facilityStyle: style.center,
      facilityTabTitle: content.message('centers_tab'),
      decorations: [{content: content}, decorations.center],
      filterChoiceOptions: [{
        radio: true,
        choices: [
          {name: 'ACCESSIBLE', values: ['N', 'Y'], label: `All ${centers}`, checked: true},
          {name: 'ACCESSIBLE', values: ['Y'], label: `<div></div>Only accessible ${centers}`}
        ]
      }],
      geoclientUrl: hurricane.GEOCLIENT_URL,
      directionsUrl: hurricane.DIRECTIONS_URL
    })
    this.layer.setZIndex(1)
    this.content = content
    this.addZoneLayer(content)
    this.createSlider()
    this.renderEvacOrder(content)
    this.renderPrePostStorm(content)
  }
  /**
   * @access protected
   * @override
   * @method
   * @param {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>=} choiceOptions
   * @returns {module:nyc/ol/Filters~Filters}
   */
  createFilters(choiceOptions) {
    const filters = new Filters({
      target: $('<div id="acc-filter"></div>'),
      source: this.source,
      choiceOptions: choiceOptions
    })
    $('#facilities').prepend(filters.getContainer())
      .prepend('<div class="note"></div>')
    filters.on('change', this.resetList, this)
    return filters
  }
  /**
   * @access protected
   * @method
   * @override
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options
   * @returns {module:nyc/Tabs~Tabs}
   */
  createTabs(options) {
    const tabs = new Tabs({target: '#tabs', tabs: [
      {tab: '#map', title: 'Map'},
      {tab: '#facilities', title: options.facilityTabTitle},
      {tab: '#legend', title: 'Legend'}
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
    $('.pop').attr('tabindex', 0).focus()
  }
  /**
   * @private
   * @method
   * @param {module:hurricane/Content~Content}
   */
  addZoneLayer(content) {
    this.zoneSource = new OlSourceVector({
      format: new Decorate({
        parentFormat: new OlFormatTopoJSON(),
        decorations: [{content: content}, decorations.zone]
      }),
      url: hurricane.ZONE_URL
    })
    this.zoneLayer = new OlLayerVector({
      source: this.zoneSource,
      style: style.zone,
      opacity: .55
    })
    this.map.addLayer(this.zoneLayer)
    this.popup.addLayer(this.zoneLayer)
    new FeatureTip({
      map: this.map,
      tips: [{
        layer: this.zoneLayer,
        label: (feature) => {
          return {
            css: 'zone',
            html: feature.content.message('zone_tip', {
              zone: feature.getZone(),
              order: feature.content.zoneMsg()
            })
          }
        }
      }]
    })
  }
  /**
   * @private
   * @method
   */
  createSlider() {
    const slider = new Slider({
      target: '#transparency',
      min: 0,
      max: 100,
      value: 45,
      units: '%',
      label: 'Zone Transparency:'
    })
    slider.on('change', this.zoneOpacity, this)
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Slider~Slider}
   */
  zoneOpacity(slider) {
    const opacity = (100 - slider.val()) / 100
    this.zoneLayer.setOpacity(opacity)
    $('.leg-sw.zone').css('opacity', opacity)
  }
  /**
   * @private
   * @method
   * @param {module:hurricane/Content~Content}
   */
  renderEvacOrder(content) {
    let zones = 'Zone '
    const evacuations = content.evacuations
    if (evacuations.length && content.messages.post_storm === 'NO') {
      const orders = content.message('splash_yes_order')
      $('body').addClass('active-order')
      $('.dia-container.splash').append('<div id="patch"></div>')
      $('.orders').html(orders)
			if (evacuations.length > 1) {
				zones = 'Zones '
			}
			evacuations.forEach((zone, i) => {
				zones += zone
				zones += (i === evacuations.length - 2) ? ' and ' : ', '								
      })
      zones = zones.substr(0, zones.length - 2)
			$('.orders').append(content.message('splash_zone_order', {zones: zones}))
      $(`<h2 class="alert"><div><div>${orders}</div></div></h2>`).insertAfter('#banner')
      $('.alert div>div>div').append(` ${zones}`)
		}
  }
  /**
   * @private
   * @method
   * @param {module:hurricane/Content~Content}
   */
  renderPrePostStorm(content) {
    const title = `NYC ${content.message('banner_text')}`
		document.title = title
    $('#home').attr('title', title)		
		$('#legend .center').html(content.message('legend_center'))		
		$('#facilities .note').html(content.message('centers_msg'))		
		$('#legend .note.top').html(content.message('legend_msg'))			
  }
}

export default App