import { store_categories } from '../../store/actions/category'
import { get, post, axiosObj } from '../Utility/axios';
import { createKeyword } from './Keyword'

export function fetchCategories(uuid) {
    return dispatch => {
        get(`/users/${uuid}`)
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
            const { user_id, category_name } = category
            let body = {
                user_id: user_id,
                category_name: category_name
            }
            post('/categories/', body)
                .then(response => {
                    dispatch(fetchCategories(user_id));
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


export const deleteCategory = catagory_id => {
    return axiosObj.delete(`/categories/${catagory_id}`)
        .then(function (response) {
            // console.log(response)
        })
        .catch(function (error) {
            console.log(error);
        });
}