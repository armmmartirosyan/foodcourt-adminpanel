import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import _ from "lodash";
import OrderProductRow from "../components/OrderProductRow";
import moment from "moment/moment";
import {useDispatch, useSelector} from "react-redux";
import {modifyOrderRequest, singleNotReceivedOrderRequest} from "../store/actions/orders";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import Helper from "../helpers/Helper";
import SwitchBtn from "../components/SwitchBtn";

function SingleOrder() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const statusSingleOrder = useSelector(state => state.status.ordersNotReceivedSingleStatus);

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(singleNotReceivedOrderRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                const tempOrder = data.payload.singleNotReceivedOrder;
                let price = 0;

                tempOrder.orders.forEach((tempOrder) => {
                    price += +tempOrder.quantity * +tempOrder.product.price
                });

                setTotalPrice(price);
                setOrder({...tempOrder});
            })()
        }
    }, [params.id]);

    const modifyOrder = useCallback(async (status, id) => {
        const data = await dispatch(modifyOrderRequest({status, id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/home');
    }, []);

    return (
        <Wrapper
            pageName={`order${params.id ? ` - ${params.id}` : ''}`}
            statuses={{statusSingleOrder}}
        >
            <h6 className="title">Order Products</h6>
            {
                !_.isEmpty(order) ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            order.orders.map(order => (
                                <OrderProductRow
                                    order={order}
                                    key={order.id}
                                />
                            ))
                        }
                        </tbody>
                    </table>
                ) : null
            }
            {
                !_.isEmpty(order) ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {totalPrice}
                            </p>
                            <label>Total Price(AMD)</label>
                        </div>
                        {
                            order.message ? (
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {order.message}
                                    </p>
                                    <label>Message</label>
                                </div>
                            ) : null
                        }
                        {
                            order.address ? (
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {order.address}
                                    </p>
                                    <label>Address</label>
                                </div>
                            ) : null
                        }
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {order.user.firstName}
                            </p>
                            <label>User Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {order.user.phoneNum}
                            </p>
                            <label>User Phone Number</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {_.capitalize(order.receiveType.split(/(?=[A-Z])/).join(' '))}
                            </p>
                            <label>Receive Type</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {_.capitalize(order.status.split(/(?=[A-Z])/).join(' '))}
                            </p>
                            <label>Status</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(order.createdAt).format('LLL')}
                            </p>
                            <label>Ordered At</label>
                        </div>
                    </>
                ) : null
            }

            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Back
                </button>
                <SwitchBtn
                    order={order}
                    modifyOrder={modifyOrder}
                />
            </div>
        </Wrapper>
    );
}

export default SingleOrder;
