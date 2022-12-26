import React from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

function PageNumbers(props) {
    const {totalPages, currentPage, handleClickPage} = props;

    return (
        <div className="pages">
            {
                [...new Array(totalPages)].map((v, i) => (
                    <button
                        className={classNames(
                            'btn btn-sm btn-primary m-1',
                            {active_page: currentPage === i + 1}
                        )}
                        key={i}
                        onClick={() => {
                            handleClickPage(i + 1)
                        }}
                    >
                        {i + 1}
                    </button>
                ))
            }
        </div>
    );
}
PageNumbers.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handleClickPage: PropTypes.func.isRequired,
}
export default PageNumbers;
