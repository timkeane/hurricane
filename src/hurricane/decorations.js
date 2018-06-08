import hurricane from "./hurricane";

/**
 * @module hurricane/decorations
 */

const decorations = {
  center: {
    extendFeature() {
      const label = $(`<span>${this.getName()}</span>`)
      if (this.isAccessible()) label.addClass('acc')
      this.set('label', label)
    },
    getName() {
      const name = this.get('OEM_LABEL')
      if (this.isAccessible()){
        return `${name}<span class="screen-reader-only"> - this is an accessible facility</span>`
      } else {
        return name
      }
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
    isAccessible() {
      return this.get('ACCESSIBLE') === 'Y'
    },
    cssClass() {
      return this.isAccessible() ? 'acc' : ''
    },
    detailsHtml() {
      if (this.isAccessible()) {
        return this.content.message('acc_feat', this.getProperties())
      }
    },
    detailsCollapsible() {
      const details = this.detailsHtml()
      if (details) {
        return $('<a class="btn rad-all dtl" href="#"></a>')
          .html('<span class="screen-reader-only">Click for accessibility </span>')
          .append('Details...')
          .click($.proxy(this.finderApp.expandDetail, this.finderApp))
          .add(details)
      }
    }
  },
  zone: {
    cssClass() {
      return 'zone'
    },
    getZone() {
      return this.get('zone')
    },
    isSurfaceWater() {
      return this.getZone() === hurricane.SURFACE_WATER_ZONE
    },
    html() {
      if (!this.isSurfaceWater()) {
        const content = this.content
        const zone = this.getZone()
        return content.message('zone_info', {zone: zone, order: content.zoneMsg(zone)})
      }
    }
  }
}

export default decorations