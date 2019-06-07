import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import Locator from 'nyc-lib/nyc/Locator'
import App from '../src/js/App'
import Content from './Content.mock'
import hurricane from '../src/js/hurricane'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import Slider from 'nyc-lib/nyc/Slider'
import Share from 'nyc-lib/nyc/Share'
import $ from 'jquery'
import OlFeature from 'ol/Feature'

jest.mock('nyc-lib/nyc/ol/FeatureTip')
jest.mock('nyc-lib/nyc/Slider')
jest.mock('nyc-lib/nyc/Share')

let legend
const adjustTabs = App.prototype.adjustTabs
const tabChange = App.prototype.tabChange
beforeEach(() => {
  $.resetMocks()
  App.prototype.adjustTabs = jest.fn()
  App.prototype.tabChange = jest.fn()
  legend = $('<div id="legend"><div class="leg-sw zone"></div></div>')
  $('body').append(legend)
  FeatureTip.mockReset()
  Slider.mockReset()
  Share.mockReset()
})
afterEach(() => {
  App.prototype.adjustTab = adjustTabs
  App.prototype.tabChange = tabChange
  $('body').empty()
})


describe('constructor/ready', () => {
  let sliderBtn
  const ready = App.prototype.ready
  beforeEach(() => {
    sliderBtn = $('<div id="slider-map"><div class="btn"></div></div>')
    $('body').append(sliderBtn)
    App.prototype.ready = () => {}
  })
  afterEach(() => {
    $('body').empty()
    App.prototype.ready = ready
  })


  test('constructor/ready', done => {
    expect.assertions(72)
    
    $.fn.resize = $.originalFunctions.resize
  
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
    expect(app.source.getFormat().decorations[1].app).toBe(app)
    expect(app.source.getFormat().decorations[2].content).toBe(content)
    expect(app.source.getFormat().decorations[3]).toBe(decorations.center)
  
    expect(app.source.getFormat().parentFormat instanceof CsvPoint).toBe(true)
    expect(app.source.getFormat().parentFormat.dataProjection.getCode()).toBe('EPSG:2263')
    expect(app.source.getFormat().parentFormat.x).toBe('X')
    expect(app.source.getFormat().parentFormat.y).toBe('Y')
  
    expect(app.tabs.find('.btn-0').html()).toBe('Map')
    expect(app.tabs.find('.btn-1').html()).toBe(content.message('centers_tab'))
    expect(app.tabs.find('.btn-2').html()).toBe('Legend')
  
    expect(app.tabs.tabs.find('.tab-0').get(0)).toBe($('#map').get(0))
    expect(app.tabs.tabs.find('.tab-1').get(0)).toBe($('#facilities').get(0))
    expect(app.tabs.tabs.find('.tab-2').get(0)).toBe($('#legend').get(0))
  
    app.tabChange.mockReset()
    app.adjustTabs.mockReset()
    app.tabs.trigger('change')
    $(window).trigger('resize')
    expect(app.tabChange).toHaveBeenCalledTimes(1)
    expect(app.adjustTabs).toHaveBeenCalledTimes(1)
  
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
  
    app.ready = ready
    app.ready([])
  
    setTimeout(() => {
      window.xyz=true
      $(app.map.getTargetElement()).append($('<div class="shr"></div>'))    
    }, 600)

    setTimeout(() => {
      window.xyz=false

      expect($(app.map.getTargetElement()).children().last().get(0)).toBe(sliderBtn.get(0))
      done()
    }, 2000)
  })
})


