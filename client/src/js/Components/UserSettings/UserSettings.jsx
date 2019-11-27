import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserSettingsAPIService from "./UserSettingsAPIService";
import ForwardingSettingView from "./ForwardingSetting";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { get_uuid } from "../../Utility/Firebase"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


const SettingsView = () => {
    const [forwardingSettings, setFS] = useState([]);
    const [defaultIntegration, setDI] = useState(0);

    const alignment = {
        "display": "flex",
        "alignItems": "center"
    }

    const uuid = get_uuid();

    return (
        <div>
            <div style={alignment}>
                <Link
                    to={`/`}>
                    <IconButton aria-label="back_button">
                        <ArrowBackIcon />
                    </IconButton>
                </Link>
                <h1>
                    User Settings
                </h1>
            </div>

            {
                <ForwardingSettingView forwardingSetting={forwardingSettings} defaultIntegration={defaultIntegration}/>
            }
        </div>
    );
}

export default SettingsView
