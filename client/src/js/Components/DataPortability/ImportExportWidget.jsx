import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { get_uuid } from "../../Utility/Firebase";
import ImportExportService from "./ImportExportService";
import {toast} from "react-toastify";
import { browserHistory } from 'react-router'

const ImportExportWidget = (props) => {
    const [uploadFile, setUploadFile] = useState(0);

    const handleExport = async (e) => {
        await ImportExportService.getExportedCategory(get_uuid());
    }

    const handleImport = async (e) => {
        if (uploadFile == 0) {
            toast.error("You must select a file to upload");
            return;
        }
        if (uploadFile.name.split('.').pop() !== 'json') {
            toast.error("The uploaded file must be JSON");
            return;
        }
        const result = await ImportExportService.sendCategoryUpload(uploadFile, get_uuid());
        console.log(result);
        /*if (data.success) {

        } else {
            console.log(data);
        }*/
    }

    const handleFileSelect = (e) => {
        setUploadFile(e.target.files[0]);
        console.log(e.target.files[0]);
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper style={{padding: '2em'}}>
                        <h2>Export Data</h2>
                        <Button variant="contained" color="primary" onClick={handleExport}>Export Category Definitions</Button>
                        <h2>Import Categories</h2>
                        <div style={{margin:'1em 0'}}>
                         <input type="file" name="file" onChange={handleFileSelect}/>
                        </div>
                        <Button variant="contained" color="primary" onClick={handleImport}>Import Category Definitions</Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default ImportExportWidget;
