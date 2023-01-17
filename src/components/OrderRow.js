import React from 'react';
import moment from "moment";
import classNames from "classnames";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

function OrderRow(props) {
    const {order} = props;
    const navigate = useNavigate();

    return (
        <tr
            className={classNames(
                'table-row',{
                    process: order.status === 'inProcess',
                    ready: order.status === 'ready',
                    onWay: order.status === 'onTheWay',
                })}
            onClick={() => {
                navigate(`/order/${order.id}`);
            }}
        >
            <td>{order.id}</td>
            <td>{order.user.phoneNum}</td>
            <td>{moment(order.createdAt).format('ddd, LT')}</td>
        </tr>
    );
}
OrderRow.propTypes = {
    order: PropTypes.object.isRequired,
}
export default OrderRow;
