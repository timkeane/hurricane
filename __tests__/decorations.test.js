import decorations from '../src/js/decorations'
import nyc from 'nyc-lib/nyc'
import {finderApp, notAccessibleCenter, accessibleCenter, notWaterZone, waterZone} from './features.mock'

let div
const nextId = nyc.nextId
beforeEach(() => {
  $.resetMocks()
  finderApp.expandDetail.mockReset()
  nyc.nextId = (name) => {
    return `${name}-1`
  }
  div = $('<div></div>')
  $('body').append(div)
})
afterEach(() => {
  nyc.nextId = nextId
  div.remove()
})

describe('center decorations', () => {
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
      "<button class=\"btn rad-all dtl\" aria-pressed=\"false\" id=\"acc-btn-1\" aria-controls=\"acc-cnt-1\"><span class=\"screen-reader-only\">Accessibility </span>Details</button><ul class=\"rad-all dtl\" aria-expanded=\"false\" aria-collapsed=\"true\" aria-hidden=\"true\" aria-labelledby=\"acc-btn-1\"><li>The main/accessible entrance to this location for sheltering purposes is 74-20 Commonwealth Boulevard, Queens (Close to the intersection with Cross Island Parkway and Grand Central Parkway)</li><li>Access to the main shelter areas will be unobstructed and without steps.</li><li>Accessible restrooms are available.</li><li>Accessible dormitory and eating/cafeteria areas are available.</li><li>Additional amenities will be available such as accessible cots, storage space for refrigerated medication, power strips for charging mobility and other accessibility devices, and mobility aids (canes, crutches, manual wheelchairs, etc.).</li><li>Auxiliary aids and services will be available, including sign language interpreters, sound amplifiers, and documents in alternative formats.</li></ul>"
    )

    expect($.mocks.proxy).toHaveBeenCalledTimes(1)
    expect($.mocks.proxy.mock.calls[0][0]).toBe(finderApp.expandDetail)
    expect($.mocks.proxy.mock.calls[0][1]).toBe(finderApp)
  })

  test('cssClass', () => {
    expect.assertions(2)

    expect(notAccessibleCenter.cssClass()).toBe('')
    expect(accessibleCenter.cssClass()).toBe('acc')
  })
})

describe('zone decorations', () => {
  test('cssClass', () => {
    expect.assertions(1)
    expect(waterZone.cssClass()).toBe('zone')
  })

  test('getZone', () => {
    expect.assertions(1)
    expect(waterZone.getZone()).toBe('0')
  })

  test('isSurfaceWater', () => {
    expect.assertions(2)
    expect(waterZone.isSurfaceWater()).toBe(true)
    expect(notWaterZone.isSurfaceWater()).toBe(false)
  })

  test('html', () => {
    expect.assertions(2)
    expect(waterZone.html()).toBe(undefined)
    expect(notWaterZone.html()).toBe('<h2>Zone 1</h2><div><div class="order">No evacuation order currently in effect</div></div>')
  })
})