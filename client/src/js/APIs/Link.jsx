import { post }  from '../Utility/axios';

export const createLink = link => 
    dispatch => {
        post('/links/', link)
        .then(response => {
            // console.log(response)
        })
        .catch(error => {
            console.log(error)
        }) 
    }