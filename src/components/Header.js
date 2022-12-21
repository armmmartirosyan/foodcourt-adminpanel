import React, {useCallback} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from '@fortawesome/free-solid-svg-icons'

function Header(props) {
    const {searchable, setSearch, search} = props;
    let timeout;

    const handleSearch = useCallback((e) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            setSearch(e.target.value);
        }, 300);
    },[timeout]);

    return (
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-2">
            {
                searchable ? (
                    <form className="d-none d-md-flex ms-4">
                        <input
                            className="form-control border-0"
                            type="search"
                            placeholder="Search"
                            value={search}
                            onChange={handleSearch}
                        />
                    </form>
                ) : null
            }
        </nav>
    );
}

export default Header;
