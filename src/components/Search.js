import React from 'react';
import PropTypes from "prop-types";

function Search(props) {
    const {search, searchChange} = props;

    return (
        <form className="d-none d-md-flex">
            <input
                className="form-control border-0"
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e)=>searchChange(e.target.value)}
            />
        </form>
    );
}

Search.propTypes = {
    search: PropTypes.string.isRequired,
    searchChange: PropTypes.func.isRequired,
}
export default Search;
