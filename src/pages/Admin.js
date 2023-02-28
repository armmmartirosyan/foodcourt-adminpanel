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
        label: 'First Name',
    },
    {
        path: ['lastName'],
        label: 'Last Name',
    },
    {
        path: ['email'],
        label: 'Email',
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
            pageName='admin'
        >
            <div className='d-flex justify-content-between'>
                <TopBar
                    pageName='admin'
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
