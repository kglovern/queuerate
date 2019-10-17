import { store_categories } from '../../store/actions/category'
import { get } from '../Utility/axios';

function fetchCategories() {
    return dispatch => {
        get('/users/aaabbbcccddd')
            .then(function (response) {
                dispatch(store_categories(response['data']['data']['user']['categories']));
            })
            .catch(function (error) {
                console.log(error);
            });

    }
}

export default fetchCategories;