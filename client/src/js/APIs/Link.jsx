import { post, get, patch } from '../Utility/axios';
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

export const markAsRead = (id, uuid) => 
    dispatch => {
        patch(`/links/${id}/mark_as_read`)
            .then(function (response) {
                dispatch(fetchLinks(uuid));
            })
            .catch(function (error) {
                console.log(error);
            });
    }


export const markAsUnread = (id, uuid) => 
    dispatch => {
        patch(`/links/${id}/mark_as_unread`)
            .then(function (response) {
                dispatch(fetchLinks(uuid));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

export const replayLink = (link_id, user_id) => 
    dispatch => {
        get(`/links/${link_id}/categorize`, link_id)
            .then(response => {
                dispatch(fetchLinks(user_id));
            })
            .catch(error => {
                console.log(error)
            })
    }

export const replayLinkWithoutDispatch = (link_id, user_id) => {
        get(`/links/${link_id}/categorize`, link_id)
            .then(response => {
                
            })
            .catch(error => {
                console.log(error)
            })
    }    