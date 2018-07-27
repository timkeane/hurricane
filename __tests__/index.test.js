import index from '../src/js/index'
import App from '../src/js/App'
import Content from '../src/js/Content'

jest.mock('../src/js/App')

test('it works', () => {
  expect.assertions(3)
  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(App).toHaveBeenCalledTimes(1)
        expect(App.mock.calls[0][0] instanceof Content).toBe(true)
        resolve(true)
      }, 500)
    })
  }

  return test().then(result => {expect(result).toBe(true)})
})