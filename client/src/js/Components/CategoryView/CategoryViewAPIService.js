import { axiosObj } from '../../Utility/axios';

export default {
    fetchCategoryObj: async (id) => {
        try {
            const { data: { data: { category } } } = await axiosObj.get(`/categories/${id}`);
            return category;
        } catch (e) {
            console.log(e);
            return {}
        }
    },
    fetchCategoryLinks: async (id) => {
        try {
            const {data: {data: {links}}} = await axiosObj.get(`/categories/${id}/links`);
            return links
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    changeLinkReadState: async (id, is_read) => {
        try {
            if (is_read === true) {
                await axiosObj.patch(`/links/${id}/mark_as_unread`);
            } else {
                await axiosObj.patch (`/links/${id}/mark_as_read`);
            }
        } catch (e) {
            console.log(e);
            return {}
        }
    }
}
