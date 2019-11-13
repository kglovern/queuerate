import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import CategoryViewAPIService from "./CategoryViewAPIService";
import MarkAsRead from './MarkAsRead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { replayLinkWithoutDispatch } from '../../APIs/Link';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';
import ReplayIcon from '@material-ui/icons/Replay';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteCategory } from '../../APIs/Category';

const CategoryView = ({match, updateParentCategory, history}) => {
    const { categoryID } = match.params;
    const [category, setCategory] = useState({});
    const [links, setLinks] = useState([]);

    useEffect(() => {
        /**
         * Fetch category general info along with links for that category based on param ID
         * @returns {Promise<void>}
         */
        const fetchCategoryAndLinks = async () => {
            const categoryObj = await CategoryViewAPIService.fetchCategoryObj(categoryID);
            setCategory(categoryObj);
            const linksObj = await CategoryViewAPIService.fetchCategoryLinks(categoryID);
            setLinks(linksObj);
        }
        fetchCategoryAndLinks();
    }, [categoryID]);

    const replayLink = async (id, user_id) => {
        await replayLinkWithoutDispatch(id, user_id);
    }

    const deleteCategoryHandler = async (category_id) => {
        await deleteCategory(category_id)
            .then(response => {
                updateParentCategory();
                history.push('/');
            })
    }

    return (
        <div>
            <h1>
                {category.category_name}
                <Link
                    to={`/category/${categoryID}/edit`}>
                    <IconButton aria-label="edit_category">
                        <SettingsIcon />
                    </IconButton>
                </Link>
                <IconButton 
                    aria-label="delete_category"
                    onClick={() => deleteCategoryHandler(categoryID)}
                    >
                    <DeleteIcon />
                </IconButton>
            </h1>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Link</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Categories</TableCell>
                            <TableCell>Mark as Read</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { 
                            links.map( link => (
                                <TableRow key={link.id}>
                                    <TableCell><a href={link.url} target="_blank">{link.link_title || link.url}</a></TableCell>
                                    <TableCell>{moment(link.updated_at).format("h:mm A - MMM Do")}</TableCell>
                                    <TableCell>
                                        {
                                            link.categories.map((link_category, index) => (
                                                <span key={link_category.id}>
                                                    {link_category.category_name}
                                                    {index + 1 != link.categories.length ? ", " : "" }
                                                </span>
                                            ))
                                        }
                                    </TableCell>
                                    <TableCell size="small">
                                        <MarkAsRead linkId={link.id}
                                                    read_state={link.is_marked_as_read}
                                        />
                                    </TableCell>
                                    <TableCell>
                                                <IconButton 
                                                    aria-label="replay_link"
                                                    onClick={() => replayLink(link.id, link.user_id)}>
                                                    <ReplayIcon />
                                                </IconButton>
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
                        }
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

export default CategoryView
