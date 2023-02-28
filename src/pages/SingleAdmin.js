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
import Wrapper from "../components/Wrapper";
import {useNavigate, useParams} from "react-router-dom";
import {allBranchesListRequest} from "../store/actions/map";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

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

    const drawData = [
        {
            path: ['firstName'],
            label: 'First name',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['lastName'],
            label: 'Last name',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['email'],
            label: 'Email',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['password'],
            label: 'Password',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['confirmPassword'],
            label: 'Confirm password',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['phoneNum'],
            label: 'Phone',
            disabled: !_.isEmpty(admin),
        },
        {
            path: ['role'],
            label: 'Role',
            disabled: !_.isEmpty(admin) && admin.status === 'deleted',
        },
        {
            path: ['branchId'],
            label: 'Select branch',
            compValue: {...admin},
            array: [...branchesList],
            disabled: !_.isEmpty(admin) && admin.status === 'deleted',
        },
        {
            path: ['status'],
            label: 'Status',
            disabled: true,
        },
    ];

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(getSingleAdminRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                const tempAdmin = data?.payload?.admin;

                setAdmin({...tempAdmin});
                setValues({
                    ...tempAdmin,
                    phoneNum: "+" + tempAdmin.phoneNum,
                });
            })()
        }
    }, [params.id]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(allBranchesListRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
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

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        })
    }, [values]);

    const handleRegisterAdmin = useCallback(async () => {
        const validateValues = [
            Validator.validString(values.firstName),
            Validator.validString(values.lastName),
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
            branchId: values.branchId.value || null
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Admin registered successfully');
        navigate('/admin');
    }, [values]);

    const handleModifyAdminAccount = useCallback(async () => {
        const validateValues = [
            values.firstName ? Validator.validString(values.firstName) : true,
            values.lastName ? Validator.validString(values.lastName) : true,
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
            && !values.role && _.isEmpty(values.branchId)) {
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
            branchId: values?.branchId?.value || null,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Admin modified successfully');
        navigate('/admin');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteAdminAccountRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
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
                        <Single
                            drawData={drawData}
                            obj={admin}
                            changeValues={handleChangeValues}
                            values={values}
                        />

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
