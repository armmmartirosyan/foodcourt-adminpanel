import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import { getAdminsListRequest } from "../store/actions/admin";
import Wrapper from "../components/Wrapper";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path: ['firstName'],
        label: 'Имя',
    },
    {
        path: ['lastName'],
        label: 'Фамилия',
    },
    {
        path: ['email'],
        label: 'Электронная почта',
    },
];

function Admin() {
    const dispatch = useDispatch();
    const adminsList = useSelector(state => state.admin.adminsList);
    const statusAdminsList = useSelector(state => state.status.adminsListStatus);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAdminsListRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, []);

    return (
        <Wrapper
            statuses={{statusAdminsList}}
            pageName='админы'
        >
            <div className='d-flex justify-content-between'>
                <TopBar
                    pageName='админы'
                    allowAdd={true}
                />
            </div>
            {
                !_.isEmpty(adminsList) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={adminsList}
                        path='admin'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Admin;
