import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import { productsListRequest } from "../store/actions/products";
import _ from 'lodash';
import {toast} from "react-toastify";
import qs from 'query-string';
import {useLocation, useNavigate} from "react-router-dom";
import TopBar from "../components/TopBar";
import PageNumbers from "../components/PageNumbers";
import EmptyPage from "../components/EmptyPage";
import {allCategoriesListRequest} from "../store/actions/categories";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:['imagePath'],
        label:'Изображение',
    },
    {
        path:['title'],
        label:'Название',
    },
    {
        path:['price'],
        label:'Цена',
    },
];

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const products = useSelector(state => state.products.products);
    const totalPages = useSelector(state => state.products.pages);
    const statusGetAll = useSelector(state => state.status.productsGetAllStatus);
    const statusGetCategories = useSelector(state => state.status.categoriesGetAllStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [myTimeout, setMyTimeout] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [title, setTitle] = useState(qs.parse(location.search).title || '');

    useEffect(() => {
        (async () => {
            const data = await dispatch(allCategoriesListRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const list = data.payload.categories.map(cat => {
                return {value: cat.id, label: cat.name}
            });

            setCategories(list);
        })()
    }, []);

    useEffect(() => {
        const page = qs.parse(location.search).page || 1;
        const newTitle = qs.parse(location.search).title;
        const category = qs.parse(location.search).category;

        (async () => {
            const data = await dispatch(productsListRequest({page, category, title: newTitle}));

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            setCurrentPage(+page || 1);
            setSelectedCategoryId(category ? +category : 0);
        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/products?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        let category = qs.parse(location.search).category;
        setTitle(val);
        page = +page || 1;
        const query = qs.stringify({page, category, title: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/products${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout, location.search]);

    const onChangeCategory = useCallback((obj) => {
        let query = qs.parse(location.search);
        query.category = !_.isEmpty(obj) ? obj.value : null;
        query.page = 1;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/products?${query}`);
    }, [location.search]);

    return (
        <Wrapper
            statuses={{statusGetAll, statusGetCategories}}
            pageName='продукты'
        >
            <TopBar
                search={title}
                searchChange={(val) => searchChange(val)}
                pageName='продукты'
                categories={categories}
                onChangeCategory={onChangeCategory}
                allowAdd={true}
                selectedCategoryId={selectedCategoryId}
            />

            {
                !_.isEmpty(products) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={products}
                        path='products'
                    />
                ) : <EmptyPage/>
            }
            {
                totalPages > 1 ? (
                    <PageNumbers
                        handleClickPage={handleClickPage}
                        totalPages={totalPages}
                        currentPage={currentPage}
                    />
                ) : null
            }
        </Wrapper>
    );
}

export default Products;
