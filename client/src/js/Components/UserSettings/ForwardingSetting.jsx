import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserSettingsAPIService from "./UserSettingsAPIService";
import Paper from '@material-ui/core/Paper';
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const ForwardingSettingView = ({ forwardingSetting }) => {
    const [fs, setFS] = useState(forwardingSetting);
    const integrationTypes = {
        1: "Todoist",
        2: "Pocket",
        3: "Instapaper"
    }
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
                    {integrationTypes[fs.forwarding_app] || "Unknown"} Forwarding Settings
                </h2>
            </div>

            {
                <Paper>
                    <FormControl>
                            {fs.default_forwarding_url}
                        <TextField>
                        </TextField>
                    </FormControl>
                </Paper>
            }
        </div>
    );
}

export default ForwardingSettingView
