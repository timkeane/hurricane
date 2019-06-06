import OlFeature from 'ol/Feature'
import Content from './Content.mock'
import decorations from '../src/js/decorations'

const content = new Content()
const app = {
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
$.extend(notAccessibleCenter, decorations.center, {content: content, app: app})

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
$.extend(accessibleCenter, decorations.center, {content: content, app: app})

const notWaterZone = new OlFeature({zone: '1'})
$.extend(notWaterZone, decorations.zone, {content: content})

const waterZone = new OlFeature({zone: '0'})
$.extend(waterZone, decorations.zone, {content: content})

module.exports = {app, notAccessibleCenter, accessibleCenter, notWaterZone, waterZone}