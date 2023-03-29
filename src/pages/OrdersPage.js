import React from 'react';
import Wrapper from "../components/Wrapper";
import ProductsChart from "../components/ProductsChart";
import Orders from "../components/Orders";
import {useSelector} from "react-redux";

function OrdersPage() {
    const statusNotReadyOrders = useSelector(state => state.status.ordersNotReceivedListStatus);
    const statusModifyOrder = useSelector(state => state.status.ordersModifyStatus);
    const statusOrderStatistics = useSelector(state => state.status.ordersStatisticsStatus);

    return (
        <Wrapper
            pageName='заказы'
            statuses={{statusNotReadyOrders, statusModifyOrder, statusOrderStatistics}}
        >
            <ProductsChart/>
            <Orders/>
        </Wrapper>
    );
}

export default OrdersPage;
