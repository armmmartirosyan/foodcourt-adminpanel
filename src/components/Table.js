import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import TableCol from "./TableCol";
import {useNavigate} from "react-router-dom";
import _ from 'lodash';

function Table(props) {
    const {tableHeader, list, path} = props;
    const navigate = useNavigate();

    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                <tr>
                    {tableHeader.map(headerCol => (
                        <th scope="col" key={headerCol.path}>
                            {headerCol.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>

                {
                    !_.isEmpty(list) ? (
                        list.map(tempItem => (
                            <tr
                                key={tempItem.id}
                                className={classNames(
                                    'table-row', {
                                        process: tempItem.status === 'в процессе',
                                        ready: tempItem.status === 'готовый',
                                        onWay: tempItem.status === 'в пути',
                                    })}
                                onClick={() => {
                                    if(path) navigate(`/${path}/${tempItem.slugName || tempItem.id}`);
                                }}
                            >
                                {
                                    tableHeader.map(headerCol => (
                                        <TableCol
                                            key={headerCol.label}
                                            headerCol={headerCol}
                                            tempItem={tempItem}
                                        />
                                    ))
                                }
                            </tr>
                        ))
                    ) : null
                }
                </tbody>
            </table>
        </div>
    );
}

Table.propTypes = {
    tableHeader: PropTypes.array.isRequired,
    list: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
}

export default Table;
