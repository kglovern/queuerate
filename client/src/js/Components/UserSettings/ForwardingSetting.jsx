import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserSettingsAPIService from "./UserSettingsAPIService";
import Paper from '@material-ui/core/Paper';
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';
import { get_uuid } from "../../Utility/Firebase"

const integrationTypes = {
    1: "Todoist",
    2: "Pocket",
    3: "Instapaper"
}

const getFSByIntegrationType = (forwardingSettings, integrationType) => {
    const fs = forwardingSettings.filter((fs) => {
        return fs.forwarding_app == integrationType;
    });
    return fs ? fs[0] : null;
}

const ForwardingSettingView = () => {
    const defaultIT = 1;
    const [fs, setFS] = useState([]);
    const [it, setIT] = useState(defaultIT)
    const [apiKey, setApiKey] = useState("")
    const [project, setProject] = useState("")
    const [id, setID] = useState(null)

    const alignment = {
        "display": "flex",
        "alignItems": "center"
    }

    const uuid = get_uuid();

    useEffect(() => {
        console.log("here");
        /**
         * Fetch all settings for the given user
         * @returns {Promise<void>}
         */
        const fetchSettings = async () => {
            const fs_obj = await UserSettingsAPIService.fetchForwardingSettings(uuid);
            var forwarding_settings = [];
            var default_integration = null;
            if (fs_obj != null){
                forwarding_settings = fs_obj.forwarding_settings;
                default_integration = fs_obj.default_integration;
            }
            console.log(forwarding_settings, default_integration);
            setFS(forwarding_settings);
            const integrationType = default_integration.forwarding_app || 1;
            setIT(integrationType);
            const currentFS = getFSByIntegrationType(forwarding_settings, integrationType);
            console.log(currentFS);
            setID(currentFS ? currentFS.id || null : null)
            setApiKey(currentFS ? currentFS.api_key || "" : null);
            setProject(currentFS ? currentFS.default_forwarding_url || "" : null)
        }
        fetchSettings();
    }, [uuid]);


    const handleIntegrationTypeChange = (e) => {
        const { value } = e.target;
        setIT(value);
        const currentFS = getFSByIntegrationType(fs, value);
        setID(currentFS ? currentFS.id || null : null)
        setApiKey(currentFS ? currentFS.api_key || "" : null);
        setProject(currentFS ? currentFS.default_forwarding_url || "" : null);
    }

    const handleAPIKeyChange =  (e) => {
        const { value } = e.target;
        setApiKey(value);
    }

    const handleProjectChange =  (e) => {
        const { value } = e.target;
        setProject(value);
    }

    const onSaveClick = (e) => {
        var createdFS;
        if (id != null) {
            createdFS = UserSettingsAPIService.updateForwardingSetting(apiKey, project, id, uuid);
        }
        else {
            createdFS = UserSettingsAPIService.createForwardingSetting(apiKey, project, it, uuid);
        }
        if (createdFS != null) {
            setID(createdFS.id)
            setApiKey(createdFS.api_key || "");
            setProject(createdFS.default_forwarding_url || "");
        }
    }

    return (
        <div>
            <div style={alignment}>
                <h2>
                    Forwarding Settings
                </h2>
            </div>

            {
                <FormControl>
                <InputLabel id="demo-simple-select-label">Integration Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={it}
                        onChange={handleIntegrationTypeChange}
                    >
                        {
                            Object.keys(integrationTypes).map(key => (
                                <MenuItem value={key} key={key}>{integrationTypes[key]}</MenuItem>
                            ))
                        }
                    </Select>
                    <TextField
                        label="API Key"
                        variant="filled"
                        value={apiKey}
                        onChange={handleAPIKeyChange}
                    >
                    </TextField>
                    <TextField
                        label="Project"
                        variant="filled"
                        value={project}
                        onChange={handleProjectChange}
                    >
                    </TextField>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />} 
                        type="submit"
                        onClick={onSaveClick}
                        >
                        Save
                    </Button>
                </FormControl>
            }
        </div>
    );
}

export default ForwardingSettingView
