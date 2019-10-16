import { post }  from '../Utility/axios';

export const createUser = user => post('/users/', user)
