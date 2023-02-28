import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import EmptyPage from "../components/EmptyPage";
import Wrapper from "../components/Wrapper";
import {getAllPaymentTypesRequest} from "../store/actions/paymentTypes";

const tableHeader = [
    {
        path:['type'],
        label:'Payment type',
    },
    {
        path:['typeName'],
        label:'Payment type name',
    },
];

function PaymentTypes() {
    const dispatch = useDispatch();
    const paymentTypes = useSelector(state => state.paymentTypes.paymentTypes);
    const statusGetAll = useSelector(state => state.status.paymentTypesGetAllStatus);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAllPaymentTypesRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, []);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='payment types'
        >
            <TopBar
                pageName='payment types'
                allowAdd={true}
            />
            {
                !_.isEmpty(paymentTypes) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={paymentTypes}
                        path='payment-types'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default PaymentTypes;
