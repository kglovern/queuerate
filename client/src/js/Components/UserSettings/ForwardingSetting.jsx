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

const createFS = (integrationType) => {
    return {
        "forwarding_app" : integrationType,
        "default_forwarding_url" : "",
        "api_key" : "",
    }
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
    const [currentFS, setCurrentFS] = useState(createFS(defaultIT));
    const [it, setIT] = useState(defaultIT)

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
            setIT(integrationType || -1);
            const currentFS = getFSByIntegrationType(forwarding_settings, integrationType) || createFS(integrationType);
            console.log(currentFS);
            setCurrentFS(currentFS);
        }
        fetchSettings();
    }, [uuid]);


    const handleIntegrationTypeChange = (e) => {
        const { value } = e.target;
        setIT(value);
        setCurrentFS(getFSByIntegrationType(fs, value) || createFS(value));
    }

    const handleAPIKeyChange =  (e) => {
        const { value } = e.target;
        const newFS = currentFS;
        newFS.api_key = value;
        console.log(newFS.api_key);
        setCurrentFS(newFS);
    }

    const handleProjectChange =  (e) => {
        const { value } = e.target;
        const newFS = currentFS;
        newFS.default_forwarding_url = value;
        setCurrentFS(newFS);
    }

    const onSaveClick = (e) => {
        var createdFS;
        if (fs.id != null) {
            createdFS = UserSettingsAPIService.updateForwardingSetting(fs, uuid);
        }
        else {
            createdFS = UserSettingsAPIService.createForwardingSetting(fs, uuid);
        }
        if (createdFS != null) {
            setCurrentFS(createdFS);
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
                        value={currentFS.api_key}
                        onChange={handleAPIKeyChange}
                    >
                    </TextField>
                    <TextField
                        label="Project"
                        variant="filled"
                        value={currentFS.default_forwarding_url}
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