describe('located', () => {
  const located = FinderApp.prototype.located
  beforeEach(() => {
    FinderApp.prototype.located = jest.fn()
  })
  afterEach(() => {
    FinderApp.prototype.located = located
  })

  test.only('located', () => {
    expect.assertions(12)
    
    const content = new Content()
    const app = new App(content)
  
    
    app.locationMsg = jest.fn(() => {
      return 'mock-html'
    })
      
    const pop = $(app.popup.getElement())
    
    app.popup.showFeatures = jest.fn(() => {
      pop.find('.content').append('<h2></h2>').show()
      
    })
  
    const location = {coordinate: [1, 2]}
  
    app.located(location)
  
    expect(FinderApp.prototype.located).toHaveBeenCalledTimes(1)
    expect(FinderApp.prototype.located.mock.calls[0][0]).toBe(location)

    expect(app.locationMsg).toHaveBeenCalledTimes(1)
    expect(app.locationMsg.mock.calls[0][0]).toBe(location)
  
    expect(app.popup.showFeatures).toHaveBeenCalledTimes(1)
    expect(app.popup.showFeatures.mock.calls[0][0].length).toBe(1)
    expect(app.popup.showFeatures.mock.calls[0][0][0] instanceof OlFeature).toBe(true)
    expect(app.popup.showFeatures.mock.calls[0][0][0].getGeometry().getCoordinates()).toEqual(location.coordinate)
    expect(app.popup.showFeatures.mock.calls[0][0][0].html()).toBe('mock-html')
      
    expect(document.activeElement).toBe(pop.find('h2').get(0))
    expect(pop.find('h2').attr('tabindex')).toBe('0')
  
    app.tabs.open = jest.fn()
    pop.find('.btn-x').trigger('click')
  
    expect(app.tabs.open).toHaveBeenCalledTimes(1)
  })
})

test('locationMsg content returns html', () => {
  expect.assertions(4)
  
  const content = new Content()
  const app = new App(content)

  app.content.locationMsg = jest.fn(() => {return 'mock-html'})
  app.queryZone = jest.fn()

  expect(app.locationMsg('mock-location')).toBe('mock-html')

  expect(app.content.locationMsg).toHaveBeenCalledTimes(1)
  expect(app.content.locationMsg.mock.calls[0][0]).toBe('mock-location')
  expect(app.queryZone).toHaveBeenCalledTimes(0)
})

test('locationMsg content returns nothing', () => {
  expect.assertions(5)
  
  const content = new Content()
  const app = new App(content)

  app.content.locationMsg = jest.fn()
  app.queryZone = jest.fn(() => {return 'mock-html'})

  expect(app.locationMsg('mock-location')).toBe('mock-html')

  expect(app.content.locationMsg).toHaveBeenCalledTimes(1)
  expect(app.content.locationMsg.mock.calls[0][0]).toBe('mock-location')
  expect(app.queryZone).toHaveBeenCalledTimes(1)
  expect(app.queryZone.mock.calls[0][0]).toBe('mock-location')
})

test('queryZone high accuracy 1 zone', () => {
  expect.assertions(8)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: Locator.Accuracy.HIGH
  }
  const mockZoneFeature = {
    getZone: () => {return 'mock-zone'}
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn(() => {
    return [mockZoneFeature]
  })
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn()

  app.content.locationMsg = jest.fn(() => {
    return 'mock-html'
  })
  app.content.unkownZone = jest.fn()

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(0)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.getFeaturesAtCoordinate.mock.calls[0][0]).toEqual([1, 2])

  expect(app.content.unkownZone).toHaveBeenCalledTimes(0)

  expect(app.content.locationMsg).toHaveBeenCalledTimes(1)
  expect(app.content.locationMsg.mock.calls[0][0]).toBe(location)
  expect(app.content.locationMsg.mock.calls[0][1]).toBe('mock-zone')
})

test('queryZone high accuracy no zone', () => {
  expect.assertions(7)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: Locator.Accuracy.HIGH
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn(() => {
    return []
  })
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn()

  app.content.locationMsg = jest.fn()
  app.content.unkownZone = jest.fn(() => {
    return 'mock-html'
  })

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(0)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.getFeaturesAtCoordinate.mock.calls[0][0]).toEqual([1, 2])

  expect(app.content.unkownZone).toHaveBeenCalledTimes(1)
  expect(app.content.unkownZone.mock.calls[0][0]).toBe(location)

  expect(app.content.locationMsg).toHaveBeenCalledTimes(0)
})

