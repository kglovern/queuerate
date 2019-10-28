import { post }  from '../Utility/axios';

export const createUser = user => post('/users/', user)

export const getUser = uuid => post('/users/' + uuid)
