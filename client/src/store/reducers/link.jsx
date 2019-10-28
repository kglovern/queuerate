export default function link(state = null, action) {
    switch (action.type) {
        case 'STORE_LINKS_CATEGORIES':
            return Object.assign({}, state, {
                links: action['payload']
            })
        default:
            return state
    }
}