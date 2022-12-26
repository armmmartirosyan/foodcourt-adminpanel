import React, {useEffect, useState} from 'react';
import Header from "./Header";
import Account from "../helpers/Account";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import {getAdminRequest} from "../store/actions/admin";
import Sidebar from "./Sidebar";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";

function Wrapper(props) {
    const {children, setSearch, search,
        statuses, uploadProcess, pageName = '',
    searchChang} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setStatus(Object.values(statuses || {}));
    }, [statuses]);

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
                setSearch ? (
                    <Header
                        setSearch={setSearch}
                        search={search}
                        onChange={(value)=>searchChang(value)}
                    />
                ) : null
            }
            <Sidebar pageName={pageName}/>
            {children}
            {
                status.includes('pending') ? (
                    <div className='spinner-container'>
                        <Spinner animation="border" variant="primary"/>
                        {
                            uploadProcess ? (
                                <p>{`${Math.floor(uploadProcess)}%`}</p>
                            ) : null
                        }
                    </div>
                ) : null
            }
        </div>
    );
}
Wrapper.propTypes = {
    search: PropTypes.string,
    pageName: PropTypes.string,
    uploadProcess: PropTypes.number,
    children: PropTypes.any.isRequired,
    statuses: PropTypes.object,
    setSearch: PropTypes.func,
    searchChang: PropTypes.func,
}
export default Wrapper;
