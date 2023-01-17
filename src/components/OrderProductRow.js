import React from 'react';
import PropTypes from "prop-types";

const {REACT_APP_API_URL} = process.env;

function OrderProductRow(props) {
    const {order} = props;
    const {product} = order;

    return (
        <tr className='table-row'>
            <td>{product.id}</td>
            <td>
                <img
                    src={`${REACT_APP_API_URL}/${product.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </td>
            <td>{product.title}</td>
            <td>{order.quantity}</td>
            <td>{`${product.price} AMD`}</td>
        </tr>
    );
}

OrderProductRow.propTypes = {
    order: PropTypes.object.isRequired,
}

export default OrderProductRow;
