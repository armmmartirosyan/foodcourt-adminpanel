import React from 'react';
import Helper from "../helpers/Helper";
import PropTypes from "prop-types";
import moment from "moment/moment";

const {REACT_APP_API_URL} = process.env;

function TableCol(props) {
    const {tempItem, headerCol} = props;
    let temp = tempItem;

    headerCol.path.forEach(p => {
        temp = temp[p];
    });

    const excludePath = [
        'price',
        'imagePath',
        'createdAt',
    ];

    return (
        <td>
            {
                headerCol.path[headerCol.path.length - 1] === 'imagePath' ? (
                    <img
                        src={`${REACT_APP_API_URL}/${temp}`}
                        alt="image"
                        className='table-img'
                    />
                ) : null
            }
            {
                headerCol.path[headerCol.path.length - 1] === 'price' ? (
                    temp + ' AMD'
                ) : null
            }
            {
                headerCol.path[headerCol.path.length - 1] === 'createdAt' ? (
                    moment(temp).format('ddd, LT')
                ) : null
            }
            {
                !excludePath.includes(headerCol.path[headerCol.path.length - 1]) ? (
                    Helper.shortTxt(temp)
                ) : null
            }
        </td>
    );
}

TableCol.propTypes = {
    tempItem: PropTypes.object.isRequired,
    headerCol: PropTypes.object.isRequired,
}

export default TableCol;
