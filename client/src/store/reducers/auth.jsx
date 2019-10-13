export default function login(state = null, action) {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state, {
        loginStatus: true
      })
    case 'LOGOUT':
      return Object.assign({}, state, {
        loginStatus: false
      })
    default:
      return state
  }
}