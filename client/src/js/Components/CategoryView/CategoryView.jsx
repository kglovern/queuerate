import React, { useState, useEffect } from 'react'
import CategoryViewAPIService from "./CategoryViewAPIService";
import MarkAsRead from './MarkAsRead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';

const CategoryView = ({match}) => {
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
    return (
        <div>
            <h1>{category.category_name}</h1>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Link</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Categories</TableCell>
                            <TableCell>Mark as Read</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            links.map( link => (
                                <TableRow key={link.id}>
                                    <TableCell><a href={link.url} target="_blank">{link.link_title}</a></TableCell>
                                    <TableCell>{moment(link.updated_at).format("h:mm A - MMM Do")}</TableCell>
                                    <TableCell>
                                        {
                                            link.categories.map(link_category => (
                                                <span key={link_category.id}>{link_category.category_name}</span>
                                            ))
                                        }
                                    </TableCell>
                                    <TableCell size="small">
                                        <MarkAsRead linkId={link.id}
                                                    read_state={link.is_marked_as_read}
                                        />
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
