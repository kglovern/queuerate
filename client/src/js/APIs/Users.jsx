import { get, post }  from '../Utility/axios';

export const createUser = user => post('/users/', user)

export const getUser = uuid => get('/users/' + uuid)
