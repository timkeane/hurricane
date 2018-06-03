var centerDecorations = [{
  getName: function() {
    return this.get('OEM_LABEL');
  },
  getAddress1: function() {
    return this.get('BLDG_ADD');
  },
  getAddress2: function() {
    return 'Between ' + this.get('CROSS1') + ' and ' + this.get('CROSS2');
  },
  getCityStateZip: function() {
    return this.get('CITY') + ', NY ' + this.get('ZIP_CODE');
  },
  cssClass: function() {
    return this.get('ACCESSIBLE') == 'Y' ? 'acc' : '';
  },
  detailsHtml: function() {
    const detail = this.get('ACC_FEAT');
    if (detail) {
      return $('<ul class="rad-all details"></ul>')
        .append('<li>' + detail + '</li>')
        .append('<li>generic</li>');
    }
  },
  detailsCollapsible: function() {
    const details = this.detailsHtml();
    if (details) {
      return $('<a class="btn rad-all details"></a>')
      .html('<span class="screen-reader-only">Click for accessibility </span>')
      .append('Details...')
      .attr('onclick', '$(this).next().slideToggle()')  
      .add(details);
    }
  }
}];