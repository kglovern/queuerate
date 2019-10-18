import React, { useState, useEffect } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import CategoryViewAPIService from "./CategoryViewAPIService";


const MarkAsRead = ({read_state, linkId}) => {
    const [readState, setReadState] = useState(false);

    useEffect(() => {
        setReadState(read_state);
    }, [])

    const toggleReadState = async () => {
        setReadState(!readState);
        await CategoryViewAPIService.changeLinkReadState(linkId, readState);
    }

    return (
        <Checkbox icon={<StarBorder />}
                  checkedIcon={<Star />}
                  checked={readState}
                  onClick={toggleReadState}
        />
    )
}

export default MarkAsRead;
