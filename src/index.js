import React from 'react'
import ReactDOM from 'react-dom'
// can't get fallback routing working with dev server
import { HashRouter as Router } from 'react-router-dom'
import { App } from './App'

document.querySelector('body').appendChild(document.createElement('main'))

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.querySelector('main')
)
