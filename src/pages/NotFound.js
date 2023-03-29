import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPager} from "@fortawesome/free-solid-svg-icons";

function NotFound() {
    return (
        <div className='empty_page'>
            <FontAwesomeIcon icon={faPager} />
            <p>Page not found</p>
        </div>
    );
}

export default NotFound;
