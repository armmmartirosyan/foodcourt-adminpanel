import React, {useCallback, useEffect, useState} from 'react';
import _ from "lodash";
import Select from "react-select";
import {Line} from "react-chartjs-2";
import {useDispatch, useSelector} from "react-redux";
import {allProductsRequest} from "../store/actions/products";
import {ordersStatisticsRequest} from "../store/actions/orders";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const labels = [
    'Янв', 'Фев', 'Мар', 'Апр',
    'Май', 'Июн', 'Июл', 'Авг',
    'Сен', 'Окт', 'Ноя', 'Дек'
];
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Продажа продуктов',
        },
    },
};
const years = [];
const currentYear = new Date().getFullYear();

for(let i = currentYear - 20; i <= currentYear; i++){
    years.push({value: i, label: i});
}

function ProductsChart() {
    const dispatch = useDispatch();
    const productOrders = useSelector(state => state.orders.productOrders);
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState({});
    const [tempYear, setTempYear] = useState({});

    useEffect(() => {
        (async () => {
            const data = await dispatch(allProductsRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const productData = data.payload.products;

            if(!_.isEmpty(productData)){
                setProducts(productData.map(product => {
                    return {
                        label: product.title,
                        value: product.id
                    }
                }));
            }
        })()
    }, []);

    const onChangeProduct = useCallback(async (prodData) => {
        setTempProduct({...prodData});

        const data = await dispatch(ordersStatisticsRequest({
            productId: prodData.value, year: tempYear.value || new Date().getFullYear()
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
        }
    }, [tempYear]);

    const onChangeYear = useCallback(async (prodData) => {
        setTempYear({...prodData});

        if(!_.isEmpty(tempProduct)){
            const data = await dispatch(ordersStatisticsRequest({
                productId: tempProduct.value, year: prodData.value
            }));

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        }
    }, [tempProduct]);

    const data = {
        labels,
        datasets: [
            {
                label: tempProduct.label || 'Названия продуктов',
                data: productOrders || [],
                borderColor: 'rgb(58,73,148)',
                backgroundColor: 'rgba(58,73,148, 0.5)',
            }
        ],
    };

    return (
        <div className="chart">
            <div className="chart__select">
                {
                    !_.isEmpty(products) ? (
                        <Select
                            name="products"
                            options={products}
                            className="multi-select"
                            classNamePrefix="chart"
                            onChange={onChangeProduct}
                            placeholder='Продукт'
                        />
                    ) : null
                }

                <Select
                    defaultValue={{value: currentYear, label: currentYear}}
                    name="years"
                    options={years}
                    className="multi-select"
                    classNamePrefix="chart"
                    onChange={onChangeYear}
                    placeholder='Год'
                />
            </div>
            <div className="chart__body">
                <Line options={options} data={data}/>
            </div>
        </div>
    );
}

export default ProductsChart;
