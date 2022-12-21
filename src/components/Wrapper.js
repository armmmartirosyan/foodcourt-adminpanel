import React, {useEffect} from 'react';
import Header from "./Header";
import Account from "../helpers/Account";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import {getAdminRequest} from "../store/actions/admin";
import Sidebar from "./Sidebar";
import Spinner from "react-bootstrap/Spinner";

function Wrapper(props) {
    const {searchable, children, setSearch, statusGetAll, statusDelete, changePassStatus} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);

    useEffect(() => {
        if (!Account.getToken()) navigate('/');
    }, []);

    useEffect(() => {
        if (_.isEmpty(admin)) {
            (async () => {
                await dispatch(getAdminRequest());
            })()
        }
    }, [admin]);

    return (
        <div className='content'>
            {
                searchable ? (
                    <Header
                        searchable={searchable}
                        setSearch={setSearch}
                    />
                ) : null
            }
            <Sidebar/>
            {children}
            {
                changePassStatus === 'pending' || statusGetAll === 'pending' || statusDelete === 'pending' ? (
                    <div className='spinner-container'>
                        <Spinner animation="border" variant="primary"/>
                    </div>
                ) : null
            }
        </div>
    );
}

export default Wrapper;
