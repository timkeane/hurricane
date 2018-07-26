import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import App from '../src/js/App'
import Content from './Content.mock'
import hurricane from '../src/js/hurricane'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import $ from 'jquery'
import Slider from 'nyc-lib/nyc/Slider'

jest.mock('nyc-lib/nyc/ol/FeatureTip')
jest.mock('nyc-lib/nyc/Slider')

beforeEach(() => {
  FeatureTip.mockClear()
  Slider.mockClear()
})

test('constructor', () => {
  expect.assertions(64)
  
  const content = new Content()
  
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

  expect(app.zoneLayer.getSource()).toBe(app.zoneSource)
  expect(app.zoneLayer.getStyle()).toBe(style.zone)
  expect(app.zoneLayer.getOpacity()).toBe(.35)
  expect(app.zoneSource.getUrl()).toBe(hurricane.ZONE_URL)  

  const layers = app.map.getLayers().getArray()

  expect(layers[layers.length - 1]).toBe(app.zoneLayer)

  expect(FeatureTip).toHaveBeenCalledTimes(3)
  expect(FeatureTip.mock.calls[2][0].map).toBe(app.map)
  expect(FeatureTip.mock.calls[2][0].tips.length).toBe(1)
  expect(FeatureTip.mock.calls[2][0].tips[0].layer).toBe(app.zoneLayer)

  const mockFeature = {
    content: {
      message: jest.fn(() => {return 'mock-html'}),
      zoneMsg: jest.fn(() => {return 'mock-order'})
    },
    getZone: jest.fn(() => {return 'mock-zone'})
  }

  const label = FeatureTip.mock.calls[2][0].tips[0].label(mockFeature)

  expect(label.css).toBe('zone')
  expect(label.html).toBe('mock-html')
  expect(mockFeature.content.message).toHaveBeenCalledTimes(1)
  expect(mockFeature.content.message.mock.calls[0][0]).toBe('zone_tip')
  expect(mockFeature.content.message.mock.calls[0][1].zone).toBe('mock-zone')
  expect(mockFeature.content.message.mock.calls[0][1].order).toBe('mock-order')

  expect(Slider).toHaveBeenCalledTimes(2)

  expect(Slider.mock.calls[0][0].target).toBe('#slider-map .slider')
  expect(Slider.mock.calls[0][0].min).toBe(0)
  expect(Slider.mock.calls[0][0].max).toBe(100)
  expect(Slider.mock.calls[0][0].value).toBe(65)
  expect(Slider.mock.calls[0][0].units).toBe('%')
  expect(Slider.mock.calls[0][0].label).toBe('Zone Transparency:')

  expect(Slider.mock.calls[1][0].target).toBe('#leg-slider')
  expect(Slider.mock.calls[1][0].min).toBe(0)
  expect(Slider.mock.calls[1][0].max).toBe(100)
  expect(Slider.mock.calls[1][0].value).toBe(65)
  expect(Slider.mock.calls[1][0].units).toBe('%')
  expect(Slider.mock.calls[1][0].label).toBe('Zone Transparency:')

  expect(Slider.mock.instances[0].on).toHaveBeenCalledTimes(1)
  expect(Slider.mock.instances[0].on.mock.calls[0][0]).toBe('change')
  expect(Slider.mock.instances[0].on.mock.calls[0][1]).toBe(app.zoneOpacity)
  expect(Slider.mock.instances[0].on.mock.calls[0][2]).toBe(app)
  expect(Slider.mock.instances[1].on.mock.calls[0][0]).toBe('change')
  expect(Slider.mock.instances[1].on.mock.calls[0][1]).toBe(app.zoneOpacity)
  expect(Slider.mock.instances[1].on.mock.calls[0][2]).toBe(app)
})


