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
        label:'Изображение',
    },
    {
        path:['product', 'title'],
        label:'Название',
    },
    {
        path:['quantity'],
        label:'Количество',
    },
    {
        path:['product', 'price'],
        label:'Цена',
    },
];

const drawData = [
    {
        path: ['message'],
        label: 'Сообщение',
        disabled: true,
    },
    {
        path: ['address'],
        label: 'Адрес',
        disabled: true,
    },
    {
        path: ['user', 'firstName'],
        label: 'Имя пользователя',
        disabled: true,
    },
    {
        path: ['user', 'phoneNum'],
        label: 'Номер телефона пользователя',
        disabled: true,
    },
    {
        path: ['paymentType', 'typeName'],
        label: 'Тип получения',
        disabled: true,
    },
    {
        path: ['status'],
        label: 'Положение дел',
        disabled: true,
    },
    {
        path: ['createdAt'],
        label: 'Заказал в',
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

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
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

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/orders');
    }, []);

    return (
        <Wrapper
            pageName={`Заказ${params.id ? ` - ${params.id}` : ''}`}
            statuses={{statusSingleOrder}}
        >
            <h6 className="title">Заказанные продукты</h6>
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
                                id='Total Price(RUB)'
                                placeholder='Итоговая цена(AMD)'
                                disabled={true}
                                value={totalPrice}
                            />
                            <label htmlFor='Total Price(RUB)'>Итоговая цена(RUB)</label>
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
                    Назад
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
