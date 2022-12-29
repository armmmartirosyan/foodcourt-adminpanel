import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {
    deleteAdminAccountRequest,
    getAdminsListRequest,
    modifyAdminAccountRequest,
    registerAdminRequest
} from "../store/actions/admin";
import Wrapper from "../components/Wrapper";
import Modal from "react-modal";
import moment from "moment";
import AdminRow from "../components/AdminRow";
import Validator from "../helpers/Validator";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";

function Admin() {
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const adminsList = useSelector(state => state.admin.adminsList);
    const statusAdminsList = useSelector(state => state.status.adminsListStatus);
    const statusRegister = useSelector(state => state.status.adminRegisterStatus);
    const statusModify = useSelector(state => state.status.adminModifyStatus);
    const statusDelete = useSelector(state => state.status.adminDeleteStatus);
    const [admin, setAdmin] = useState({});
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNum: '',
        status: '',
        possibility: 'junior',
    });

    useEffect(() => {
        (async () => {
            await dispatch(getAdminsListRequest());
        })()
    }, []);

    const openCloseModal = useCallback((isDelete, adminObj) => {
        if (!_.isEmpty(adminObj)) {
            setAdmin(adminObj);
            setValues({
                firstName: adminObj.firstName,
                lastName: adminObj.lastName,
                email: adminObj.email,
                phoneNum: adminObj.phoneNum,
                possibility: adminObj.possibility,
                status: adminObj.status,
            });
        } else if (editModalIsOpen || deleteModalIsOpen) {
            setAdmin({});
            setValues({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNum: '',
                status: '',
                possibility: 'junior',
            });
        }

        isDelete ?
            setDeleteModalIsOpen(!deleteModalIsOpen)
            : setEditModalIsOpen(!editModalIsOpen);
    }, [editModalIsOpen, deleteModalIsOpen]);

    const handleRegisterAdmin = useCallback(async () => {
        const validateValues = [
            Validator.validFName(values.firstName),
            Validator.validLName(values.lastName),
            Validator.validEmail(values.email),
            Validator.validPass(values.password),
            Validator.validPass(values.confirmPassword),
            Validator.validPhoneNum(values.phoneNum),
            Validator.validPossibility(values.possibility),
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
            phoneNum: values.phoneNum,
            possibility: values.possibility,
            password: values.password,
            confirmPassword: values.confirmPassword,
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(getAdminsListRequest());
            openCloseModal();
            toast.success('Admin registered successfully');
        }
    }, [values]);

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        })
    }, [values]);

    const handleModifyAdminAccount = useCallback(async () => {
        const validateValues = [
            values.firstName ? Validator.validFName(values.firstName) : true,
            values.lastName ? Validator.validLName(values.lastName) : true,
            values.email ? Validator.validEmail(values.email) : true,
            values.phoneNum ? Validator.validPhoneNum(values.phoneNum) : true,
            values.possibility ? Validator.validPossibility(values.possibility) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.firstName && !values.lastName
            && !values.email && !values.phoneNum
            && !values.possibility) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(modifyAdminAccountRequest({
            id: admin.id,
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            phoneNum: values.phoneNum || undefined,
            possibility: values.possibility || undefined,
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(getAdminsListRequest());
            openCloseModal();
            toast.success('Admin modified successfully');
        }
    }, [values]);

    const handleDelete = useCallback(async (e) => {
        e.stopPropagation();
        const data = await dispatch(deleteAdminAccountRequest({id: admin.id}));

        if (data.error) {
            toast.error('Error deleting admin!');
            return;
        }

        await dispatch(getAdminsListRequest());
        openCloseModal(true);
        toast.success('Admin deleted successfully');
    }, [admin]);

    return (
        <Wrapper
            statuses={{statusDelete, statusModify, statusRegister, statusAdminsList}}
            pageName='admin'
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <div className='d-flex justify-content-between'>
                        <TopBar
                            pageName='admin'
                            openCloseModal={openCloseModal}
                        />
                    </div>
                    {
                        !_.isEmpty(adminsList) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        adminsList.map(admin => (
                                            <AdminRow
                                                admin={admin}
                                                key={admin.id}
                                                openCloseModal={openCloseModal}
                                            />
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        ) : <EmptyPage/>
                    }
                </div>
            </div>

            <Modal
                isOpen={editModalIsOpen}
                className="modal"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal()
                }}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {
                            openCloseModal()
                        }}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        {`Admin ${!_.isEmpty(admin) ? `${admin.firstName} ${admin.lastName}` : 'Register'}`}
                    </h6>
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
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            id="phoneNum"
                            placeholder="Phone Number"
                            value={values.phoneNum}
                            disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'phoneNum')
                            }}
                        />
                        <label htmlFor="phoneNum">Phone Number</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select
                            className="form-select"
                            id="possibility"
                            aria-label="Floating label select example"
                            value={values.possibility}
                            disabled={admin && admin.status === 'deleted'}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'possibility')
                            }}
                        >
                            <option value="junior">Junior</option>
                            <option value="middle">Middle</option>
                            <option value="senior">Senior</option>
                        </select>
                        <label htmlFor="possibility">Possibility</label>
                    </div>
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

                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal()
                            }}
                        >
                            Cancel
                        </button>
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
                </div>
            </Modal>

            <Modal
                isOpen={deleteModalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal(true)
                }}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {
                            openCloseModal(true)
                        }}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        {`Do you really want to delete admin ${admin.firstName} ${admin.lastName}?`}
                    </h6>
                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal(true)
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={
                                handleDelete
                            }
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Admin;
