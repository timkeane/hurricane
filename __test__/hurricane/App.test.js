import App from "../../src/hurricane/App";

test('constructor', () => {
  const app = new App({
    evacuations: [],
    messages: {},
    message: jest.fn()
  })
})