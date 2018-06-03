/**
 * @module hurricane/Content
 */

import $ from 'jquery'
import hurricane from './hurricane'
import messages from './messages'
import NycContent from '@timkeane/nyc-lib/dist/Content'

/**
 * @desc A class to manage hurricane evacuation messages
 * @public
 * @class
 * @mixes module:nyc/Content~Content
 */
class Content {
  /**
   * @desc Create an instance of Content
   * @public
	 * @param {module:hurricane/Content~Content#callback}
   * @constructor
   */
  constructor(callback) {
		Content.loadCsv({
			url: hurricane.CONTENT_URL,
			messages: [messages]
		}).then(content => {
			$.extend(this, content)
			callback(this)
		})
  }
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {string} An HTML message
	 */
	locationMsg(location) {
		const zone = location.data ? location.data.hurricaneEvacuationZone : null
		const name = location.name.replace(/,/, '<br>')
		if (zone) {
			if (zone === hurricane.NO_ZONE) {
				return this.message('location_no_zone', {
					name: name, 
					oem_supplied: this.message('user_in_x_zone')
				})
			} else {
				return this.message('location_zone_order', { 
					order: this.zoneMsg(zone), 
					name: name, 
					oem_supplied: this.message('user_zone', {zone: zone})
				})			
			}
		}
	}
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {string} zone
	 * @return {string}
	 */
	zoneMsg(zone) {
		if (this.zoneOrders[zone]){
			return this.message('yes_order', {
				oem_supplied: this.message('evac_order')
			})
		}else{
			return this.message('no_order', {
				oem_supplied: this.message('no_evac_order')
			})
		}
	}
}

/**
 * @desc Callback for {@link module:hurricane/Content~Content}
 * @public
 * @callback module:hurricane/Content~Content#callback
 * @param {module:hurricane/Content~Content} content The finalized instance
 */

export default Content