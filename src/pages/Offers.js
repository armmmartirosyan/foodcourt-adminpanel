import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allOffersListRequest} from "../store/actions/offers";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import EmptyPage from "../components/EmptyPage";
import Table from "../components/Table";
import Helper from "../helpers/Helper";
import {allCategoriesListRequest} from "../store/actions/categories";

const tableHeader = [
    {
        path: ['imagePath'],
        label: 'Image',
    },
    {
        path: ['title'],
        label: 'Title',
    },
    {
        path: ['price'],
        label: 'Price',
    },
];

function Offers() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const offers = useSelector(state => state.offers.offers);
    const statusGetAll = useSelector(state => state.status.offersGetAllStatus);
    const [title, setTitle] = useState(qs.parse(location.search).title || '');
    const [myTimeout, setMyTimeout] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);

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
        const title = qs.parse(location.search).title;
        const category = qs.parse(location.search).category;

        (async () => {
            const data = await dispatch(allOffersListRequest({title, category}));

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            setSelectedCategoryId(category ? +category : 0);
        })()
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let query = qs.parse(location.search);
        query.title = val || null;
        query = qs.stringify(query, {skipNull: true});
        setTitle(val);

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/offers${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    const onChangeCategory = useCallback((obj) => {
        let query = qs.parse(location.search);
        query.category = !_.isEmpty(obj) ? obj.value : null;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/offers?${query}`);
    }, [location.search]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='offers'
        >
            <TopBar
                searchChange={searchChange}
                search={title}
                pageName='offers'
                allowAdd={true}
                categories={categories}
                onChangeCategory={onChangeCategory}
                selectedCategoryId={selectedCategoryId}
            />
            {
                !_.isEmpty(offers) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={offers}
                        path='offers'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Offers;
