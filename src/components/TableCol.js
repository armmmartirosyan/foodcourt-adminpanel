import React from 'react';
import Helper from "../helpers/Helper";

const {REACT_APP_API_URL} = process.env;

function TableCol(props) {
    const {tempItem, headerCol} = props;

    return (
        <td>
            {
                headerCol.path === 'imagePath' ? (
                    <img
                        src={`${REACT_APP_API_URL}/${tempItem[headerCol.path]}`}
                        alt="image"
                        className='table-img'
                    />
                ) : null
            }
            {
                headerCol.path === 'price' ? (
                    tempItem[headerCol.path] + ' AMD'
                ) : null
            }
            {
                headerCol.path !== 'price'
                && headerCol.path !== 'imagePath' ? (
                    Helper.shortTxt(tempItem[headerCol.path])
                ) : null
            }
        </td>
    );
}

export default TableCol;
