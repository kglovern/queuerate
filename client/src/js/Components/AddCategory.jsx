import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class AddCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contain_tags: [],
            do_not_contain_tags: [],
        }
        this.handleAddChip = this.handleAddChip.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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


    handleSubmit() {
        console.log("add")
    }

    render() {
        const { contain_tags, do_not_contain_tags } = this.state
        return (
            <FormControl >
                <Typography variant="h5" noWrap>
                    Add Category
                </Typography>
                <TextField
                    required
                    label="Name"
                    id="standard-required"
                    margin="normal"
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
                    onSubmit={() => this.handleSubmit()}
                    onChange={() => this.handleSubmit()}
                    // className={"button"}
                    >Add</Button>
            </FormControl>
        )
    }
}

export default AddCategory;