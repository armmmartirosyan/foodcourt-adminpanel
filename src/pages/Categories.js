import React, {useCallback, useEffect, useState} from 'react';
import _ from "lodash";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import { allCategoriesListRequest } from "../store/actions/categories";
import {toast} from "react-toastify";
import TopBar from "../components/TopBar";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import EmptyPage from "../components/EmptyPage";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:['imagePath'],
        label:'Изображение',
    },
    {
        path:['name'],
        label:'Название',
    },
];

function Categories() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const categories = useSelector(state => state.categories.categories);
    const statusGetAll = useSelector(state => state.status.categoriesGetAllStatus);
    const [searchName, setSearchName] = useState(qs.parse(location.search).name || '');
    const [myTimeout, setMyTimeout] = useState();

    useEffect(() => {
        const newName = qs.parse(location.search).name;

        (async () => {
            const data = await dispatch(allCategoriesListRequest({name: newName}));

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, [location.search]);

    const searchChange = useCallback((val) => {
        const query = qs.stringify({name: val || null}, {skipNull: true});
        setSearchName(val);

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/categories${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='категория'
        >
            <TopBar
                search={searchName}
                searchChange={searchChange}
                pageName='категория'
                allowAdd={true}
            />
            {
                !_.isEmpty(categories) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={categories}
                        path='categories'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Categories;
