import React, {useEffect, useState} from 'react';
import Account from "../helpers/Account";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import _ from 'lodash';
import {getAdminRequest} from "../store/actions/admin";
import Sidebar from "./Sidebar";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";
import {socketDisconnect, socketInit} from "../store/actions/socket";

function Wrapper(props) {
    const {children, pageName, statuses, uploadProcess} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const admin = useSelector(state => state.admin.admin);
    const token = useSelector((store) => store.admin.token);

    useEffect(() => {
        const accountToken = token || Account.getToken();
        if (accountToken) {
            dispatch(socketInit(accountToken));
        } else {
            dispatch(socketDisconnect());
        }
    }, [token]);

    useEffect(() => {
        setStatus(Object.values(statuses || {}));
    }, [statuses]);

    useEffect(() => {
        if (!Account.getToken()) navigate('/');
    }, []);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAdminRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                Account.deleteToken();
                window.location.href = "/";
            }
        })()
    }, []);

    return (
        <div className='content'>
            <Helmet>
                <title>{_.startCase(pageName)}</title>
            </Helmet>
            <Sidebar pageName={pageName}/>
            <div className="bg-light rounded h-100 p-4">
                {children}
            </div>
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
    pageName: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    statuses: PropTypes.object,
    uploadProcess: PropTypes.number,
}
export default Wrapper;
