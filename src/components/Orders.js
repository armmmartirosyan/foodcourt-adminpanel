import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {notReceivedOrdersListRequest} from "../store/actions/orders";
import OrderRow from "./OrderRow";
import EmptyPage from "./EmptyPage";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";

function Orders() {
    const dispatch = useDispatch();
    const notReceivedOrders = useSelector(state => state.orders.notReceivedOrders);
    const admin = useSelector(state => state.admin.admin);

    useEffect(() => {
        if (!_.isEmpty(admin)) {
            (async () => {
                const data = await dispatch(notReceivedOrdersListRequest({branchId: admin.branchId}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }
            })()
        }
    }, [admin]);

    return (
        <div className="table-responsive">
            <h6 className='title'>Orders</h6>
            {
                !_.isEmpty(notReceivedOrders) ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">User Phone Number</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            notReceivedOrders.map(order => (
                                <OrderRow
                                    order={order}
                                    key={order.id}
                                />
                            ))
                        }
                        </tbody>
                    </table>
                ) : <EmptyPage/>
            }
        </div>
    );
}

export default Orders;
