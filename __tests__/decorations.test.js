import decorations from '../src/js/decorations'
import OlFeature from 'ol/feature'
import Content from './Content.mock'
import nyc from 'nyc-lib/nyc'

const content = new Content()
const finderApp = {
  expandDetail: jest.fn()
}

const notAccessibleCenter = new OlFeature({
  BLDG_ID: 'Q100',
  X: 1033804.052,
  Y: 186982.0152,
  OEM_LABEL: 'PS 100',
  BLDG_ADD: '111-11 118 Street',
  BOROCODE: '4',
  CITY: 'South Ozone Park',
  CROSS1: 'Linden Blvd',
  CROSS2: '111 Avenue',
  ZIP_CODE: '11420',
  ACCESSIBLE: 'N',
  ACC_FEAT: ''
})
$.extend(notAccessibleCenter, decorations.center, {content: content, finderApp: finderApp})

const accessibleCenter = new OlFeature({
  BLDG_ID: 'Q566',
  X: 1059380.128,
  Y: 210618.7714,
  OEM_LABEL: 'HS of Teaching, Lib Arts and Sci',
  BLDG_ADD: '74-20 Commonwealth Blvd',
  BOROCODE: '4',
  CITY: 'Bellerose',
  CROSS1: 'Grand Central Pkwy',
  CROSS2: '76 Avenue',
  ZIP_CODE: '11426',
  ACCESSIBLE: 'Y',
  ACC_FEAT: 'The main/accessible entrance to this location for sheltering purposes is 74-20 Commonwealth Boulevard, Queens (Close to the intersection with Cross Island Parkway and Grand Central Parkway)'
})
$.extend(accessibleCenter, decorations.center, {content: content, finderApp: finderApp})

const nextId = nyc.nextId
beforeEach(() => {
  $.resetMocks()
  finderApp.expandDetail.mockReset()
  nyc.nextId = (name) => {
    return `${name}-1`
  }
})
afterEach(() => {
  nyc.nextId = nextId
})

describe('center decorations', () => {
  let div
  beforeEach(() => {
    div = $('<div></div>')
    $('body').append(div)
  })
  afterEach(() => {
    div.remove()
  })

  test('nameHtml', () => {
    expect.assertions(2)
    
    div.html(notAccessibleCenter.nameHtml())
    expect(div.html()).toBe('<h2 class="name notranslate">PS 100</h2>')

    div.html(accessibleCenter.nameHtml())
    expect(div.html()).toBe(
      '<h2 class="name notranslate">HS of Teaching, Lib Arts and Sci<span class="screen-reader-only"> - this is an accessible facility</span></h2>'
    )
  })

  test('getAddress1', () => {
    expect.assertions(1)
    expect(accessibleCenter.getAddress1()).toBe('74-20 Commonwealth Blvd')
  })

  test('getAddress2', () => {
    expect.assertions(1)
    expect(accessibleCenter.getAddress2()).toBe('Between Grand Central Pkwy and 76 Avenue')
  })

  test('getCityStateZip', () => {
    expect.assertions(1)
    expect(accessibleCenter.getCityStateZip()).toBe('Bellerose, NY 11426')
  })

  test('detailsHtml', () => {
    expect.assertions(2)

    expect(notAccessibleCenter.detailsHtml()).toBe(undefined)

    div.html(accessibleCenter.detailsHtml())
    expect(div.html()).toBe(
      '<ul class="rad-all dtl" aria-expanded="false" aria-collapsed="true" aria-hidden="true"><li>The main/accessible entrance to this location for sheltering purposes is 74-20 Commonwealth Boulevard, Queens (Close to the intersection with Cross Island Parkway and Grand Central Parkway)</li><li>Access to the main shelter areas will be unobstructed and without steps.</li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots, storage space for refrigerated medication, power strips for charging mobility and other accessibility devices, and mobility aids (canes, crutches, manual wheelchairs, etc.).</li><li>Auxiliary aids and services will be available, including sign language interpreters, sound amplifiers, and documents in alternative formats.</li></ul>'
    )
  })

  test('detailsCollapsible', () => {
    expect.assertions(5)

    expect(notAccessibleCenter.detailsCollapsible()).toBe(undefined)

    const collapsible = accessibleCenter.detailsCollapsible()
    
    div.html(collapsible)
    expect(div.html()).toBe(
      '<a class="btn rad-all dtl" aria-pressed="false" role="button" href="#" id="acc-btn-1" aria-controls="acc-cnt-1"><span class="screen-reader-only">Accessibility </span>Details</a><ul class="rad-all dtl" aria-expanded="false" aria-collapsed="true" aria-hidden="true" aria-labelledby="acc-btn-1"><li>The main/accessible entrance to this location for sheltering purposes is 74-20 Commonwealth Boulevard, Queens (Close to the intersection with Cross Island Parkway and Grand Central Parkway)</li><li>Access to the main shelter areas will be unobstructed and without steps.</li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots, storage space for refrigerated medication, power strips for charging mobility and other accessibility devices, and mobility aids (canes, crutches, manual wheelchairs, etc.).</li><li>Auxiliary aids and services will be available, including sign language interpreters, sound amplifiers, and documents in alternative formats.</li></ul>'
    )

    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(finderApp.expandDetail)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(finderApp)
  })

})