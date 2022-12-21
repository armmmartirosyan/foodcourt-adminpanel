import React from 'react';

function TopBar(props) {
    const {openCloseModal, pageName} = props;

    return (
        <div className='d-flex justify-content-between'>
            <h6 className="mb-4">{`${pageName} page`}</h6>
            <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                    openCloseModal()
                }}
            >
                {`Add ${pageName}`}
            </button>
        </div>
    );
}

export default TopBar;
