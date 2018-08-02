/**
 * @module hurricane/App
 */

import $ from 'jquery'
import hurricane from './hurricane'
import decorations from './decorations'
import style from './style'

import nyc from 'nyc-lib/nyc'
import Locator from 'nyc-lib/nyc/Locator'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import Filters from 'nyc-lib/nyc/ol/Filters'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import Tabs from 'nyc-lib/nyc/Tabs'
import Slider from 'nyc-lib/nyc/Slider'

import olExtent from 'ol/extent'
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
   * @param {module:hurricane/Content~Content} content The hurricane content
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
    /**
     * @private
     * @member {module:nyc/ol/FeatureTip~FeatureTip}
     */
    this.zoneTip = null
    this.addZoneLayer(content)
    this.renderEvacOrder(content)
    this.renderPrePostStorm(content)
    this.createSlider()
  }
  /**
   * @access protected
   * @override
   * @method
   * @param {Array<module:nyc/ol/Filters~Filters.ChoiceOptions>=} choiceOptions
   * @return {module:nyc/ol/Filters~Filters}
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
    $('#acc-filter input').focus(() => {
      $('#acc-filter div[role="radiogroup"]').addClass('focused')
    })
    $('#acc-filter input').blur(() => {
      $('#acc-filter div[role="radiogroup"]').removeClass('focused')
    })    
    return filters
  }
  /**
   * @access protected
   * @method
   * @override
   * @param {module:nyc/ol/FinderApp~FinderApp.Options} options
   * @return {module:nyc/Tabs~Tabs}
   */
  createTabs(options) {
    $('#tabs').attr('aria-hidden', true)
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
   * @param {module:nyc/Locator~Locator.Result} location
   */
  located(location) {
    super.located(location)
    const popup = this.popup
    const tabs = this.tabs
    const html = this.locationMsg(location)
    const feature = new OlFeature({
      geometry: new OlGeomPoint(location.coordinate)
    })
    feature.html = () => {return html}
    popup.showFeatures([feature])
    $(popup.getElement()).attr('tabindex', 0).focus()
      .find('.btn-x').one('click', () => {
        tabs.open('#facilities')
      })
  }
  /**
   * @private
   * @method
   * @param {module:nycLocator~Locator.Result} location
   * @return {string}
   */
  locationMsg(location) {
    const html = this.content.locationMsg(location)
    if (html) {
      return html
    }
    return this.queryZone(location)
  }
  /**
   * @private
   * @method
   * @param {module:nycLocator~Locator.Result} location
   * @return {string}
   */
	queryZone(location) {
		let features = []
		if (location.accuracy === Locator.Accuracy.HIGH) {
			features = this.zoneSource.getFeaturesAtCoordinate(location.coordinate)
		} else {
			const extent = olExtent.buffer(
        olExtent.boundingExtent([location.coordinate]), 
        this.locationMgr.locator.accuracyDistance(location.accuracy)
      )
			this.zoneSource.forEachFeatureIntersectingExtent(extent, feature => {
				features.push(feature)
			})
		}
		if (features.length === 0 || features.length > 1) {
			return this.content.unkownZone(location)
		} else {
      return this.content.locationMsg(location, features[0].getZone())
		}
	}
  /**
   * @access protected
   * @method
   * @param {Object} event
   */
  expandDetail(event) {
    const popup = this.popup
    const btn = $(event.currentTarget)
    const content = btn.next()
    const expanded = 'true' === btn.attr('aria-pressed')
    btn.attr('aria-pressed', !expanded)
    content.attr({
      'aria-hidden': expanded,
      'aria-expanded': !expanded,
      'aria-collapsed': expanded
    }).slideToggle(() => {popup.pan()})
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
      opacity: .35
    })
    this.map.addLayer(this.zoneLayer)
    this.popup.addLayer(this.zoneLayer)
    this.zoneTip = new FeatureTip({
      map: this.map,
      tips: [{
        layer: this.zoneLayer,
        label: (feature) => {
          const zone = feature.getZone()
          return {
            css: 'zone',
            html: feature.content.message('zone_tip', {
              zone: zone,
              order: feature.content.zoneMsg(zone)
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
    const id = nyc.nextId('sld')
    $('#slider-map .slider').attr({
      id: id,
      'aria-label': 'Zone Transparency',
      'aria-expanded': false,
      'aria-collapsed': true,
      'aria-hidden': true
    })
    this.btnSlider = new Slider({
      target: '#slider-map .slider',
      min: 0,
      max: 100,
      value: 65,
      units: '%',
      label: 'Zone Transparency:'
    })
    this.legendSlider = new Slider({
      target: '#leg-slider',
      min: 0,
      max: 100,
      value: 65,
      units: '%',
      label: 'Zone Transparency:'
    })
    $('#slider-map .btn').attr({
      'aria-controls': id,
      'aria-pressed': false
    }).click($.proxy(this.toggleSlider, this))
    this.btnSlider.on('change', this.zoneOpacity, this)
    this.legendSlider.on('change', this.zoneOpacity, this)
  }
  /**
   * @private
   * @method
   */
  toggleSlider() {
    const slider = $('#slider-map .slider')
    const show = slider.css('display') === 'none'
    slider.slideToggle(() => {
      $('#slider-map .btn').attr('aria-pressed', show)
      slider.attr({
        'aria-expanded': show,
        'aria-collapsed': !show,
        'aria-hidden': !show
      })
    })
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
  /**
   * @desc Handles features after they are loaded
   * @access protected
   * @method
   * @param {Array<ol.Feature>} features The facility features
   */
  ready(features) {
    super.ready(features)
    const div = $(this.map.getTargetElement())
    const i = setInterval(() => {
      if ($('div.shr').length) {
        div.append($('#slider-map'))
        clearInterval(i)
      }
    }, 500)
  }
}

export default App