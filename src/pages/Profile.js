import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-modal";
import Wrapper from "../components/Wrapper";
import {
    changePassRequest,
    getAdminRequest,
    getKeyRequest,
    modifyAdminAccountRequest
} from "../store/actions/admin";

function Profile() {
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin.admin);
    const getAdminStatus = useSelector(state => state.status.adminAdminStatus);
    const getKeyStatus = useSelector(state => state.status.adminGetKeyStatus);
    const changePassStatus = useSelector(state => state.status.adminChangePassStatus);
    const statusModify = useSelector(state => state.status.adminModifyStatus);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
    const [newValues, setNewValues] = useState({
        token: '',
        password: '',
        passwordRepeat: ''
    });
    const [value, setValue] = useState({
        key: '',
        name: '',
        value: '',
    });

    const openCloseModal = useCallback((key, val, name) => {
        if (modalIsOpen) {
            setValue({
                key: '',
                name: '',
                value: '',
            });

            setNewValues({
                ...newValues,
                password: '',
                token: '',
                passwordRepeat: '',
            });
        } else if (key && val && name) {
            setValue({
                key,
                name,
                value: val,
            });
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen, newValues]);

    const openClosePassModal = useCallback(() => {
        setNewValues({
            ...newValues,
            password: '',
            token: '',
            passwordRepeat: '',
        });
        setPasswordModalIsOpen(!passwordModalIsOpen);
    }, [passwordModalIsOpen, newValues]);

    const handleChangeValue = useCallback((val) => {
        setValue({
            ...value,
            value: val,
        });
    }, [value]);

    const handleChangeNewValues = useCallback((key, val) => {
        setNewValues({
            ...newValues,
            [key]: val,
        });
    }, [newValues]);

    const handleModifyAccount = useCallback(async () => {
        if (value.value.length < 2) {
            toast.error("Value can't contain less than 2 symbols!");
            return;
        }

        const data = await dispatch(modifyAdminAccountRequest({
            id: admin.id,
            [value.key]: value.value
        }));

        if (data.error) {
            console.log(data.error);
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(getAdminRequest());

            openCloseModal();
        }
    }, [value]);

    const handleGetKey = useCallback(async () => {
        const data = await dispatch(getKeyRequest({email: value.value}));

        if (data.error) {
            toast.error("Something wrong with email!");
            return;
        }

        openCloseModal();
        openClosePassModal();
    }, [value, newValues]);

    const handleChangePass = useCallback(async () => {
        if(newValues.passwordRepeat !== newValues.password){
            toast.error("Repeated password is wrong!");
            return
        }

        const data = await dispatch(changePassRequest({
            email: admin.email,
            password: newValues.password,
            token: newValues.token
        }));

        if (data.error) {
            toast.error("Something goes wrong!");
            return;
        }

        openClosePassModal();
    }, [newValues]);

    return (
        <Wrapper
            statusGetAll={getAdminStatus}
            statusDelete={getKeyStatus}
            changePassStatus={changePassStatus}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4 d-flex justify-content-between">
                    <h6 className="mb-4">{`Profile ${!_.isEmpty(admin) ? admin.firstName : ''}`}</h6>
                </div>
                {
                    !_.isEmpty(admin) ? (
                        <div className="profile__table">
                            <table className="table">
                                <tbody>
                                <tr
                                    className='profile__row'
                                    onClick={() => {
                                        openCloseModal('firstName', admin.firstName, 'First Name')
                                    }}
                                >
                                    <td>First Name</td>
                                    <td>{admin.firstName}</td>
                                    <td>></td>
                                </tr>
                                <tr
                                    className='profile__row'
                                    onClick={() => {
                                        openCloseModal('lastName', admin.lastName, 'Last Name')
                                    }}
                                >
                                    <td>Last Name</td>
                                    <td>{admin.lastName}</td>
                                    <td>></td>
                                </tr>
                                <tr
                                    className='profile__row'
                                    onClick={() => {
                                        openCloseModal('phoneNum', admin.phoneNum, 'Phone Number')
                                    }}
                                >
                                    <td>Phone Num</td>
                                    <td>{admin.phoneNum}</td>
                                    <td>></td>
                                </tr>
                                <tr
                                    className='profile__row'
                                    onClick={() => {
                                        openCloseModal('email', admin.email, 'Email')
                                    }}
                                >
                                    <td>Password</td>
                                    <td>Forget password?</td>
                                    <td>></td>
                                </tr>
                                <tr className='profile__row'>
                                    <td>Email</td>
                                    <td>{admin.email}</td>
                                    <td></td>
                                </tr>
                                <tr className='profile__row'>
                                    <td>Possibility</td>
                                    <td>{admin.possibility}</td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : null
                }
            </div>

            <Modal
                isOpen={modalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal()
                }}
            >
                <div className="bg-light rounded h-100 p-4">
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id='name'
                            disabled={value.key === 'email'}
                            placeholder={value.name}
                            value={value.value}
                            onChange={(e) => {
                                handleChangeValue(e.target.value)
                            }}
                        />
                        <label htmlFor='name'>{value.name}</label>
                    </div>
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
                            statusModify === 'pending' ? (
                                <div>
                                    <Spinner animation="border" variant="primary"/>
                                </div>
                            ) : null
                        }
                        <button
                            className="btn btn-primary"
                            onClick={value.key === 'email' ? handleGetKey : handleModifyAccount}
                        >
                            {
                                value.key === 'email' ? 'Get Key' : 'Modify'
                            }
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={passwordModalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openClosePassModal()
                }}
            >
                <div className="bg-light rounded h-100 p-4">
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id='token'
                            placeholder='Token'
                            value={newValues.token}
                            onChange={(e) => {
                                handleChangeNewValues('token', e.target.value)
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
                            value={newValues.password}
                            onChange={(e) => {
                                handleChangeNewValues('password', e.target.value)
                            }}
                        />
                        <label htmlFor='password'>Password</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id='passwordRepeat'
                            placeholder='Repeat password'
                            value={newValues.passwordRepeat}
                            onChange={(e) => {
                                handleChangeNewValues('passwordRepeat', e.target.value)
                            }}
                        />
                        <label htmlFor='passwordRepeat'>Repeat password</label>
                    </div>
                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openClosePassModal();
                                openCloseModal('email', admin.email, 'Email');
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={async () => {
                                await handleChangePass();
                            }}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Profile;
