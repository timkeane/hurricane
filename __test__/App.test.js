import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import App from '../src/js/App'
import Content from './Content.mock'
import hurricane from '../src/js/hurricane'
import style from '../src/js/style'
import decorations from '../src/js/decorations'

const content = new Content()

test('constructor', () => {
  expect.assertions(29)
  
  const app = new App(content)

  expect(app instanceof App).toBe(true)
  expect(app instanceof FinderApp).toBe(true)

  expect(app.content).toBe(content)

  expect(app.layer.getSource()).toBe(app.source)
  expect(app.layer.getStyle()).toBe(style.center)
  expect(app.layer.getZIndex()).toBe(1)
  expect(app.source.getUrl()).toBe(hurricane.CENTER_URL)

  expect(app.source.getFormat() instanceof Decorate).toBe(true)
  expect(app.source.getFormat().decorations.length).toBe(4)
  expect(app.source.getFormat().decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)
  expect(app.source.getFormat().decorations[1].finderApp).toBe(app)
  expect(app.source.getFormat().decorations[2].content).toBe(content)
  expect(app.source.getFormat().decorations[3]).toBe(decorations.center)

  expect(app.source.getFormat().parentFormat instanceof CsvPoint).toBe(true)
  expect(app.source.getFormat().parentFormat.defaultDataProjection).toBe('EPSG:2263')
  expect(app.source.getFormat().parentFormat.x).toBe('X')
  expect(app.source.getFormat().parentFormat.y).toBe('Y')

  expect(app.tabs.find('.btn-1').html()).toBe(content.message('centers_tab'))

  expect(app.filters.choiceControls.length).toBe(1)
  expect(app.filters.choiceControls[0].radio).toBe(true)
  expect(app.filters.choiceControls[0].choices.length).toBe(2)

  expect(app.filters.choiceControls[0].choices[0].label).toBe(`All ${content.message('filter_centers')}`)
  expect(app.filters.choiceControls[0].choices[0].name).toBe('ACCESSIBLE')
  expect(app.filters.choiceControls[0].choices[0].values).toEqual(['N', 'Y'])
  expect(app.filters.choiceControls[0].choices[0].checked).toBe(true)

  expect(app.filters.choiceControls[0].choices[1].label).toBe(`<div></div>Only accessible ${content.message('filter_centers')}`)
  expect(app.filters.choiceControls[0].choices[1].name).toBe('ACCESSIBLE')
  expect(app.filters.choiceControls[0].choices[1].values).toEqual(['Y'])
  expect(app.filters.choiceControls[0].choices[1].checked).not.toBe(true)


})