test('queryZone high accuracy 2 zones', () => {
  expect.assertions(7)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: Locator.Accuracy.HIGH
  }
  const mockZoneFeature = {
    getZone: () => {return 'mock-zone'}
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn(() => {
    return [{}, {}]
  })
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn()

  app.content.locationMsg = jest.fn()
  app.content.unkownZone = jest.fn(() => {
    return 'mock-html'
  })

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(0)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.getFeaturesAtCoordinate.mock.calls[0][0]).toEqual([1, 2])

  expect(app.content.unkownZone).toHaveBeenCalledTimes(1)
  expect(app.content.unkownZone.mock.calls[0][0]).toBe(location)

  expect(app.content.locationMsg).toHaveBeenCalledTimes(0)
})

test('queryZone not high accuracy 1 zone', () => {
  expect.assertions(15)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: 50
  }
  const mockZoneFeature = {
    getZone: () => {return 'mock-zone'}
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn()
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn((extent, callback) => {
    callback(mockZoneFeature)
  })

  app.content.locationMsg = jest.fn(() => {
    return 'mock-html'
  })
  app.content.unkownZone = jest.fn()

  app.boundingExtent = jest.fn(() => {
    return 'mock-bounding-extent'
  })
  app.buffer = jest.fn(() => {
    return 'mock-buffer-extent'
  })

  app.locationMgr.locator.accuracyDistance = jest.fn(() => {
    return 'mock-distiance'
  })

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.boundingExtent).toHaveBeenCalledTimes(1)
  expect(app.boundingExtent.mock.calls[0][0]).toEqual([location.coordinate])

  expect(app.buffer).toHaveBeenCalledTimes(1)
  expect(app.buffer.mock.calls[0][0]).toBe('mock-bounding-extent')
  expect(app.buffer.mock.calls[0][1]).toBe('mock-distiance')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.forEachFeatureIntersectingExtent.mock.calls[0][0]).toBe('mock-buffer-extent')

  expect(app.locationMgr.locator.accuracyDistance).toHaveBeenCalledTimes(1)
  expect(app.locationMgr.locator.accuracyDistance.mock.calls[0][0]).toBe(50)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(0)

  expect(app.content.unkownZone).toHaveBeenCalledTimes(0)

  expect(app.content.locationMsg).toHaveBeenCalledTimes(1)
  expect(app.content.locationMsg.mock.calls[0][0]).toBe(location)
  expect(app.content.locationMsg.mock.calls[0][1]).toBe('mock-zone')
})

test('queryZone not high accuracy no zone', () => {
  expect.assertions(14)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: 50
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn()
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn()

  app.content.locationMsg = jest.fn()
  app.content.unkownZone = jest.fn(() => {
    return 'mock-html'
  })

  app.boundingExtent = jest.fn(() => {
    return 'mock-bounding-extent'
  })
  app.buffer = jest.fn(() => {
    return 'mock-buffer-extent'
  })

  app.locationMgr.locator.accuracyDistance = jest.fn(() => {
    return 'mock-distiance'
  })

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.boundingExtent).toHaveBeenCalledTimes(1)
  expect(app.boundingExtent.mock.calls[0][0]).toEqual([location.coordinate])

  expect(app.buffer).toHaveBeenCalledTimes(1)
  expect(app.buffer.mock.calls[0][0]).toBe('mock-bounding-extent')
  expect(app.buffer.mock.calls[0][1]).toBe('mock-distiance')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.forEachFeatureIntersectingExtent.mock.calls[0][0]).toBe('mock-buffer-extent')

  expect(app.locationMgr.locator.accuracyDistance).toHaveBeenCalledTimes(1)
  expect(app.locationMgr.locator.accuracyDistance.mock.calls[0][0]).toBe(50)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(0)

  expect(app.content.unkownZone).toHaveBeenCalledTimes(1)
  expect(app.content.unkownZone.mock.calls[0][0]).toBe(location)
  
  expect(app.content.locationMsg).toHaveBeenCalledTimes(0)
})

