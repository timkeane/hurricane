import App from "../../src/hurricane/App";

test('constructor', () => {
  const app = new App({
    evacReq: [],
    messages: {},
    message: jest.fn()
  })
})