import { combineReducers } from 'redux'
import login from './login'
import category from './category'
import user from './user'

export default combineReducers({
    login,
    category,
    user
})