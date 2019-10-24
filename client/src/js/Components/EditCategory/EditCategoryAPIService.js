import {axiosObj} from "../../Utility/axios";

export default {
    fetchCategory: async (id) => {
        try {
            const { data:
                    { data:
                        {
                            category
                        }
                    }
            } = await axiosObj.get(`/categories/${id}`);
            return category;
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    deleteKeywordById: async ({ id }) => {
        try {
            await axiosObj.delete(`/keywords/${id}`);
        } catch (e) {
            console.log(e);
        }
    },
    addKeywordToCategory: async ({ id }, keyword, is_excluded) => {
        try {
            const result = await axiosObj.post(`/keywords/`, {
                keyword,
                is_excluded,
                category_id: id,
            });
            return result.data.data;
        } catch (e) {
            console.log(e);
        }
    },
    updateCategoryDetails: async ({ category_name, id }) => {
        try {
            const category = await axiosObj.patch(`/categories/${id}`, {
                category_name
            });
            return category;
        } catch (e) {
            console.log(e);
            return {};
        }
    }
}
