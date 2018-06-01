var centerDecorations = [{
  getName: function() {
    return this.get('OEM_LABEL')
  },
  getAddress1: function() {
    return this.get('BLDG_ADD')
  },
  getAddress2: function() {
    return 'Between ' + this.get('CROSS1') + ' and ' + this.get('CROSS2')
  },
  getCityStateZip: function() {
    return this.get('CITY') + ', NY ' + this.get('ZIP_CODE')
  },
  cssClass: function() {
    return this.get('ACCESSIBLE') == 'Y' ? 'acc' : ''
  },
  detailButtonText: 'Accessibile Features...',
  detailsHtml: function() {
    const detail = this.get('ACC_FEAT')
    if (detail) {
      return $('<ul><li>' + detail + '</li></ul>')
        .append('<li>generic</li>');
    }
  }
}];