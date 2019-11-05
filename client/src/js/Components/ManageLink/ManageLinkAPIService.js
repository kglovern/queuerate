import {axiosObj} from "../../Utility/axios";

export default {
    fetchLinkMetadata: async (id) => {
        try {
            const { data: { data: { link } } } = await axiosObj.get(`/links/${id}`);
            return link;
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    fetchAllUserCategories: async(userID) => {
        try {
            const { data: { data: { user : { categories } } } } = await axiosObj.get(`/users/${userID}`);
            return categories;
        } catch (e) {
            console.log(e);
            return {};
        }
    },
    fetchAllRelevantKeywords: async (linkID) => {
        try {
            const { data: { data: { keywords } } } = await axiosObj.get(`/relevant_keywords/${linkID}`);
            return keywords;
        }  catch (e) {
            console.log(e);
            return []
        }
    },
    updateLinkCategories: async (linkID, categoryInfo) => {
        const URL = `/links/${linkID}/categorize`;
        // map it back to an array before posting since we don't need keys
        const postData = []
        for (let key in categoryInfo) {
            postData.push(categoryInfo[key])
        }
        try {
            const data = await axiosObj.post(URL, postData)
            console.log(data)
            return data
        } catch (e) {
            console.log(e);
            return {};
        }
    },
    transformCategoryArr: (categories, currentMatching) => {
        const catObj = {};
        categories.map(category => {
            const mappedObj = {};
            mappedObj.category_name = category.category_name;
            mappedObj.id = category.id;
            mappedObj.is_categorized_as = (currentMatching.filter(c => c.id === category.id).length > 0)
            catObj[category.id] = mappedObj;
        });
        return catObj;
    }
}
