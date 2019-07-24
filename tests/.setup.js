import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('')
const { window } = jsdom

const copyProps = (src, target) =>
  Object.defineProperties(target,
    Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  )

global.window = window
global.document = window.document
global.navigator = { userAgent: 'node.js' }

copyProps(window, global)

Enzyme.configure({ adapter: new Adapter() })
