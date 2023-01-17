import React from 'react';
import Wrapper from "../components/Wrapper";
import ProductsChart from "../components/ProductsChart";
import Orders from "../components/Orders";
import {useSelector} from "react-redux";

function Home() {
    const statusNotReadyOrders = useSelector(state => state.status.ordersNotReceivedListStatus);
    const statusModifyOrder = useSelector(state => state.status.ordersModifyStatus);
    const statusOrderStatistics = useSelector(state => state.status.ordersStatisticsStatus);

    return (
        <Wrapper
            pageName='home'
            statuses={{statusNotReadyOrders, statusModifyOrder, statusOrderStatistics}}
        >
            <ProductsChart/>
            <Orders/>
        </Wrapper>
    );
}

export default Home;
