import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {notReceivedOrdersListRequest} from "../store/actions/orders";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import Table from "./Table";

const tableHeader = [
    {
        path:['id'],
        label:'ID',
    },
    {
        path:['user', 'phoneNum'],
        label:'User Phone Number',
    },
    {
        path:['createdAt'],
        label:'Date',
    },
];

function Orders() {
    const dispatch = useDispatch();
    const notReceivedOrders = useSelector(state => state.orders.notReceivedOrders);
    const admin = useSelector(state => state.admin.admin);

    useEffect(() => {
        if (!_.isEmpty(admin)) {
            (async () => {
                const data = await dispatch(notReceivedOrdersListRequest({branchId: admin.branchId}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }
            })()
        }
    }, [admin]);

    return (
        <>
            {
                !_.isEmpty(notReceivedOrders) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={notReceivedOrders}
                        path='order'
                    />
                ) : null
            }
        </>
    );
}

export default Orders;
