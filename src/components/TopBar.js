import React from 'react';
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import Search from "./Search";
import _ from "lodash";

function TopBar(props) {
    const {openCloseModal, pageName, searchChange, search = ''} = props;
    const admin = useSelector(state => state.admin.admin);

    return (
        <div className='d-flex justify-content-between header'>
            <h6>{`${_.capitalize(pageName)} page`}</h6>
            {
                searchChange ? (
                    <Search
                        search={search}
                        searchChange={searchChange}
                    />
                ) : null
            }
            {
                openCloseModal ? (
                    <button
                        className="btn btn-sm btn-primary"
                        disabled={admin && admin.possibility === 'junior'}
                        onClick={() => {
                            openCloseModal()
                        }}
                    >
                        {`${pageName === 'admin' ? 'Register' : 'Add'} ${pageName}`}
                    </button>
                ) : null
            }
        </div>
    );
}

TopBar.propTypes = {
    pageName: PropTypes.string.isRequired,
    search: PropTypes.string,
    openCloseModal: PropTypes.func,
    searchChange: PropTypes.func,
}
export default TopBar;
