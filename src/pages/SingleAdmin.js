import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteAdminAccountRequest,
    getSingleAdminRequest,
    modifyAdminAccountRequest,
    registerAdminRequest
} from "../store/actions/admin";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import moment from "moment/moment";
import Wrapper from "../components/Wrapper";
import ru from 'react-phone-number-input/locale/ru'
import {useNavigate, useParams} from "react-router-dom";
import {allBranchesListRequest} from "../store/actions/map";
import TopBar from "../components/TopBar";

function SingleAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const statusBranchesList = useSelector(state => state.status.branchesGetAllStatus);
    const statusRegister = useSelector(state => state.status.adminRegisterStatus);
    const statusModify = useSelector(state => state.status.adminModifyStatus);
    const statusDelete = useSelector(state => state.status.adminDeleteStatus);
    const [admin, setAdmin] = useState({});
    const [branchesList, setBranchesList] = useState([]);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNum: '',
        status: '',
        role: 'manager',
        branchId: 0,
    });

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(getSingleAdminRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                const tempAdmin = data?.payload?.admin;

                setAdmin({...tempAdmin});
                setValues({
                    firstName: tempAdmin.firstName,
                    lastName: tempAdmin.lastName,
                    email: tempAdmin.email,
                    password: tempAdmin.password,
                    confirmPassword: tempAdmin.confirmPassword,
                    phoneNum: "+" + tempAdmin.phoneNum,
                    status: tempAdmin.status,
                    role: tempAdmin.role,
                    branchId: tempAdmin.branchId,
                });
            })()
        }
    }, [params.id]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(allBranchesListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

            setBranchesList([
                {value: 0, label: 'All branches'},
                ...data.payload.branches.map(branch => {
                    return {
                        value: branch.id,
                        label: branch.title
                    }
                })
            ]);
        })()
    }, []);

    const handleRegisterAdmin = useCallback(async () => {
        const validateValues = [
            Validator.validEmail(values.email),
            Validator.validPhoneNum(values.phoneNum.slice(1)),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (values.confirmPassword !== values.password) {
            toast.error("Invalid confirm password");
            return;
        }

        const data = await dispatch(registerAdminRequest({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNum: values.phoneNum.slice(1),
            role: values.role,
            password: values.password,
            confirmPassword: values.confirmPassword,
            branchId: values.branchId || null
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Admin registered successfully');
        navigate('/admin');
    }, [values]);

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        })
    }, [values]);

    const handleModifyAdminAccount = useCallback(async () => {
        const validateValues = [
            values.email ? Validator.validEmail(values.email) : true,
            values.phoneNum ? Validator.validPhoneNum(values.phoneNum.slice(1)) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.firstName && !values.lastName
            && !values.email && !values.phoneNum
            && !values.role) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(modifyAdminAccountRequest({
            id: admin.id,
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            phoneNum: values.phoneNum.slice(1) || undefined,
            role: values.role || undefined,
            branchId: values.branchId || null,
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Admin modified successfully');
        navigate('/admin');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteAdminAccountRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Admin deleted successfully');
        navigate('/admin');
    }, [admin]);

    return (
        <Wrapper
            statuses={{statusDelete, statusModify, statusRegister, statusBranchesList}}
            pageName={`admin ${admin.firstName ? admin.firstName : ''}`}
        >
            <TopBar
                pageName={`admin ${admin.firstName ? admin.firstName : ''}`}
                allowAdd={false}
            />
            {
                statusBranchesList === 'success' ? (
                    <>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                placeholder="First Name"
                                value={values.firstName}
                                disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                                onChange={(e) => {
                                    handleChangeValues(e.target.value, 'firstName')
                                }}
                            />
                            <label htmlFor="firstName">First Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                placeholder="Last Name"
                                value={values.lastName}
                                disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                                onChange={(e) => {
                                    handleChangeValues(e.target.value, 'lastName')
                                }}
                            />
                            <label htmlFor="lastName">Last Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                value={values.email}
                                disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                                onChange={(e) => {
                                    handleChangeValues(e.target.value, 'email')
                                }}
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        {
                            _.isEmpty(admin) ? (
                                <>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                            value={values.password}
                                            disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                                            onChange={(e) => {
                                                handleChangeValues(e.target.value, 'password')
                                            }}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={values.confirmPassword}
                                            disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                                            onChange={(e) => {
                                                handleChangeValues(e.target.value, 'confirmPassword')
                                            }}
                                        />
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                    </div>
                                </>
                            ) : null
                        }
                        <div className='mb-3'>
                            <label htmlFor="admin-phone">Phone</label>
                            <PhoneInput
                                international
                                defaultCountry="RU"
                                labels={ru}
                                id='admin-phone'
                                disabled={!_.isEmpty(admin) && admin.status !== 'pending'}
                                value={values.phoneNum}
                                onChange={(num) => {
                                    handleChangeValues(num, 'phoneNum')
                                }}
                            />
                        </div>
                        <div className="form-floating mb-3">
                            <select
                                className="form-select"
                                id="role"
                                aria-label="Floating label select example"
                                value={values.role}
                                disabled={!_.isEmpty(admin) && admin.status === 'deleted'}
                                onChange={(e) => {
                                    handleChangeValues(e.target.value, 'role')
                                }}
                            >
                                <option value="manager">Manager</option>
                                <option value="admin manager">Admin Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            <label htmlFor="role">Role</label>
                        </div>
                        {
                            !_.isEmpty(branchesList) ? (
                                <div className='mb-3'>
                                    <label htmlFor="branch-list">Select Branch</label>
                                    <Select
                                        defaultValue={
                                            branchesList.find(branch => branch.value === admin.branchId) || branchesList[0]
                                        }
                                        name="colors"
                                        options={branchesList}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        id='branch-list'
                                        isDisabled={!_.isEmpty(admin) && admin.status === 'deleted'}
                                        onChange={(e) => {
                                            handleChangeValues(e.value, 'branchId')
                                        }}
                                    />
                                </div>
                            ) : null
                        }
                        {
                            !_.isEmpty(admin) ? (
                                <>
                                    <div className="form-floating mb-3">
                                        <p className='form-control'>
                                            {values.status}
                                        </p>
                                        <label>Status</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <p className='form-control'>
                                            {moment(admin.createdAt).format('LLL')}
                                        </p>
                                        <label>Created At</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <p className='form-control'>
                                            {moment(admin.updatedAt).format('LLL')}
                                        </p>
                                        <label>Last Update</label>
                                    </div>
                                </>
                            ) : null
                        }

                        <div className='btn-container'>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                Back
                            </button>
                            {
                                admin && admin.status !== 'deleted' ? (
                                    <button
                                        className="btn btn-danger"
                                        onClick={async (e) => {
                                            await handleDelete(e, admin.id)
                                        }}
                                    >
                                        Delete
                                    </button>
                                ) : null
                            }
                            {
                                admin && admin.status !== 'deleted' ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={
                                            !_.isEmpty(admin) ? handleModifyAdminAccount : handleRegisterAdmin
                                        }
                                    >
                                        {
                                            !_.isEmpty(admin) ? 'Modify' : 'Register'
                                        }
                                    </button>
                                ) : null
                            }
                        </div>
                    </>
                ) : null
            }
        </Wrapper>
    );
}

export default SingleAdmin;
