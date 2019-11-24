import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ManageLinkAPIService from "./ManageLinkAPIService";

const ManageLink = ({match}) => {
    const {linkID} = match.params;
    const [relevantKeywords, setRelevantKeywords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [link, setLink] = useState([]);

    useEffect(() => {

        const fetchInitialData = async () => {
            const linkObj = await ManageLinkAPIService.fetchLinkMetadata(linkID);
            const rkObj = await ManageLinkAPIService.fetchAllRelevantKeywords(linkID);
            const linkCurCategories = linkObj.categories;
            const categoriesObj = await ManageLinkAPIService.fetchAllUserCategories(linkObj.user_id);
            setCategories(ManageLinkAPIService.transformCategoryArr(categoriesObj, linkCurCategories));
            setRelevantKeywords(rkObj);
            setLink(linkObj);
        }
        fetchInitialData();

    }, [linkID]);

    const handleSwitchChange = (event) => {
        const updatedCategories = {
            ...categories
        }
        const eventCategory = categories[event.target.value];
        updatedCategories[event.target.value] = {
            ...eventCategory,
            is_categorized_as: event.target.checked
        }
        setCategories(updatedCategories);
    }

    const handleCategorySave = async () => {
        await ManageLinkAPIService.updateLinkCategories(link.id, categories);
    }

    return (
        <div>
            <h1><a href={link.url} target="_blank">{link.link_title}</a></h1>
            <Grid container justify="space-around" spacing={1}>
                <Grid item xs={7}>
                    <Paper style={{padding: '1em'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Keyword</b></TableCell>
                                    <TableCell><b>Relevance Rating</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {relevantKeywords.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell align="left"><i>{row.keyword}</i></TableCell>
                                        <TableCell align="left">{row.relevance.toFixed(4)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Paper style={{padding: '2em'}}>
                        <b>Manage Categories</b>
                        <Grid container direction="column">
                            {
                                Object.entries(categories).map(([key, row]) => (
                                    <Grid container alignItems='center' key={key}>
                                        <Grid item xs={6}>{row.category_name}</Grid>
                                        <Grid item xs={6}>
                                            <Switch checked={row.is_categorized_as}
                                                    onChange={handleSwitchChange}
                                                    value={row.id}
                                                    inputProps={{'aria-label': 'primary checkbox'}}/>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <Button variant="outlined" color="primary" onClick={handleCategorySave}>Save categories</Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>

    )
}

export default ManageLink
