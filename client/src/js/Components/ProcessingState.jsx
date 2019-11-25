import React from 'react'
import WarningIcon from '@material-ui/icons/Warning';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const ProcessingState = ({processing_state}) => {
    console.log(processing_state)

    if (processing_state == 0) {
        return (
            <HourglassFullIcon titleAccess="This link is waiting to be processed" />
        )
    } else if (processing_state == 2) {
        return (
            <WarningIcon titleAccess="An error was encountered processing this link"/>
        )
    } else  {
        return (
            <span></span>
            //<CheckCircleIcon titleAccess="This link is finished processing"/>
        )
    }

}

export default ProcessingState
