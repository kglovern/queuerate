import { combineReducers } from 'redux'
import category from './category'
import user from './user'
import login from './auth'

export default combineReducers({
    login,
    category,
    user
})