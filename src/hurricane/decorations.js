/**
 * @module hurricane/decorations
 */

const decorations = {
  center: {    
    getName() {
      return this.get('OEM_LABEL')
    },
    getAddress1() {
      return this.get('BLDG_ADD')
    },
    getAddress2() {
      return `Between ${this.get('CROSS1')} and ${this.get('CROSS2')}`
    },
    getCityStateZip() {
      return `${this.get('CITY')} , NY ${this.get('ZIP_CODE')}`
    },
    cssClass() {
      return this.get('ACCESSIBLE') == 'Y' ? 'acc' : ''
    },
    detailsHtml() {
      const detail = this.get('ACC_FEAT')
      if (detail) {
        return $('<ul class="rad-all details"></ul>')
          .append('<li>${detail}</li>')
          .append('<li>generic</li>')
      }
    },
    detailsCollapsible() {
      const details = this.detailsHtml()
      if (details) {
        return $('<a class="btn rad-all details"></a>')
        .html('<span class="screen-reader-only">Click for accessibility </span>')
        .append('Details...')
        .attr('onclick', '$(this).next().slideToggle()')  
        .add(details)
      }
    }
  },
  zone: {
    getZone() {
      return this.get('zone')
    },
    isSurfaceWater() {
      return this.getZone() === nyc.SURFACE_WATER_ZONE
    },
    html() {
      var zone = this.getZone()
      if (!this.isSurfaceWater()) {
        return this.message('zone_info', {zone: zone, order: this.zoneMsg(zone)})
      }
    }
  }
}

export default decorations