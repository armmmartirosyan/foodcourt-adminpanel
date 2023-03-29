import React from 'react';
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import Select from "react-select";
import {useLocation, useNavigate} from "react-router-dom";

function TopBar(props) {
    const admin = useSelector(state => state.admin.admin);
    const location = useLocation();
    const navigate = useNavigate();
    const {
        pageName,
        searchChange,
        onChangeCategory,
        selectedCategoryId,
        allowAdd = false,
        categories = [],
        search = '',
    } = props;

    return (
        <div className='d-flex justify-content-between header'>
            <h6>{_.startCase(pageName)}</h6>
            {
                searchChange ? (
                    <form className="d-none d-md-flex">
                        <input
                            className="form-control border-0"
                            type="search"
                            placeholder="Поиск по названию"
                            value={search}
                            onChange={(e) => searchChange(e.target.value)}
                        />
                    </form>
                ) : null
            }
            {
                onChangeCategory ? (
                    <Select
                        value={categories.find(cat => cat.value === selectedCategoryId)}
                        name="categories"
                        options={categories}
                        className="basic-select"
                        classNamePrefix="categories"
                        placeholder='Категория'
                        onChange={onChangeCategory}
                        isClearable
                    />
                ) : null
            }
            {
                allowAdd ? (
                    <button
                        className="btn btn-sm btn-primary"
                        disabled={admin && admin.role === 'админ'}
                        onClick={() => {
                            navigate(`/${location.pathname.split('/')[1]}/add`)
                        }}
                    >
                        {`${pageName === 'admin' ? 'Регистр' : 'Добавить'} ${pageName}`}
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
    onChangeCategory: PropTypes.func,
    categories: PropTypes.array,
    allowAdd: PropTypes.bool,
}
export default TopBar;
