import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { fetchCategories, updateCategory } from '../APIs/Category'
import { get_uuid } from "../Utility/Firebase"
import Button from '@material-ui/core/Button';

class ArchivedCategoryView extends Component {
    constructor(props) { 
        super(props)
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    componentDidMount() {
        const { fetchCategories } = this.props
        fetchCategories(get_uuid())
    }

    handleOnClick(event) {
        const { id } = event.currentTarget
        const { updateCategory } = this.props
        updateCategory(id, false)
    }

    render() {
        const { categories } = this.props
        console.log(categories)

        return (
            <div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                categories.map(category => {
                                    return (   
                                        <TableRow key={category.id}>
                                            <TableCell>{category.category_name}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    id={category.id}
                                                    onClick={this.handleOnClick}>
                                                    Unarchived
                                                </Button>
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
    fetchCategories: (uuid) => dispatch(fetchCategories(uuid)),
    updateCategory: (category_id, is_archived) => dispatch(updateCategory(category_id, is_archived))
})

const mapStateToProps = state => ({
    categories: state.category ? state.category.categories.filter(el => el.is_archived) : []
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArchivedCategoryView)