import axios from 'axios';

export const createUser = user => {
    return axios.post('http://localhost:8080/users/', user);
}