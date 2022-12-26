import React from 'react';
import {useSelector} from "react-redux";
import PropTypes from "prop-types";

function TopBar(props) {
    const {openCloseModal, pageName} = props;
    const admin = useSelector(state => state.admin.admin);

    return (
        <div className='d-flex justify-content-between'>
            <h6 className="mb-4">{`${pageName} page`}</h6>
            <button
                className="btn btn-sm btn-primary"
                disabled={admin && admin.possibility === 'junior'}
                onClick={() => {
                    openCloseModal()
                }}
            >
                {`Add ${pageName}`}
            </button>
        </div>
    );
}
TopBar.propTypes = {
    pageName: PropTypes.string.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default TopBar;
