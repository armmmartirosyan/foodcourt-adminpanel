import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {modifyOrderRequest, singleNotReceivedOrderRequest} from "../store/actions/orders";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import Helper from "../helpers/Helper";
import SwitchBtn from "../components/SwitchBtn";
import Table from "../components/Table";
import Single from "../components/Single";

const tableHeader = [
    {
        path:['product', 'id'],
        label:'ID',
    },
    {
        path:['product', 'imagePath'],
        label:'Image',
    },
    {
        path:['product', 'title'],
        label:'Title',
    },
    {
        path:['quantity'],
        label:'Quantity',
    },
    {
        path:['product', 'price'],
        label:'Price',
    },
];

const drawData = [
    {
        path: ['message'],
        label: 'Message',
        disabled: true,
    },
    {
        path: ['address'],
        label: 'Address',
        disabled: true,
    },
    {
        path: ['user', 'firstName'],
        label: 'User Name',
        disabled: true,
    },
    {
        path: ['user', 'phoneNum'],
        label: 'User Phone Number',
        disabled: true,
    },
    {
        path: ['receiveType'],
        label: 'Receive Type',
        disabled: true,
    },
    {
        path: ['status'],
        label: 'Status',
        disabled: true,
    },
    {
        path: ['createdAt'],
        label: 'Ordered at',
        disabled: true,
    },
];

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
                    return;
                }

                const tempOrder = data.payload.singleNotReceivedOrder;
                let price = 0;

                tempOrder.user = {
                    ...tempOrder.user,
                    phoneNum: "+" + tempOrder.user.phoneNum
                };

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
                    <>
                        <Table
                            tableHeader={tableHeader}
                            list={order.orders}
                            path=''
                        />

                        <div className="form-floating mb-3">
                            <input
                                type='text'
                                className="form-control"
                                id='Total Price(AMD)'
                                placeholder='Total Price(AMD)'
                                disabled={true}
                                value={totalPrice}
                            />
                            <label htmlFor='Total Price(AMD)'>Total Price(AMD)</label>
                        </div>

                        <Single
                            drawData={drawData}
                            obj={order}
                            changeValues={() => {}}
                            values={{}}
                        />
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
