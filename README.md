# NYC Hurricane Evacuation Zone Finder

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

* The ```center.csv``` file included is a snapshot of the evacuation center data for development use only.
* The ```zone.json``` file included is a snapshot of the evacuation zone data for development use only.
* The ```order.csv``` file included is sample evacuation order data for development use only.
* In production ```center.csv```, ```zone.json``` and ```order.csv``` may change without notice and are regularly cached at a CDN.

## Geocoding:
* To use ```nyc.Geoclient``` as the implementation of ```nyc.Geocoder``` you must first get your Geoclient App ID and App Key from the NYC Developer Portal [https://developer.cityofnewyork.us/api/geoclient-api](https://developer.cityofnewyork.us/api/geoclient-api)
  * Register if you don't have an NYC Developer Portal account
  * Developer Management > View or Create a New Project...
  * Set ```hurricane.GEOCLIENT_URL='//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID'```
	
