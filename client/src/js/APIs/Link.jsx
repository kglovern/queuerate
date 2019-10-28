import { post, get } from '../Utility/axios';
import { store_category_links } from '../../store/actions/link';

export const createLink = link =>
    dispatch => {
        post('/links/', link)
            .then(response => {
                dispatch(fetchLinks(link.user_id));
            })
            .catch(error => {
                console.log(error)
            })
    }

export const fetchLinks = uuid =>
    dispatch => {
        get(`/users/${uuid}/links`)
            .then(function (response) {
                const { links } = response['data']['data']

                links.sort(function (a, b) {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });

                dispatch(store_category_links(links));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

export const fetchUncategorizedLinks = uuid =>
    dispatch => {
        get(`/users/${uuid}/links`)
            .then(function (response) {
                const links = response['data']['data'].links.filter(obj => obj.categories.length == 0)

                links.sort(function (a, b) {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });

                dispatch(store_category_links(links));
            })
            .catch(function (error) {
                console.log(error);
            });
    }