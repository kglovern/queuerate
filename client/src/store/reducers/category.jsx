export default function category(state = null, action) {
    switch (action.type) {
        case 'STORE_CATEGORIES':
            return Object.assign({}, state, {
                categories: action['payload']
            })
        default:
            return state
    }
}