import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import MarkAsRead from './CategoryView/MarkAsRead';
import { fetchUncategorizedLinks } from '../APIs/Link';

import './AllView.css';

class UncategorizedView extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { fetchUncategorizedLinks, uuid } = this.props;
        fetchUncategorizedLinks("aaabbbcccddd");
    }

    render() {
        const { links } = this.props
        return (
            <div>
                <h1>Uncategorized Links </h1>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> Link</TableCell>
                                <TableCell>Created</TableCell>
                                {/* <TableCell>Categories</TableCell> */}
                                <TableCell>Mark as Read</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                links.map(link => {
                                    return (
                                        <TableRow key={link.id}>
                                            <TableCell><a href={link.url} target="_blank">{link.link_title || link.url}</a></TableCell>
                                            <TableCell>{moment(link.updated_at).format("h:mm A - MMM Do")}</TableCell>
                                            {/* <TableCell>
                                                {
                                                    link.categories.length > 0 ? 
                                                        link.categories.map((link_category, index) => {
                                                            return (
                                                                <span 
                                                                    key={link_category.id}>
                                                                    {link_category.category_name} 
                                                                    {index + 1 != link.categories.length ? ", " : "" }
                                                                </span>
                                                            )
                                                        }) : 
                                                        "Uncategorized"
                                                }
                                            </TableCell> */}
                                            <TableCell size="small">
                                                <MarkAsRead linkId={link.id}
                                                    read_state={link.is_marked_as_read}
                                                />
                                            </TableCell>
                                        </TableRow>)
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUncategorizedLinks: (uuid) => dispatch(fetchUncategorizedLinks(uuid)),
})

const mapStateToProps = state => ({
    uuid: state.user ? state.user.uuid ? state.user.uuid : "" : "",
    links: state.link ? state.link.links : []
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UncategorizedView)