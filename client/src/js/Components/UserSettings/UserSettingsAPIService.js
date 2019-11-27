import { axiosObj } from "../../Utility/axios";
import { getUser } from "../../APIs/Users";

export default {
    fetchForwardingSettings: async (uuid) => {
        try {
            const { data:
                    { data:
                        {
                            user:
                            {
                                forwarding_settings,
                                default_integration
                            }
                        }
                    }
                } = await getUser(uuid);
            return { "forwarding_settings": forwarding_settings, "default_integration": default_integration };
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    createForwardingSetting: async (api_key, default_forwarding_url, forwarding_app, uuid) => {
        try {
            const forwarding_settings = await axiosObj.post(`/forwarding_settings/`, {
                api_key,
                default_forwarding_url,
                forwarding_app,
                user_id: uuid
            });
            // links.sort(function (a, b) {
            //     return new Date(b.updated_at) - new Date(a.updated_at);
            // });
            return forwarding_settings;
        } catch (e) {
            console.log(e);
            return null;
        }
    },
    updateForwardingSetting: async (api_key, default_forwarding_url, id, uuid) => {
        try {
            const forwarding_settings = await axiosObj.patch(`/forwarding_settings/${id}`, {
                api_key,
                default_forwarding_url,
                id
            });
            return forwarding_settings;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
