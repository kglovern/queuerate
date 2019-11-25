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
    console.log(uuid)

    useEffect(() => {
        // console.log("here");
        // /**
        //  * Fetch all settings for the given user
        //  * @returns {Promise<void>}
        //  */
        // const fetchSettings = async () => {
        //     const {forwarding_settings, default_integration} = await UserSettingsAPIService.fetchForwardingSettings(uuid);
        //     console.log(forwarding_settings, default_integration);
        //     setFS(forwarding_settings);
        //     setDI(default_integration);
        // }
        // fetchSettings();
    }, [uuid]);
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
                // forwardingSettings.map(forwarding_settings => (
                //     <ForwardingSettingView key={forwarding_settings.id} forwardingSetting={forwarding_settings} />
                // ))
                /* {
                forwardingSettings.map(link => (
                    <TableRow key={link.id}>
                        <TableCell><a href={link.url} target="_blank">{link.link_title || link.url}</a></TableCell>
                        <TableCell>
                            {
                                link.categories.map((link_category, index) => (
                                    <span key={link_category.id}>
                                        {link_category.category_name}
                                        {index + 1 != link.categories.length ? ", " : ""}
                                    </span>
                                ))
                            }
                        </TableCell>
                        <TableCell size="small">
                            <MarkAsRead linkId={link.id}
                                read_state={link.is_marked_as_read}
                            />
                        </TableCell>
                        <TableCell size="small">
                            <Link
                                to={`/link/${link.id}/manage`}>
                                <IconButton aria-label="manage_link">
                                    <SettingsIcon />
                                </IconButton>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))
            } */}
        </div>
    );
}

export default SettingsView
