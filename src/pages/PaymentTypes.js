import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import Wrapper from "../components/Wrapper";
import {allowBuyRequest, getAllPaymentTypesRequest} from "../store/actions/paymentTypes";

const tableHeader = [
    {
        path: ['type'],
        label: 'Способ оплаты',
    },
    {
        path: ['typeName'],
        label: 'Название типа платежа',
    },
    {
        path: ['allowUse'],
        label: 'Разрешить использование',
    },
];

function PaymentTypes() {
    const dispatch = useDispatch();
    const paymentTypes = useSelector(state => state.paymentTypes.paymentTypes);
    const statusGetAll = useSelector(state => state.status.paymentTypesGetAllStatus);
    const statusAllow = useSelector(state => state.status.paymentAllowBuyStatus);
    const [allowPay, setAllowPay] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAllPaymentTypesRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const {paymentTypes} = data.payload;
            const allowBuy = paymentTypes.map(payment => payment.allowUse);

            setAllowPay(allowBuy.includes('t'));
        })()
    }, []);

    const handleChange = useCallback(async () => {
        const data = await dispatch(allowBuyRequest({allow: !allowPay}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        setAllowPay(!allowPay);
        toast.success(`Вы ${allowPay ? 'не' : ''} разрешили покупку`);
    }, [allowPay]);

    return (
        <Wrapper
            statuses={{statusGetAll, statusAllow}}
            pageName='способ оплаты'
        >
            <TopBar
                pageName='способ оплаты'
                allowAdd={true}
            />
            {
                !_.isEmpty(paymentTypes) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={paymentTypes}
                        path='payment-types'
                    />
                ) : null
            }
            <div className='payment'>
                <div className="form-check form-switch mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id='allow'
                        checked={allowPay}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor='allow'>
                        Разрешить покупку
                    </label>
                </div>
            </div>
        </Wrapper>
    );
}

export default PaymentTypes;
