import { combineReducers } from 'redux';
import category from './category';
import user from './user';
import link from './link';

export default combineReducers({
    category,
    user,
    link
})