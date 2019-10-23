import React, { useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import Button from "@material-ui/core/Button";
import EditCategoryAPIService from "./EditCategoryAPIService";


const EditCategory = ({match}) => {
    const { categoryID } = match.params;
    // Local state
    const [category, setCategory] = useState({});
    const [excludedKeywords, setExcludedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);


    useEffect(() => {
        const setInitialEditData = async () => {
            const obj = await EditCategoryAPIService.fetchCategory(categoryID);
            setCategory(obj);
            // Filter keywords into two categories based on exclusion status
            const excludedArr = obj.keywords
                    .filter (x => x.is_excluded === true)
                    .map(x => x.keyword);
            const includedArr = obj.keywords
                    .filter (x => x.is_excluded === false)
                    .map(x => x.keyword);
            setExcludedKeywords(excludedArr);
            setKeywords(includedArr);
        }
        setInitialEditData();

    }, [categoryID]);

    return (
            <FormControl >
                <Typography variant="h5" noWrap>
                    Edit Category - "{ category.category_name }"
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
                    value={keywords}
                />
                <br />
                <Typography variant="subtitle1" noWrap>
                    Does not contain
                </Typography>
                <ChipInput
                    value={excludedKeywords}
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                >
                    Save Changes
                </Button>
            </FormControl>
    );
};

export default EditCategory;
