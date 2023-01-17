import React, {useCallback, useEffect, useState} from 'react';
import WrapperLogIn from "../components/WrapperLogIn";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Validator from "../helpers/Validator";
import {toast} from "react-toastify";
import {changePassRequest, getKeyRequest} from "../store/actions/admin";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Account from "../helpers/Account";

function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getKeyStatus = useSelector(state => state.status.adminGetKeyStatus);
    const changePassStatus = useSelector(state => state.status.adminChangePassStatus);
    const [state, setState] = useState('getKey');
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        token: '',
    });

    const handleChange = useCallback((value, key) => {
        setValues({
            ...values,
            [key]: value
        })
    }, [values]);

    const handleGetKey = useCallback(async () => {
        const validateValues = [
            Validator.validEmail(values.email)
        ];

        if (validateValues.find((v) => v !== true)) {
            toast.error('Invalid email');
            return;
        }

        const data = await dispatch(getKeyRequest({email: values.email}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Key sent successfully');
        setState('changePass');
    }, [values]);

    const handleChangePass = useCallback(async () => {
        const validateValues = [
            Validator.validUUID(values.token),
        ];

        const invalidValue = validateValues.find((v) => v !== true);

        if (invalidValue) {
            toast.error(`Invalid ${invalidValue}`);
            return;
        }

        if (values.confirmPassword !== values.password) {
            toast.error("Confirm password is wrong!");
            return
        }

        const data = await dispatch(changePassRequest({
            email: values.email,
            password: values.password,
            token: values.token,
            confirmPassword: values.confirmPassword
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success("Password changed!");
        navigate('/');
    }, [values]);

    useEffect(() => {
        if (Account.getToken()) navigate('/home');
    }, []);

    return (
        <WrapperLogIn
            statuses={[getKeyStatus, changePassStatus]}
            pageName='forgot password?'
        >
            {
                state === 'getKey' ? (
                    <>
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
                        <button
                            type="submit"
                            className="btn btn-primary py-3 w-100 mb-4"
                            onClick={handleGetKey}
                        >
                            Get key
                        </button>
                    </>
                ) : null
            }
            {
                state === 'changePass' ? (
                    <>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id='token'
                                placeholder='Token'
                                value={values.token}
                                onChange={(e) => {
                                    handleChange(e.target.value, 'token')
                                }}
                            />
                            <label htmlFor='token'>Token</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id='password'
                                placeholder='Password'
                                value={values.password}
                                onChange={(e) => {
                                    handleChange(e.target.value, 'password')
                                }}
                            />
                            <label htmlFor='password'>Password</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id='confirmPassword'
                                placeholder='Confirm password'
                                value={values.confirmPassword}
                                onChange={(e) => {
                                    handleChange(e.target.value, 'confirmPassword')
                                }}
                            />
                            <label htmlFor='confirmPassword'>Confirm password</label>
                        </div>
                        <div className='btn-container'>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    setState('getKey')
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleChangePass}
                            >
                                Change Password
                            </button>
                        </div>
                    </>
                ) : null
            }
            <button
                className="btn btn-light py-1 w-100"
                onClick={() => {
                    navigate('/');
                }}
            >
                Login
            </button>
        </WrapperLogIn>
    );
}

export default ForgotPassword;
