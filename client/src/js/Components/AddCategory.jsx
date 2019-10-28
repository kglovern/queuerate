import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input';
import Button from '@material-ui/core/Button';
import { createCategory } from "../APIs/Category";
import { get_uuid } from "../Utility/Firebase"

class AddCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contain_tags: [],
            do_not_contain_tags: [],
            name: ""
        }
        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    handleAddChip(chip, toggle) {
        if (toggle) {
            let local_state = this.state['do_not_contain_tags']
            local_state.push(chip)
            this.setState({
                do_not_contain_tags: local_state
            });
        } else {
            let local_state = this.state['contain_tags']
            local_state.push(chip)
            this.setState({
                contain_tags: local_state
            });
        }

    }

    handleDeleteChip(chip, index, toggle) {
        if (toggle) {
            let local_state = this.state['do_not_contain_tags']
            local_state.splice(index, 1);
            this.setState({
                do_not_contain_tags: local_state
            });
        } else {
            let local_state = this.state['contain_tags']
            local_state.splice(index, 1);
            this.setState({
                contain_tags: local_state
            });
        }
    }

    handleSubmit(event) {
        const { createCategory } = this.props
        const { name, contain_tags, do_not_contain_tags } = this.state

        createCategory({
            user_id: get_uuid(),
            category_name: name,
            contain_tags: contain_tags,
            do_not_contain_tags: do_not_contain_tags
        })
        this.setState({
            contain_tags: [],
            do_not_contain_tags: [],
            name: ""
        })
        event.preventDefault();
    }

    changeHandler = event => {
        this.setState({
            name: event.target.value
        });
    }

    render() {
        const { contain_tags, do_not_contain_tags } = this.state
        return (
            <FormControl noValidate>
                <Typography variant="h5" noWrap>
                    Add Category
                 </Typography>
                <TextField
                    required
                    label="Name"
                    id="standard-required"
                    margin="normal"
                    onChange={this.changeHandler}
                />

                <Typography variant="h6" noWrap>
                    Keywords
                 </Typography>
                <br />

                <Typography variant="subtitle1" noWrap>
                    Contains
                 </Typography>
                <ChipInput
                    value={contain_tags}
                    onAdd={(chip) => this.handleAddChip(chip, 0)}
                    onDelete={(chip, index) => this.handleDeleteChip(chip, index, 0)}
                />
                <br />
                <Typography variant="subtitle1" noWrap>
                    Does not contain
                 </Typography>
                <ChipInput
                    value={do_not_contain_tags}
                    onAdd={(chip) => this.handleAddChip(chip, 1)}
                    onDelete={(chip, index) => this.handleDeleteChip(chip, index, 1)}
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                >Add</Button>
            </FormControl>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    createCategory: (category_data) => dispatch(createCategory(category_data))
})

export default connect(
    null,
    mapDispatchToProps
)(AddCategory)