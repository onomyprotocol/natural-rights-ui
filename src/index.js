import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from 'src/reducers'

document.querySelector('body').appendChild(document.createElement('main'))

const Hello = () => <h1>Hello, NodeHaven!</h1>

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.querySelector('main')
)
