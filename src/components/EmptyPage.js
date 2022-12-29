import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPager } from '@fortawesome/free-solid-svg-icons'

function EmptyPage() {
    return (
        <div className='empty_page'>
            <FontAwesomeIcon icon={faPager} />
            <p>Empty page</p>
        </div>
    );
}

export default EmptyPage;
