import React, { useEffect, useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import Button from "@material-ui/core/Button";
import EditCategoryAPIService from "./EditCategoryAPIService";


const EditCategory = ({match, updateParentCategory, uuid}) => {
    const { categoryID } = match.params;
    // Local state
    const [category, setCategory] = useState({});
    const [excludedKeywords, setExcludedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [keywordObj, setKeywordObj] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const setInitialEditData = async () => {
            const obj = await EditCategoryAPIService.fetchCategory(categoryID);
            setCategory(obj);
            setKeywordObj(obj.keywords);
            // Filter keywords into two categories based on exclusion status
            const excludedArr = obj.keywords
                    .filter (k => k.is_excluded === true)
                    .map(k => k.keyword);
            const includedArr = obj.keywords
                    .filter (k => k.is_excluded === false)
                    .map(k => k.keyword);
            setExcludedKeywords(excludedArr);
            setKeywords(includedArr);
            setCategoryName(category.name);
        }
        setInitialEditData();

    }, [categoryID]);

    const handleDeleteKeyword = async (chip, index, is_excluded=false) => {
        // Filter local state array
        if (is_excluded) {
            const arr = excludedKeywords.filter(k => k != chip)
            setExcludedKeywords(arr);
        } else {
            const arr = keywords.filter(k => k != chip)
            setKeywords(arr);
        }
        // API call to delete keyword
        const obj = keywordObj.find(k => k.keyword === chip)
        await EditCategoryAPIService.deleteKeywordById(obj);
        const arr = keywordObj.filter(k => k.keyword != chip);
        setKeywordObj(arr);
    }

    const handleAddKeyword = async (chip, is_excluded=false) => {
        if (is_excluded) {
            const arr = [...excludedKeywords, chip];
            setExcludedKeywords(arr);
        } else {
            const arr = [...keywords, chip];
            setKeywords(arr);
        }
        const { keyword } = await EditCategoryAPIService.addKeywordToCategory(category, chip, is_excluded);
        const arr = [...keywordObj, keyword];
        setKeywordObj(arr);
    }

    const handleNameChange =  (e) => {
        const { value } = e.target;
        setCategoryName(value);
    }

    const handleNameChangeSubmit = async (e) => {
        if (e.key == 'Enter') {
            const catObj = {
                ...category,
                category_name: categoryName
            };
            setCategory(catObj);
            await EditCategoryAPIService.updateCategoryDetails(catObj);
            updateParentCategory(uuid);
        }
    }

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
                    onChange={handleNameChange}
                    onKeyPress={handleNameChangeSubmit}
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
                    onDelete={(chip, index) => handleDeleteKeyword(chip, index, false)}
                    onAdd={(chip) => handleAddKeyword(chip, false)}
                />
                <br />
                <Typography variant="subtitle1" noWrap>
                    Does not contain
                </Typography>
                <ChipInput
                    value={excludedKeywords}
                    onDelete={(chip, index) => handleDeleteKeyword(chip, index, true)}
                    onAdd={(chip) => handleAddKeyword(chip, true)}
                />
                <br />
            </FormControl>
    );
};

export default EditCategory;