test('queryZone not high accuracy 2 zones', () => {
  expect.assertions(14)
  
  const content = new Content()
  const app = new App(content)

  const location = {
    coordinate: [1, 2],
    accuracy: 50
  }

  app.zoneSource.getFeaturesAtCoordinate = jest.fn()
  app.zoneSource.forEachFeatureIntersectingExtent = jest.fn((extent, callback) => {
    callback({})
    callback({})
  })

  app.content.locationMsg = jest.fn()
  app.content.unkownZone = jest.fn(() => {
    return 'mock-html'
  })

  app.boundingExtent = jest.fn(() => {
    return 'mock-bounding-extent'
  })
  app.buffer = jest.fn(() => {
    return 'mock-buffer-extent'
  })

  app.locationMgr.locator.accuracyDistance = jest.fn(() => {
    return 'mock-distiance'
  })

  expect(app.queryZone(location)).toBe('mock-html')

  expect(app.boundingExtent).toHaveBeenCalledTimes(1)
  expect(app.boundingExtent.mock.calls[0][0]).toEqual([location.coordinate])

  expect(app.buffer).toHaveBeenCalledTimes(1)
  expect(app.buffer.mock.calls[0][0]).toBe('mock-bounding-extent')
  expect(app.buffer.mock.calls[0][1]).toBe('mock-distiance')

  expect(app.zoneSource.forEachFeatureIntersectingExtent).toHaveBeenCalledTimes(1)
  expect(app.zoneSource.forEachFeatureIntersectingExtent.mock.calls[0][0]).toBe('mock-buffer-extent')

  expect(app.locationMgr.locator.accuracyDistance).toHaveBeenCalledTimes(1)
  expect(app.locationMgr.locator.accuracyDistance.mock.calls[0][0]).toBe(50)

  expect(app.zoneSource.getFeaturesAtCoordinate).toHaveBeenCalledTimes(0)

  expect(app.content.unkownZone).toHaveBeenCalledTimes(1)
  expect(app.content.unkownZone.mock.calls[0][0]).toBe(location)
  
  expect(app.content.locationMsg).toHaveBeenCalledTimes(0)  
})

describe('expandDetail', () => {
  let details
  beforeEach(() => {
    details = $('<div class="btn"></div><div class="content"></div>')
    $('body').append(details)
  })

  test('expandDetail expand', () => {
    expect.assertions(6)

    const content = new Content()
    const app = new App(content)

    const btn = $(details.get(0))
      .attr('aria-pressed', false)

    const detail = $(details.get(1))
      .attr('aria-hidden', true)
      .attr('aria-collapsed', true)
      .attr('aria-expanded', false)
      .hide()

    app.popup.pan = jest.fn()
    
    app.expandDetail({currentTarget: btn})

    expect(btn.attr('aria-pressed')).toBe('true')
    expect(detail.attr('aria-hidden')).toBe('false')
    expect(detail.attr('aria-collapsed')).toBe('false')
    expect(detail.attr('aria-expanded')).toBe('true')
    expect(detail.css('display')).toBe('block')
  
    expect(app.popup.pan).toHaveBeenCalledTimes(1)
  })

  test('expandDetail collapse', () => {
    expect.assertions(6)
        
    const content = new Content()
    const app = new App(content)

    const btn = $(details.get(0))
      .attr('aria-pressed', true)

    const detail = $(details.get(1))
      .attr('aria-hidden', false)
      .attr('aria-collapsed', false)
      .attr('aria-expanded', true)
      .show()

    app.popup.pan = jest.fn()

    app.expandDetail({currentTarget: btn})

    expect(btn.attr('aria-pressed')).toBe('false')
    expect(detail.attr('aria-hidden')).toBe('true')
    expect(detail.attr('aria-collapsed')).toBe('true')
    expect(detail.attr('aria-expanded')).toBe('false')
    expect(detail.css('display')).toBe('none')

    expect(app.popup.pan).toHaveBeenCalledTimes(1)
  })
})


describe('slider button', () => {
  let sliderBtn
  beforeEach(() => {
    sliderBtn = $('<div id="slider-map"><div class="btn"></div><div class="slider"></div></div>')
    $('body').append(sliderBtn)
  })
  afterEach(() => {
    $('body').empty()
  })

  test('slider button', () => {
    expect.assertions(2)

    const content = new Content()
    const app = new App(content)

    sliderBtn.find('.slider').hide()

    sliderBtn.find('.btn').trigger('click')

    expect($('#slider-map .slider').css('display')).toBe('block')

    sliderBtn.find('.btn').trigger('click')

    expect($('#slider-map .slider').css('display')).toBe('none')
  })
})

