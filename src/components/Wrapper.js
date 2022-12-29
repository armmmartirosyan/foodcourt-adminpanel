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

function Wrapper(props) {
    const {children, pageName, statuses, uploadProcess} = props;
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
            <Helmet>
                <title>{_.capitalize(pageName)}</title>
            </Helmet>
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
    pageName: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    statuses: PropTypes.object,
    uploadProcess: PropTypes.number,
}
export default Wrapper;
