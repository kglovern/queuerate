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


const ForwardingSettingView = ({ forwardingSetting }) => {
    const [fs, setFS] = useState(forwardingSetting);
    const integrationTypes = {
        1: "Todoist",
        2: "Pocket",
        3: "Instapaper"
    }
    const [it, setIT] = useState(fs.forwarding_app || 1)
    console.log(forwardingSetting)

    const alignment = {
        "display": "flex",
        "alignItems": "center"
    }


    useEffect(() => {
        /**
         * Fetch all settings for the given user
         * @returns {Promise<void>}
         */
        const setInitialEditData = async () => {
            //     const fs = await UserSettingsAPIService.fetchForwardingSettings(uuid);
            //     setFS(fs);
        }
        setInitialEditData();
    });
    return (
        <div>
            <div style={alignment}>
                <h2>
                    Forwarding Settings
                </h2>
            </div>

            {
                //<Paper>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Integration Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={it || "Unknown"}
                    >
                        {
                            Object.keys(integrationTypes).map(key => (
                                <MenuItem value={key} key={key}>{integrationTypes[key]}</MenuItem>
                            ))
                        }
                    </Select>
                    <TextField label="API Key" variant="filled" defaultValue={fs.api_key}>
                    </TextField>
                    <TextField label="Forwarding URL" variant="filled" defaultValue={fs.default_forwarding_url}>
                    </TextField>
                    <Button variant="contained" startIcon={<SaveIcon/>} >
                        Save
                    </Button>
                </FormControl>
                //</Paper>
            }
        </div>
    );
}

export default ForwardingSettingView
