/**
 * @module hurricane/messages
 */

 /**
	* @desc Message template
	* @public
	* @const {Object<>string, string}
	*/
const messages = {
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
	acc_feat: '<ul class="rad-all dtl"><li>${ACC_FEAT}</li><li>Access to the main shelter areas will be unobstructed and without steps.</li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots, storage space for refrigerated medication, power strips for charging mobility and other accessibility devices, and mobility aids (canes, crutches, manual wheelchairs, etc.).</li><li>Auxiliary aids and services will be available, including sign language interpreters, sound amplifiers, and documents in alternative formats.</li></ul>'
}

export default messages
