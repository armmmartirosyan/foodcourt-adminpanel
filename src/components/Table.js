import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import TableCol from "./TableCol";
import {useNavigate} from "react-router-dom";

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

                {list.map(tempItem => (
                    <tr
                        key={tempItem.id}
                        className={classNames(
                            'table-row', {
                                process: tempItem.status === 'inProcess',
                                ready: tempItem.status === 'ready',
                                onWay: tempItem.status === 'onTheWay',
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
                ))}
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
