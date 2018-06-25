/**
 * @module hurricane
 */

import nyc from 'nyc-lib/nyc'

/**
 * @private
 * @const {string} 
 */ 
const cacheBust = nyc.cacheBust(5)

/**
* @desc Constants
* @public
* @const {Object<string, string>}
*/
const hurricane = {
  CENTER_URL: `data/center.csv?${cacheBust}`,
  ORDER_URL: `data/order.csv?${cacheBust}`,
  ZONE_URL: `data/zone.json?${cacheBust}`,
  CONTENT_URL: `data/content.csv?${cacheBust}`,
  GEOCLIENT_URL: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  DIRECTIONS_URL: 'https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=pka&sensor=false&libraries=visualization',
  SURFACE_WATER_ZONE: '0',
  NO_ZONE: 'X'
}

export default hurricane