
/**
 * @module hurricane/App
 */

import $ from 'jquery'
import hurricane from './hurricane'
import decorations from './decorations'
import style from './style'

import nyc from 'nyc-lib/nyc'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import Filters from 'nyc-lib/nyc/ol/Filters'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip';
import Tabs from 'nyc-lib/nyc/Tabs'
import Slider from 'nyc-lib/nyc/Slider'

import OlFeature from 'ol/feature'
import OlGeomPoint from 'ol/geom/point'
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
      title: `<table><tbody><tr><td><div>${content.message('banner_text')}</div></td></tr></tbody></table>`,
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
      facilitySearchOptions: {
        layerName: 'evac-center',
        nameField: 'OEM_LABEL',
        displayField: 'label'
      },
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
    /**
     * @private
     * @member {ol.source.Vector}
     */
    this.zoneSource = null
    /**
     * @private
     * @member {ol.layer.Vector}
     */
    this.zoneLayer = null
    /**
     * @private
     * @member {module:nyc/Slider~Slider}
     */
    this.btnSlider = null
    /**
     * @private
     * @member {module:nyc/Slider~Slider}
     */
    this.legendSlider = null
    this.addZoneLayer(content)
    this.createSlider(this.map)
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
    filters.find('input').addClass('screen-reader-only')
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
    if (options.splashOptions) {
      $('#tabs').attr('aria-hidden', true)
    }
    const tabs = new Tabs({target: '#tabs', tabs: [
      {tab: '#map', title: 'Map'},
      {tab: '#facilities', title: options.facilityTabTitle},
      {tab: '#legend', title: 'Legend'}
    ]})
    tabs.on('change', this.tabChange, this)
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
    const popup = this.popup
    const tabs = this.tabs
    const feature = new OlFeature({
      geometry: new OlGeomPoint(location.coordinate)
    })
    feature.html = () => {
      return this.content.locationMsg(location)
    }
    popup.hide()
    setTimeout(() => {
      popup.showFeatures([feature])
      $('.pop').attr('tabindex', 0).focus()
      $('.pop').find('.btn-x').one('click', () => {
        tabs.open('#facilities')
      })
    }, 500)
  }
  /**
   * @access protected
   * @method
   * @param {Object} event
   */
  expandDetail(event) {
    const popup = this.popup
    const target = $(event.currentTarget)
    const expanded = 'true' === target.attr('aria-expanded')
    target.attr('aria-expanded', !expanded)
    target.attr('aria-collapsed', expanded)
      .next().slideToggle(() => {
        popup.pan()
      })
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
  createSlider(map) {
    $(map.getTargetElement()).append($('#slider-map'))
    this.btnSlider = new Slider({
      target: '#slider-map .slider',
      min: 0,
      max: 100,
      value: 45,
      units: '%',
      label: 'Zone Transparency:'
    })
    this.legendSlider = new Slider({
      target: '#leg-slider',
      min: 0,
      max: 100,
      value: 45,
      units: '%',
      label: 'Zone Transparency:'
    })
    $('#slider-map .btn').click(() => {$('#slider-map .slider').slideToggle()})
    this.btnSlider.on('change', this.zoneOpacity, this)
    this.legendSlider.on('change', this.zoneOpacity, this)
  }
  /**
   * @private
   * @method
   * @param {module:nyc/Slider~Slider}
   */
  zoneOpacity(slider) {
    const val = slider.val()
    const opacity = (100 - val) / 100
    this.zoneLayer.setOpacity(opacity)
    this.legendSlider.val(val)
    this.btnSlider.val(val)
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
      $('.alert div>div>div').html(`${$('.alert div>div>div').html()} ${zones}`)
		}
  }
  /**
   * @private
   * @method
   * @param {module:hurricane/Content~Content}
   */
  renderPrePostStorm(content) {
    const title = `NYC ${nyc.capitalize(content.message('banner_text'))}`
		document.title = title
    $('#home').attr('title', title)		
		$('#legend .center').html(content.message('legend_center'))		
		$('#facilities .note').html(content.message('centers_msg'))		
		$('#legend .note.top').html(content.message('legend_msg'))			
  }
}

export default App