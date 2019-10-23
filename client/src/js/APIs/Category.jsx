import { store_categories } from '../../store/actions/category'
import { get, post } from '../Utility/axios';
import { createKeyword } from './Keyword'

export function fetchCategories() {
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

export const createCategory = category => 
    dispatch => {
            let body = {
                user_id:"aaabbbcccddd",
                category_name: category['category_name']
            }
            post('/categories/', body)
                .then(response => {
                    dispatch(fetchCategories());
                    const { contain_tags, do_not_contain_tags } = category
                    const { id } = response['data']['data']['category']
                    contain_tags.forEach(tag_name => {
                        dispatch(createKeyword({
                            keyword: tag_name,
                            is_excluded: false,
                            category_id: id
                        }))
                    })
                    do_not_contain_tags.forEach(tag_name => {
                        dispatch(createKeyword({
                            keyword: tag_name,
                            is_excluded: true,
                            category_id: id
                        }))
                    })
                }).catch(function (error) {
                    console.log(error);
                });

    }
