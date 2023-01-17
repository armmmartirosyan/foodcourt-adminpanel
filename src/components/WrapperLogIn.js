import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";

function WrapperLogIn(props) {
    const {children, statuses, pageName} = props;
    const [status, setStatus] = useState('');

    useEffect(() => {
        setStatus(Object.values(statuses || {}));
    }, [statuses]);

    return (
        <div className="container-fluid">
            <Helmet>
                <title>{_.capitalize(pageName)}</title>
            </Helmet>
            <div
                className="row h-100 align-items-center justify-content-center"
                style={{minHeight: '100vh'}}
            >
                <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3>{_.capitalize(pageName)}</h3>
                        </div>
                        {children}
                    </div>
                </div>
                {
                    status.includes('pending') ? (
                        <div className='spinner-container'>
                            <Spinner animation="border" variant="primary"/>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default WrapperLogIn;
