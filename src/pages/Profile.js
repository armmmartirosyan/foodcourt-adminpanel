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

const data = [
    {
        path: 'firstName',
        label: 'First Name',
        edit: true,
    },
    {
        path: 'lastName',
        label: 'Last Name',
        edit: true,
    },
    {
        path: 'phoneNum',
        label: 'Phone Number',
        edit: true,
    },
    {
        path: 'email',
        label: 'Password',
        edit: true,
    },
    {
        path: 'email',
        label: 'Email',
        edit: true,
    },
    {
        path: 'role',
        label: 'Role',
        edit: false,
    },
    {
        path: 'branchId',
        label: 'Branch',
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

        if (value.key === 'firstName' || value.key === 'lastName') {
            validateValues = [Validator.validString(value.value)];
        } else if (value.key === 'phoneNum') {
            validateValues = [Validator.validPhoneNum(value.value)];
        } else if (value.key === 'email') {
            validateValues = [Validator.validEmail(value.value)];
        }

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
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
        toast.success('Account modified successfully.');
    }, [value]);

    const handleGetKey = useCallback(async () => {
        const validateEmail = Validator.validEmail(value.value);

        if (validateEmail !== true) {
            toast.error(`Invalid email`);
            return;
        }

        const data = await dispatch(getKeyRequest({email: value.value}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        updateValues();
        setState('changePass');
        toast.success('Key sent successfully.');
    }, [value, newValues]);

    const handleChangePass = useCallback(async () => {
        const validateValues = [
            Validator.validEverySymbol(newValues.token),
            Validator.validEverySymbol(newValues.password),
            Validator.validEverySymbol(newValues.confirmPassword),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (newValues.confirmPassword !== newValues.password) {
            toast.error("Confirm password is wrong!");
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
        toast.success('Password changed successfully.');
    }, [newValues]);

    return (
        <Wrapper
            pageName={`profile ${!_.isEmpty(admin) ? `${admin.firstName}` : ''}`}
            statuses={{statusModify, getAdminStatus, getKeyStatus, changePassStatus}}
        >
            <div className="d-flex justify-content-between header">
                <h6>{`Profile ${!_.isEmpty(admin) ? admin.firstName : ''}`}</h6>
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
                        forwardFunc={value.name === 'Password' ? handleGetKey : handleModifyAccount}
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