test('zoneOpacity', () => {
  expect.assertions(6)

  const content = new Content()
  const app = new App(content)

  app.zoneOpacity({val: () => {return 20}})

  expect(app.zoneLayer.getOpacity()).toBe(.8)

  expect(app.legendSlider.val).toHaveBeenCalledTimes(1)
  expect(app.legendSlider.val.mock.calls[0][0]).toBe(20)

  expect(app.btnSlider.val).toHaveBeenCalledTimes(1)
  expect(app.btnSlider.val.mock.calls[0][0]).toBe(20)

  expect($('.leg-sw.zone').css('opacity')).toBe('0.8')
})

describe('renderEvacOrder', () => {
  beforeEach(() => {
    $('body').append('<div class="orders">none</div>')
      .append('<div class="alert"><div><div></div></div></div>')
  })

  test('renderEvacOrder no order', () => {
    expect.assertions(2)
  
    const content = new Content()
    content.evacuations = []
    
    const app = new App(content)
  
    expect($('#banner').next().hasClass('alert')).toBe(false)
    expect($('.orders').html()).toBe('none')
  })

  test('renderEvacOrder one zone', () => {
    expect.assertions(4)
  
    const content = new Content()    
    const app = new App(content)
  
    expect($('#banner').next().hasClass('alert')).toBe(true)
    expect($('#banner').next().get(0).tagName).toBe('H2')
    expect($('#banner').next().html()).toBe('<div><div><div>an evacuation order is in effect for Zone 3</div></div></div>')
    expect($('.orders').html()).toBe('<div>an evacuation order is in effect for</div><div class="zone">Zone 3</div>')
  })

  
  test('renderEvacOrder 2 zones', () => {
    expect.assertions(4)
  
    const content = new Content()    
    content.evacuations = ['1', '3']
    
    const app = new App(content)
  
    expect($('#banner').next().hasClass('alert')).toBe(true)
    expect($('#banner').next().get(0).tagName).toBe('H2')
    expect($('#banner').next().html()).toBe('<div><div><div>an evacuation order is in effect for Zones 1 and 3</div></div></div>')
    expect($('.orders').html()).toBe('<div>an evacuation order is in effect for</div><div class="zone">Zones 1 and 3</div>')
  })

  test('renderEvacOrder 3 zones', () => {
    expect.assertions(4)
  
    const content = new Content()    
    content.evacuations = ['1', '3', '5']
    
    const app = new App(content)
  
    expect($('#banner').next().hasClass('alert')).toBe(true)
    expect($('#banner').next().get(0).tagName).toBe('H2')
    expect($('#banner').next().html()).toBe('<div><div><div>an evacuation order is in effect for Zones 1, 3 and 5</div></div></div>')
    expect($('.orders').html()).toBe('<div>an evacuation order is in effect for</div><div class="zone">Zones 1, 3 and 5</div>')
  })
})

test('filter focus/blur', () => {
  expect.assertions(6)
  
  const content = new Content()    
  
  const app = new App(content)

  const inputs = $('#acc-filter input')

  expect(inputs.length).toBe(2)

  expect($('#acc-filter div[role="radiogroup"]').hasClass('focused')).toBe(false)

  inputs.get(0).focus()
  expect($('#acc-filter div[role="radiogroup"]').hasClass('focused')).toBe(true)

  inputs.get(0).blur()
  expect($('#acc-filter div[role="radiogroup"]').hasClass('focused')).toBe(false)

  inputs.get(1).focus()
  expect($('#acc-filter div[role="radiogroup"]').hasClass('focused')).toBe(true)

  inputs.get(1).blur()
  expect($('#acc-filter div[role="radiogroup"]').hasClass('focused')).toBe(false)
})

test('boundingExtent', () => {
  expect.assertions(1)
  
  const content = new Content()    
  
  const app = new App(content)

  expect(app.boundingExtent([[0, 0]])).toEqual([0, 0, 0, 0])
})

test('buffer', () => {
  expect.assertions(1)
  
  const content = new Content()    
  
  const app = new App(content)

  expect(app.buffer([0, 0, 0, 0], 1)).toEqual([-1, -1, 1, 1])
})