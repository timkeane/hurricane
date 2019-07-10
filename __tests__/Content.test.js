import hurricane from '../src/js/hurricane'
import messages from '../src/js/message'
import Content from '../src/js/Content'
import csvMock from './csv.mock'
import NycContent from 'nyc-lib/nyc/Content'

beforeEach(() => {
  NycContent.loadCsv = jest.fn(() => {
    return new Promise(resolve => {
      resolve(new NycContent([messages, csvMock.content]))
    })
  })
  fetch.resetMocks()
})
afterEach(() => {
  NycContent.loadCsv.mockReset()
})

describe('constructor', () => {
  test('no order', done => {
    expect.assertions(6)
  
    fetch.mockResponseOnce(csvMock.noOrder)
  
    new Content(content => {
      expect(NycContent.loadCsv).toHaveBeenCalledTimes(1)
      expect(NycContent.loadCsv.mock.calls[0][0].url).toBe(hurricane.CONTENT_URL)
      expect(NycContent.loadCsv.mock.calls[0][0].messages.length).toBe(1)
      expect(NycContent.loadCsv.mock.calls[0][0].messages[0]).toBe(messages)
      expect(content.zoneOrders).toEqual({})
      expect(content.evacuations).toEqual([])
      done()
    })
  })
  
  test('one order', done => {
    expect.assertions(6)
  
    fetch.mockResponseOnce(csvMock.oneOrder)
  
    new Content(content => {
      expect(NycContent.loadCsv).toHaveBeenCalledTimes(1)
      expect(NycContent.loadCsv.mock.calls[0][0].url).toBe(hurricane.CONTENT_URL)
      expect(NycContent.loadCsv.mock.calls[0][0].messages.length).toBe(1)
      expect(NycContent.loadCsv.mock.calls[0][0].messages[0]).toBe(messages)
      expect(content.zoneOrders).toEqual({'3': true})
      expect(content.evacuations).toEqual(['3'])
      done()
    })
  })

  test('2 orders', done => {
    expect.assertions(6)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    new Content(content => {
      expect(NycContent.loadCsv).toHaveBeenCalledTimes(1)
      expect(NycContent.loadCsv.mock.calls[0][0].url).toBe(hurricane.CONTENT_URL)
      expect(NycContent.loadCsv.mock.calls[0][0].messages.length).toBe(1)
      expect(NycContent.loadCsv.mock.calls[0][0].messages[0]).toBe(messages)
      expect(content.zoneOrders).toEqual({'1': true, '3': true})
      expect(content.evacuations).toEqual(['1', '3'])
      done()
    })
  })
})

describe('locationMsg', () => {
  test('location with data containing zone, has order', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York',
      data: {hurricaneEvacuationZone: '3'}
    }

    new Content(content => {
      expect(content.locationMsg(location)).toBe(
        '<h2>You are located in Zone 3<br><div class="order active">You are required to evacuate</div></h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })

  test('location with data not cotaining zone, zone provided, has order', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York',
      data: {}
    }

    new Content(content => {
      expect(content.locationMsg(location, '3')).toBe(
        '<h2>You are located in Zone 3<br><div class="order active">You are required to evacuate</div></h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })

  test('location without data, zone provided, has order', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York'
    }

    new Content(content => {
      expect(content.locationMsg(location, '3')).toBe(
        '<h2>You are located in Zone 3<br><div class="order active">You are required to evacuate</div></h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })

  test('location without data, zone not provided', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York'
    }

    new Content(content => {
      expect(content.locationMsg(location)).toBe(undefined)
      done()
    })
  })

  test('location with data containing X zone', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York',
      data: {hurricaneEvacuationZone: 'X'}
    }

    new Content(content => {
      expect(content.locationMsg(location)).toBe(
        '<h2>You are not located in an Evacuation Zone</h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })

  test('location with data containing 0 zone, has order', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York',
      data: {hurricaneEvacuationZone: '0'}
    }

    new Content(content => {
      expect(content.locationMsg(location)).toBe(
        '<h2>You are located in Zone 1<br><div class="order active">You are required to evacuate</div></h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })

  test('location with data not containing zone, zone provided, no order', done => {
    expect.assertions(1)
  
    fetch.mockResponseOnce(csvMock.twoOrders)
  
    const location = {
      name: '59 Maiden Lane, New York',
      data: {}
    }

    new Content(content => {
      expect(content.locationMsg(location, '5')).toBe(
        '<h2>You are located in Zone 5<br><div class="order">No evacuation order currently in effect</div></h2><div class="notranslate" translate="no">59 Maiden Lane<br> New York</div>'
      )
      done()
    })
  })
})

test('unkownZone', () => {
  expect.assertions(1)
  
  fetch.mockResponseOnce(csvMock.twoOrders)

  const location = {
    name: '59 Maiden Lane, New York'
  }

  new Content(content => {
    expect(content.unkownZone(location)).toBe(
      '<h2>Zone Finder cannot determine Zone for your address.<br>Try alternative address or determine Zone by examining map and clicking on your location.</h2><div>59 Maiden Lane<br> New York</div>'
    )
    done()
  })
})