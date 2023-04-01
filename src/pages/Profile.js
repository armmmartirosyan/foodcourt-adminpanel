import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import Wrapper from "../components/Wrapper";
import {
    changePassRequest,
    getKeyRequest,
    modifyCurrentAccountRequest
} from "../store/actions/admin";
import Validator from "../helpers/Validator";
import Helper from "../helpers/Helper";
import ProfileTable from "../components/ProfileTable";
import UpdateValues from "../components/UpdateValues";
import ChangePassword from "../components/ChangePassword";
import Account from "../helpers/Account";
import {useNavigate} from "react-router-dom";
import {errorConfig} from "../helpers/ErrorConfig";

const data = [
    {
        path: 'firstName',
        label: 'Имя',
        edit: true,
    },
    {
        path: 'lastName',
        label: 'Фамилия',
        edit: true,
    },
    {
        path: 'phoneNum',
        label: 'Номер телефона',
        edit: true,
    },
    {
        path: 'email',
        label: 'Пароль',
        edit: true,
    },
    {
        path: 'email',
        label: 'Электронная почта',
        edit: true,
    },
    {
        path: 'role',
        label: 'Роль',
        edit: false,
    },
    {
        path: 'branchId',
        label: 'Ветвь',
        edit: false,
    },
];

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);
    const getAdminStatus = useSelector(state => state.status.adminAdminStatus);
    const getKeyStatus = useSelector(state => state.status.adminGetKeyStatus);
    const changePassStatus = useSelector(state => state.status.adminChangePassStatus);
    const statusModify = useSelector(state => state.status.adminModifyCurrentStatus);
    const [state, setState] = useState('');
    const [newValues, setNewValues] = useState({
        token: '',
        password: '',
        confirmPassword: ''
    });
    const [value, setValue] = useState({
        key: '',
        name: '',
        value: '',
    });

    const updateValues = useCallback((key, val, name) => {
        if (key && val && name) {
            setValue({
                key,
                name,
                value: val,
            });
        } else {
            setValue({
                key: '',
                name: '',
                value: '',
            });
        }

    }, []);

    const handleChangeNewValues = useCallback((val, key) => {
        setNewValues({
            ...newValues,
            [key]: val,
        });
    }, [newValues]);

    const handleModifyAccount = useCallback(async () => {
        let validateValues = [];

        if (value.key === 'firstName') {
            validateValues = [Validator.validString(value.value, errorConfig.firstName)];
        }else if (value.key === 'lastName') {
            validateValues = [Validator.validString(value.value, errorConfig.lastName)];
        } else if (value.key === 'phoneNum') {
            validateValues = [Validator.validPhoneNum(value.value, errorConfig.phoneNum)];
        } else if (value.key === 'email') {
            validateValues = [Validator.validEmail(value.value, errorConfig.email)];
        }

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(invalidVal);
            return;
        }

        const data = await dispatch(modifyCurrentAccountRequest({
            [value.key]: value.value
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        if (value.name === 'Email') {
            Account.deleteToken();
            navigate('/');
            return;
        }

        updateValues();
        toast.success('Аккаунт изменен');
    }, [value]);

    const handleGetKey = useCallback(async () => {
        const validateEmail = Validator.validEmail(value.value);

        if (validateEmail !== true) {
            toast.error(`Неверный адрес электронной почты`);
            return;
        }

        const data = await dispatch(getKeyRequest({email: value.value}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        updateValues();
        setState('changePass');
        toast.success('Ключ отправлен');
    }, [value, newValues]);

    const handleChangePass = useCallback(async () => {
        const validateValues = [
            Validator.validEverySymbol(newValues.token, errorConfig.token),
            Validator.validEverySymbol(newValues.password, errorConfig.password),
            Validator.validEverySymbol(newValues.confirmPassword, errorConfig.confirmPassword),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(invalidVal);
            return;
        }

        if (newValues.confirmPassword !== newValues.password) {
            toast.error("Неверный пароль для подтверждения");
            return
        }

        const data = await dispatch(changePassRequest({
            email: admin.email,
            password: newValues.password,
            token: newValues.token,
            confirmPassword: newValues.confirmPassword,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        setState('');
        setNewValues({
            token: '',
            password: '',
            confirmPassword: ''
        });
        toast.success('Пароль изменен');
    }, [newValues]);

    return (
        <Wrapper
            pageName={`Профиль ${!_.isEmpty(admin) ? `${admin.firstName}` : ''}`}
            statuses={{statusModify, getAdminStatus, getKeyStatus, changePassStatus}}
        >
            <div className="d-flex justify-content-between header">
                <h6>{`Профиль ${!_.isEmpty(admin) ? admin.firstName : ''}`}</h6>
            </div>
            {
                !_.isEmpty(admin) && !value.key && !state ? (
                    <ProfileTable
                        updateValues={updateValues}
                        admin={admin}
                        data={data}
                    />
                ) : null
            }
            {
                !_.isEmpty(admin) && value.key ? (
                    <UpdateValues
                        value={value}
                        setValue={setValue}
                        backFunc={updateValues}
                        forwardFunc={value.name === 'Пароль' ? handleGetKey : handleModifyAccount}
                    />
                ) : null
            }
            {
                !_.isEmpty(admin) && state === 'changePass' ? (
                    <div className="profile__table">
                        <ChangePassword
                            handleChange={handleChangeNewValues}
                            values={newValues}
                            forwardFunc={handleChangePass}
                            backFunc={() => {
                                setState('')
                            }}
                        />
                    </div>
                ) : null
            }
        </Wrapper>
    );
}

export default Profile;
