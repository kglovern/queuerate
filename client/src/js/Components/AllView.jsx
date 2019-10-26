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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchCategories } from '../APIs/Category';
import { fetchLinks, createLink } from '../APIs/Link';

import './AllView.css';

class AllView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            link_name: ""
        }
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        const { link_name } = this.state
        const { uuid, createLink } = this.props
        if (link_name) {
            createLink({
                user_id: "aaabbbcccddd",
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
        const { fetchLinks, uuid } = this.props;
        fetchLinks("aaabbbcccddd");
    }

    render() {
        const { link_name } = this.state
        const { links } = this.props
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
                </div>
                <br /><br /><br />
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Link</TableCell>
                                <TableCell>Last Categorized</TableCell>
                                <TableCell>Categories</TableCell>
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
    createLink: (link_data) => dispatch(createLink(link_data)),
    fetchLinks: (uuid) => dispatch(fetchLinks(uuid)),
})

const mapStateToProps = state => ({
    uuid: state.user ? state.user.uuid ? state.user.uuid : "" : "",
    links: state.link ? state.link.links : []
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllView)