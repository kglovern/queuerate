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
    }
}
