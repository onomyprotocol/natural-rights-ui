import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

const rootReducer = combineReducers({})

export default createStoreWithMiddleware(rootReducer)
