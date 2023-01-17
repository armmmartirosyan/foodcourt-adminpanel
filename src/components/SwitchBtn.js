import React from 'react';

function SwitchBtn(props) {
    const {order, modifyOrder} = props;
    return (
        <>
            {
                order.status === 'pending' ? (
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            await modifyOrder('inProcess', order.id)
                        }}
                    >
                        In Process
                    </button>
                ) : null
            }
            {
                order.status === 'inProcess' ? (
                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            await modifyOrder('ready', order.id)
                        }}
                    >
                        Ready
                    </button>
                ) : null
            }
            {
                order.status === 'ready'
                && (order.receiveType === 'cashOnDelivery'
                    || order.receiveType === 'cardOnDelivery') ? (
                    <button
                        className="btn btn-warning"
                        onClick={async () => {
                            await modifyOrder('onTheWay', order.id)
                        }}
                    >
                        On The Way
                    </button>
                ) : null
            }
            {
                order.status === 'ready'
                || order.status === 'onTheWay' ? (
                    <button
                        className="btn btn-secondary"
                        onClick={async () => {
                            await modifyOrder('received', order.id)
                        }}
                    >
                        Received
                    </button>
                ) : null
            }
        </>
    );
}

export default SwitchBtn;
