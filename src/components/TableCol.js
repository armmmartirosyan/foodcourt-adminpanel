import React from 'react';
import Helper from "../helpers/Helper";
import PropTypes from "prop-types";
import momentWL from "moment-with-locales-es6";

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
        'phoneNum',
        'allowUse',
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
                    temp + ' RUB'
                ) : null
            }
            {
                headerCol.path[headerCol.path.length - 1] === 'createdAt' ? (
                    momentWL(temp).format('ddd, LT')
                ) : null
            }
            {
                headerCol.path[headerCol.path.length - 1] === 'allowUse' ? (
                    temp === 't' ? 'Использовать' : 'Не использовать'
                ) : null
            }
            {
                headerCol.path[headerCol.path.length - 1] === 'phoneNum' ? (
                    `+${temp}`
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
