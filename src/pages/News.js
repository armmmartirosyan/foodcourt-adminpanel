import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allNewsListRequest} from "../store/actions/news";
import TopBar from "../components/TopBar";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "query-string";
import PageNumbers from "../components/PageNumbers";
import EmptyPage from "../components/EmptyPage";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:'imagePath',
        label:'Image',
    },
    {
        path:'title',
        label:'Title',
    },
    {
        path:'description',
        label:'Description',
    },
];

function News() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const newsList = useSelector(state => state.news.news);
    const totalPages = useSelector(state => state.news.pages);
    const statusGetAll = useSelector(state => state.status.newsGetAllStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [myTimeout, setMyTimeout] = useState();
    const [title, setTitle] = useState(qs.parse(location.search).title || '');

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const title = qs.parse(location.search).title;
        setCurrentPage(+page || 1);

        (async () => {
            const data = await dispatch(allNewsListRequest({page, title}));

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/news?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        setTitle(val);
        page = +page || 1;
        const query = qs.stringify({page, title: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/news${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='news'
        >
            <TopBar
                searchChange={searchChange}
                search={title}
                pageName='news'
                allowAdd={true}
            />
            {
                !_.isEmpty(newsList) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={newsList}
                        path='news'
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

export default News;
