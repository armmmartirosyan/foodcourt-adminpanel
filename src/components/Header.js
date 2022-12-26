import React, {useCallback} from 'react';
import PropTypes from "prop-types";

function Header(props) {
    const {setSearch, search,onChange} = props;
    //
    // const handleSearch = useCallback((e) => {
    //     setSearch(e.target.value);
    // },[]);

    return (
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-2">
            <form className="d-none d-md-flex">
                <input
                    className="form-control border-0"
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e)=>onChange(e.target.value)}
                />
            </form>
        </nav>
    );
}
Header.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
}
export default Header;
