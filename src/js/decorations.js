/**
 * @module hurricane/decorations
 */

import hurricane from './hurricane'
import nyc from 'nyc-lib/nyc'

const decorations = {
  center: {
    extendFeature() {
      const label = $(`<span>${this.getName()}</span>`)
      if (this.isAccessible()) label.addClass('acc')
      this.set('label', label)
    },
    getName() {
      return this.get('OEM_LABEL')
    },
  /**
   * @desc Returns the name of a facility feature to append to HTML
   * @public
   * @method
   * @return {jQuery}
   */
  nameHtml() {
    let name = this.getName()
    if (this.isAccessible()){
      name = `${name}<span class="screen-reader-only"> - this is an accessible facility</span>`
    }
    return $('<h2 class="name notranslate"></h2>').html(name)
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
        return $(this.content.message('acc_feat', this.getProperties()))
      }
    },
    detailsCollapsible() {
      const details = this.detailsHtml()
      if (details) {
        const id = nyc.nextId('acc-dtl')
        details.attr('aria-labelledby', id)
        return $('<a class="btn rad-all dtl" aria-expanded="false" aria-collapsed="true" role="button" href="#"></a>')
          .html('<span class="screen-reader-only">Accessibility </span>')
          .append('Details')
          .click($.proxy(this.finderApp.expandDetail, this.finderApp))
          .attr('id', id)  
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