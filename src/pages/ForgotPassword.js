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
import ChangePassword from "../components/ChangePassword";

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
            toast.error('Неверный адрес электронной почты');
            return;
        }

        const data = await dispatch(getKeyRequest({email: values.email}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Ключ успешно отправлен');
        setState('changePass');
    }, [values]);

    const handleChangePass = useCallback(async () => {
        const validateValues = [
            Validator.validEmail(values.email, 'Неверный адрес электронной почты'),
            Validator.validEverySymbol(values.token, 'Неправильный ключ'),
            Validator.validEverySymbol(values.password, 'Неверный пароль'),
            Validator.validEverySymbol(values.confirmPassword, 'Неверный пароль для подтверждения'),
        ];

        const invalidValue = validateValues.find((v) => v !== true);

        if (invalidValue) {
            toast.error(invalidValue);
            return;
        }

        if (values.confirmPassword !== values.password) {
            toast.error("Неверный пароль для подтверждения!");
            return
        }

        const data = await dispatch(changePassRequest({
            email: values.email,
            password: values.password,
            token: values.token,
            confirmPassword: values.confirmPassword
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success("Пароль успешно изменен");
        navigate('/');
    }, [values]);

    useEffect(() => {
        if (Account.getToken()) navigate('/orders');
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
                                placeholder="Электронная почта"
                                value={values.email}
                                onChange={(ev) => {
                                    handleChange(ev.target.value, 'email')
                                }}
                            />
                            <label htmlFor="floatingInput">Электронная почта</label>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary py-3 w-100 mb-4"
                            onClick={handleGetKey}
                        >
                            Получить ключ
                        </button>
                    </>
                ) : null
            }
            {
                state === 'changePass' ? (
                    <ChangePassword
                        values={values}
                        handleChange={handleChange}
                        forwardFunc={handleChangePass}
                        backFunc={() => {setState('getKey')}}
                    />
                ) : null
            }
            <button
                className="btn btn-light py-1 w-100"
                onClick={() => {
                    navigate('/');
                }}
            >
                Войти
            </button>
        </WrapperLogIn>
    );
}

export default ForgotPassword;
