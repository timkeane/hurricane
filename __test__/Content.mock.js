import HurricaneContent from '../src/js/Content'
import Content from 'nyc-lib/nyc/Content'

class MockContent extends Content {
  constructor() {
    super([{
      yes_order: '<div class="order active">${oem_supplied}</div>',
      no_order: '<div class="order">${oem_supplied}</div>',
      splash_yes_order: '<div>an evacuation order is in effect for</div>',
      splash_zone_order: '<div class="zone">${zones}</div>',
      location_no_zone: '<h2 class="notranslate">${oem_supplied}</h2><div>${name}</div>',
      location_zone_order: '<h2 class="notranslate">${oem_supplied}<br>${order}</h2><div>${name}</div>',
      location_zone_unkown: '<h2 class="notranslate">${oem_supplied}</h2><div>${name}</div>',
      location_zone_unkown_311: '<div><div>${oem_supplied}</div><div>${name}</div></div>',
      zone_info: '<h2>Zone ${zone}</h2><div>${order}</div>',
      zone_tip: '<div>evacuation zone ${zone}</div><div>${order}</div>',
      acc_feat: '<ul class="rad-all dtl"><li>${ACC_FEAT}</li><li>Access to the main shelter areas will be unobstructed and without steps.</li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots, storage space for refrigerated medication, power strips for charging mobility and other accessibility devices, and mobility aids (canes, crutches, manual wheelchairs, etc.).</li><li>Auxiliary aids and services will be available, including sign language interpreters, sound amplifiers, and documents in alternative formats.</li></ul>',
      post_storm: 'NO',
      banner_text: 'hurricane evacuation zone finder',
      splash_msg: 'No evacuation order currently in effect',
      btn_text: '<span>view map</span><br><span>to find your evacuation zone</span>',
      centers_tab: 'evacuation centers',
      filter_centers: 'centers',
      centers_msg: 'If you are required to evacuate, it is recommended that you shelter at the home of friends or family outside of the evacuation area. If you wish to go to a public facility, select any evacuation center from the following list and click for travel directions.',
      legend_msg: '<p>Use the NYC Hurricane Evacuation Zone Finder to find out if your address is in a hurricane evacuation zone. The best way to be prepared for the possibility of a hurricane evacuation is to know your evacuation zone, and plan your destination and travel routes ahead of time. Zones are color-coded and labeled 1, 2, 3, 4, 5, and 6 when represented on a map.</p><p>Information on evacuation centers is subject to change. Please revisit this site for updated reports on building status and wheelchair accessibility features.</p>',
      legend_center: 'evacuation center',
      user_in_x_zone: 'You are not located in an Evacuation Zone',
      user_zone_unkown: 'Zone Finder cannot determine Zone for your address.<br>Try alternative address or determine Zone by examining map and clicking on your location.',
      user_zone_unkown_311: 'Zone Finder cannot determine Zone for your address.<br>Try alternative address.',
      user_zone: 'You are located in Zone ${zone}',
      evac_order: 'You are required to evacuate',
      no_evac_order: 'No evacuation order currently in effect'
    }])
    this.zoneOrders = {'3': true}
    this.evacuations = ['3']
    this.locationMsg = HurricaneContent.prototype.locationMsg
    this.unkownZone = HurricaneContent.prototype.unkownZone
    this.zoneMsg = HurricaneContent.prototype.zoneMsg
  }
}

export default MockContent