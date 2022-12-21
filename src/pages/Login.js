import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changePassRequest, getKeyRequest, loginRequest} from "../store/actions/admin";
import Account from "../helpers/Account";
import {toast} from "react-toastify";
import Api from "../Api";
import Modal from "react-modal";
import Spinner from "react-bootstrap/Spinner";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginStatus = useSelector(state => state.status.adminLoginStatus);
    const getKeyStatus = useSelector(state => state.status.adminGetKeyStatus);
    const changePassStatus = useSelector(state => state.status.adminChangePassStatus);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
    const [values, setValues] = useState({
        email: '',
        password: '',
        passwordRepeat: '',
        remember: false,
        token: '',
    });

    const openCloseModal = useCallback((isPass) => {
        setValues({
            ...values,
            remember: false,
            password: '',
            token: '',
            passwordRepeat: '',
        });

        isPass ? setPasswordModalIsOpen(!passwordModalIsOpen) : setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen, passwordModalIsOpen, values]);

    const handleChange = useCallback((value, key) => {
        setValues({
            ...values,
            [key]: value
        })
    }, [values]);

    const handleSgnIn = useCallback(async () => {
        try {
           const {data} = await Api.signIn(values);

            dispatch(loginRequest({remember:values.remember,data}))

            navigate('/home');
        }catch (e) {
            toast.error(e.response.data.message);
        }

    }, [values]);

    const handleGetKey = useCallback(async () => {
        const data = await dispatch(getKeyRequest({email: values.email}));

        if(data.error){
            toast.error("Something wrong with email!");
            return;
        }

        openCloseModal(false);
        openCloseModal(true);
    }, [values]);

    const handleChangePass = useCallback(async () => {
        if(values.passwordRepeat !== values.password){
            toast.error("Repeated password is wrong!");
            return
        }

        const data = await dispatch(changePassRequest({
            email: values.email,
            password: values.password,
            token: values.token
        }));

        if(data.error){
            toast.error("Something goes wrong!");
            return;
        }

        toast.success("Password changed!");
        openCloseModal(true);
    }, [values]);

    useEffect(() => {
        if(Account.getToken()) navigate('/home');
    }, []);

    return (
        <div className="container-fluid">
            <div
                className="row h-100 align-items-center justify-content-center"
                style={{minHeight: '100vh'}}
            >
                <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3>Sign In</h3>
                        </div>
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
                                openCloseModal(false)
                            }}
                        >
                            Forgot Password ?
                        </button>
                    </div>
                </div>
            </div>
            {
                changePassStatus === 'pending'
                || getKeyStatus === 'pending'
                || loginStatus === 'pending' ? (
                    <div className='spinner-container'>
                        <Spinner animation="border" variant="primary"/>
                    </div>
                ) : null
            }

            <Modal
                isOpen={modalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal(false)
                }}
            >
                <div className="bg-light rounded h-100 p-4">
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id='email'
                            placeholder='Email'
                            value={values.email}
                            onChange={(e) => {
                                handleChange(e.target.value, 'email')
                            }}
                        />
                        <label htmlFor='email'>Email</label>
                    </div>
                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal(false)
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleGetKey}
                        >
                            Get Key
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={passwordModalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal(true)
                }}
            >
                <div className="bg-light rounded h-100 p-4">
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
                            id='passwordRepeat'
                            placeholder='Repeat password'
                            value={values.passwordRepeat}
                            onChange={(e) => {
                                handleChange(e.target.value, 'passwordRepeat')
                            }}
                        />
                        <label htmlFor='passwordRepeat'>Repeat password</label>
                    </div>
                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal(true);
                                openCloseModal(false);
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
                </div>
            </Modal>
        </div>
    );
}

export default Login;
