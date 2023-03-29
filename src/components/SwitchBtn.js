import React from 'react';
import PropTypes from "prop-types";

function SwitchBtn(props) {
    const {order, modifyOrder} = props;
    return (
        <>
            {
                order.status === 'в ожидании' ? (
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            await modifyOrder('в процессе', order.id)
                        }}
                    >
                        В процессе
                    </button>
                ) : null
            }
            {
                order.status === 'в процессе' ? (
                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            await modifyOrder('готовый', order.id)
                        }}
                    >
                        Готовый
                    </button>
                ) : null
            }
            {
                order.status === 'готовый'
                && (order?.payloadType?.typeName?.includes('доставк')) ? (
                    <button
                        className="btn btn-warning"
                        onClick={async () => {
                            await modifyOrder('в пути', order.id)
                        }}
                    >
                        В пути
                    </button>
                ) : null
            }
            {
                order.status === 'готовый'
                || order.status === 'в пути' ? (
                    <button
                        className="btn btn-secondary"
                        onClick={async () => {
                            await modifyOrder('полученный', order.id)
                        }}
                    >
                        Полученный
                    </button>
                ) : null
            }
        </>
    );
}

SwitchBtn.propTypes = {
    order: PropTypes.object.isRequired,
    modifyOrder: PropTypes.func.isRequired,
}

export default SwitchBtn;
