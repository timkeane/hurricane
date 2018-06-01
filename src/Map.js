import Basemap from '@timkeane/nyc-lib/dist/nyc/ol/Basemap'

class Map extends Basemap {
  constructor(target) {
    super({target: target})
  }
}

export default Map