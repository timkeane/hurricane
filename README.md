[![Build Status](https://travis-ci.org/timkeane/hurricane.svg?branch=master)](https://travis-ci.org/timkeane/hurricane) [![Coverage Status](https://coveralls.io/repos/github/timkeane/hurricane/badge.svg?branch=master)](https://coveralls.io/github/timkeane/hurricane?branch=master) 
# NYC Hurricane Evacuation Zone Finder

This app is a stand-alone HTML5 app that can be dropped into the doc root of any web server.

* The `center.csv` file included is a snapshot of the evacuation center data for development use only.
* The `zone.json` file included is a snapshot of the evacuation zone data for development use only.
* The `order.csv` file included is sample evacuation order data for development use only.
* In production `center.csv`, `zone.json` and `order.csv` may change without notice and are regularly cached at a CDN.

## Install
```
yarn install
yarn global add postcss-cli
```

The file `node_modules/nyc-lib/css/roll-css.sh` needs to have execute permissions, so you need to modify it after install, e.g. with (the exact command might depend on your OS):

```
chmod +x node_modules/nyc-lib/css/roll-css.sh
```

## Test
`yarn test`

## Build

Set the following variables in .env file

```
GEOCLIENT_KEY
GOOGLE_ANALYTICS
GOOGLE_DIRECTIONS
```

### Staging

Set additional variable in .env

```
STG_GEOCLIENT_HOST
STG_OL_TILE_HOST
```

```
export NODE_ENV=stg
yarn build
```

### Production
```
export NODE_ENV=prd
yarn build
```
