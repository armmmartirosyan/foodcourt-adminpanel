import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {allUsersListRequest} from "../store/actions/users";
import Wrapper from "../components/Wrapper";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import PageNumbers from "../components/PageNumbers";
import {toast} from "react-toastify";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:['firstName'],
        label:'Имя',
    },
    {
        path:['lastName'],
        label:'Фамилия',
    },
    {
        path:['email'],
        label:'Электронная почта',
    },
];

function Users() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector(state => state.users.users);
    const statusGetAll = useSelector(state => state.status.usersGetAllStatus);
    const totalPages = useSelector(state => state.users.pages);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState(qs.parse(location.search).name || '');
    const [myTimeout, setMyTimeout] = useState();

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const name = qs.parse(location.search).name;
        setCurrentPage(+page || 1);

        (async () => {
            const data = await dispatch(allUsersListRequest({page, name}));

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/users?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        setName(val);
        page = +page || 1;
        const query = qs.stringify({page, name: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/users${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='пользователи'
        >
            <TopBar
                pageName='пользователи'
                search={name}
                searchChange={searchChange}
            />
            {
                !_.isEmpty(users) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={users}
                        path='users'
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

export default Users;
