import { get, post } from '../Utility/axios';

export const createKeyword = keyword =>
    dispatch => {
        post('/keywords/', keyword)
            .then(response => {
                // dispatch(fetchCategories());
            }).catch(function (error) {
                console.log(error);
            });
    }
