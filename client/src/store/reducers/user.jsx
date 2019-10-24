import { LOGIN, SIGNUP } from '../actions/user';

export default function user(state = null, action) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, action['payload']);
        case SIGNUP:
            return Object.assign({}, state, action['payload']);
        default:
            return state
    }
}