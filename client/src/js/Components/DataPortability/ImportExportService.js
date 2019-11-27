import {axiosObj} from "../../Utility/axios";
import {toast} from "react-toastify";
const FileDownload = require('js-file-download');

export default {
    getExportedCategory: async (uuid) => {
        try {
            const url = `/users/${uuid}/export`;
            const exportData = await axiosObj.get(url);
            FileDownload(JSON.stringify(exportData.data.categories), `categories_export_${Date.now()}.json`);
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    sendCategoryUpload: async (file, uuid) => {
        const reader = new FileReader();
        let payload = null;
        let successfulImport = false;
        reader.onload = async (e) => {
            try {
                payload = JSON.parse(e.target.result);
            } catch (e) {
                toast.error("Unable to parse file as JSON - please upload a valid JSON file");
                return false;
            }
            try {
                const result = await axiosObj.post(`/users/import`, {
                    categories: payload,
                    uuid: uuid
                });
                toast.info("Successfully imported categories")
                window.location.reload();
            } catch (e) {
                console.log(e);
                return false;
            }
        }
        await reader.readAsText(file);
        return successfulImport;
    }
};
