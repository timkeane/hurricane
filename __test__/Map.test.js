import $ from 'jquery'
import Basemap from '@timkeane/nyc-lib/dist/nyc/ol/Basemap'
import Map from '../src/Map'

let target
beforeEach(() => {
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor', () => {
  const map = new Map(target.get(0))
  expect(map instanceof Map).toBe(true)
  expect(map instanceof Basemap).toBe(true)
})