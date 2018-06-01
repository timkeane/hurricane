/**
 * @desc A class to manage hurricane evacuation messages
 * @public
 * @class
 * @extends {module:nyc/Content~Content}
 */
class HurricaneContent extends Content {
  /**
   * @desc Create an instance of HurricaneContent
   * @public
   * @constructor
   * @param {Object<string, string>|Array<Object<string, string>>} messages The messages with optional tokens mapped by message id
   */
  constructor(messages) {
	  super(messages)
  }
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {string} An HTML message
	 */
	locationMsg(location) {
		const zone = location.data ? location.data.hurricaneEvacuationZone : null,
		const name = location.name.replace(/,/, '<br>')
			html
		if (zone) {
			if (zone === 'X') {
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
	 * @private 
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

nyc.inherits(nyc.HurricaneContent, nyc.Content)