import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchLinks, createLink, markAsRead, markAsUnread } from '../APIs/Link';
import { get_uuid } from "../Utility/Firebase"
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/Settings';
import Checkbox from '@material-ui/core/Checkbox';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

import './AllView.css';
import {Link} from "react-router-dom";
import {IconButton} from "@material-ui/core";

class AllView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            link_name: ""
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleReadState = this.toggleReadState.bind(this);
    }

    handleSubmit() {
        const { link_name } = this.state
        const { createLink } = this.props

        if (link_name) {
            createLink({
                user_id: get_uuid(),
                url: link_name
            })
            this.setState({
                link_name: ""
            })
        }
    }

    onChange(event) {
        const { value } = event.target;
        this.setState({
            link_name: value
        });
    }

    componentDidMount() {
        const { fetchLinks } = this.props;
        fetchLinks(get_uuid());
    }

    toggleReadState(id, read_state) {
        const { markAsRead, markAsUnread } = this.props;
        if(read_state) {
            markAsRead(id, get_uuid());
        } else {
            markAsUnread(id, get_uuid());
        }
    }

    render() {
        const { link_name } = this.state
        const { links, fetchLinks } = this.props

        return ( 
            <div>
                <div style={{ display: 'flex' }}>
                    <TextField
                        variant="outlined"
                        name="url"
                        className={"link_input"}
                        label="URL"
                        value={link_name}
                        id="url"
                        onChange={this.onChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        Add
                    </Button>
                    <Button
                        onClick={() => fetchLinks(get_uuid())}
                    >
                    <RefreshIcon />
                    </Button>
                </div>
                <br /><br />
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Link</TableCell>
                                <TableCell>Last Categorized</TableCell>
                                <TableCell>Categories</TableCell>
                                <TableCell>Mark as Read</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                links.map(link => {
                                    return (
                                        <TableRow key={link.id}>
                                            <TableCell><a href={link.url} target="_blank">{link.link_title || link.url}</a></TableCell>
                                            <TableCell>{moment(link.updated_at).format("h:mm A - MMM Do")}</TableCell>
                                            <TableCell>
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
                                            </TableCell>
                                            <TableCell size="small">                                               
                                                 <Checkbox icon={<StarBorder />}
                                                    checkedIcon={<Star />}
                                                    checked={link.is_marked_as_read}
                                                    onClick={() => this.toggleReadState(link.id, !link.is_marked_as_read)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    to={`/link/${link.id}/manage`}>
                                                    <IconButton aria-label="manage_link">
                                                        <SettingsIcon />
                                                    </IconButton>
                                                </Link>
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
    createLink: (link_data) => dispatch(createLink(link_data)),
    fetchLinks: (uuid) => dispatch(fetchLinks(uuid)),
    markAsRead: (id,uuid) => dispatch(markAsRead(id, uuid)),
    markAsUnread: (id, uuid) => dispatch(markAsUnread(id, uuid))
})

const mapStateToProps = state => ({
    links: state.link ? state.link.links : []
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllView)
