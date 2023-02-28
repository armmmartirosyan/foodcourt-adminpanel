import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginRequest} from "../store/actions/admin";
import Account from "../helpers/Account";
import {toast} from "react-toastify";
import Validator from "../helpers/Validator";
import _ from "lodash";
import Helper from "../helpers/Helper";
import WrapperLogIn from "../components/WrapperLogIn";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginStatus = useSelector(state => state.status.adminLoginStatus);
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const handleChange = useCallback((value, key) => {
        setValues({
            ...values,
            [key]: value
        })
    }, [values]);

    const handleSgnIn = useCallback(async () => {
        const validateValues = [
            Validator.validEmail(values.email),
            Validator.validEverySymbol(values.password),
        ];

        if (validateValues.find((v) => v !== true)) {
            toast.error('Invalid email or password');
            return;
        }

        const data = await dispatch(loginRequest({
            email: values.email,
            password: values.password,
            remember: values.remember,
        }));

        if(data.error?.message && data.payload === 'Too many requests, please try again later.'){
            toast.error('Too many requests, please try again later.');
            return;
        }else if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/home');
        window.location.reload();
    }, [values]);

    useEffect(() => {
        if (Account.getToken()) navigate('/home');
    }, []);

    return (
        <WrapperLogIn
            statuses={[loginStatus]}
            pageName='sign in'
        >
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Email"
                    value={values.email}
                    onChange={(ev) => {
                        handleChange(ev.target.value, 'email')
                    }}
                />
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-4">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={values.password}
                    onChange={(ev) => {
                        handleChange(ev.target.value, 'password')
                    }}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck"
                        checked={values.remember}
                        onChange={() => {
                            handleChange(!values.remember, 'remember')
                        }}
                    />
                    <label className="form-check-label" htmlFor="exampleCheck">Remember Me</label>
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-primary py-3 w-100 mb-4"
                onClick={handleSgnIn}
            >
                Sign In
            </button>
            <button
                className="btn btn-light py-1 w-100"
                onClick={() => {
                    navigate(`/forgot-password`)
                }}
            >
                Forgot Password ?
            </button>
        </WrapperLogIn>
    );
}

export default Login;
