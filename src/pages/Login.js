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
            //Validator.validPass(values.password),
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

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        dispatch(loginRequest({remember: values.remember, data}))
        navigate('/home');
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


// import React, {useCallback, useEffect, useState} from 'react';
// import {useNavigate} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import {changePassRequest, getKeyRequest, loginRequest} from "../store/actions/admin";
// import Account from "../helpers/Account";
// import {toast} from "react-toastify";
// import Modal from "react-modal";
// import Spinner from "react-bootstrap/Spinner";
// import Validator from "../helpers/Validator";
// import {Helmet} from "react-helmet";
// import _ from "lodash";
// import Helper from "../helpers/Helper";
// import WrapperLogIn from "../components/WrapperLogIn";
//
// function Login() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const loginStatus = useSelector(state => state.status.adminLoginStatus);
//     const getKeyStatus = useSelector(state => state.status.adminGetKeyStatus);
//     const changePassStatus = useSelector(state => state.status.adminChangePassStatus);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [passwordModalIsOpen, setPasswordModalIsOpen] = useState(false);
//     const [values, setValues] = useState({
//         email: '',
//         password: '',
//         confirmPassword: '',
//         remember: false,
//         token: '',
//     });
//
//     const openCloseModal = useCallback((isPass) => {
//         setValues({
//             ...values,
//             remember: false,
//             password: '',
//             token: '',
//             confirmPassword: '',
//         });
//
//         isPass ? setPasswordModalIsOpen(!passwordModalIsOpen) : setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen, passwordModalIsOpen, values]);
//
//     const handleChange = useCallback((value, key) => {
//         setValues({
//             ...values,
//             [key]: value
//         })
//     }, [values]);
//
//     const handleSgnIn = useCallback(async () => {
//         const validateValues = [
//             Validator.validEmail(values.email),
//             //Validator.validPass(values.password),
//         ];
//
//         if(validateValues.find((v) => v!==true)){
//             toast.error('Invalid email or password');
//             return;
//         }
//
//         const data = await dispatch(loginRequest({
//             email: values.email,
//             password: values.password,
//             remember: values.remember,
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         dispatch(loginRequest({remember: values.remember, data}))
//         navigate('/home');
//     }, [values]);
//
//     const handleGetKey = useCallback(async () => {
//         const validateValues = [
//             Validator.validEmail(values.email)
//         ];
//
//         if(validateValues.find((v) => v!==true)){
//             toast.error('Invalid email');
//             return;
//         }
//
//         const data = await dispatch(getKeyRequest({email: values.email}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         openCloseModal(false);
//         openCloseModal(true);
//         toast.success('Key sent successfully');
//     }, [values]);
//
//     const handleChangePass = useCallback(async () => {
//         const validateValues = [
//             Validator.validPass(values.password),
//             Validator.validUUID(values.token),
//         ];
//
//         const invalidValue = validateValues.find((v) => v!==true);
//
//         if(invalidValue){
//             toast.error(`Invalid ${invalidValue}`);
//             return;
//         }
//
//         if (values.confirmPassword !== values.password) {
//             toast.error("Confirm password is wrong!");
//             return
//         }
//
//         const data = await dispatch(changePassRequest({
//             email: values.email,
//             password: values.password,
//             token: values.token,
//             confirmPassword: values.confirmPassword
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         openCloseModal(true);
//         toast.success("Password changed!");
//     }, [values]);
//
//     useEffect(() => {
//         if (Account.getToken()) navigate('/home');
//     }, []);
//
//     return (
//         <div className="container-fluid">
//             <Helmet>
//                 <title>Login</title>
//             </Helmet>
//             <div
//                 className="row h-100 align-items-center justify-content-center"
//                 style={{minHeight: '100vh'}}
//             >
//                 <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
//                     <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
//                         <div className="d-flex align-items-center justify-content-between mb-3">
//                             <h3>Sign In</h3>
//                         </div>
//                         <div className="form-floating mb-3">
//                             <input
//                                 type="email"
//                                 className="form-control"
//                                 id="floatingInput"
//                                 placeholder="Email"
//                                 value={values.email}
//                                 onChange={(ev) => {
//                                     handleChange(ev.target.value, 'email')
//                                 }}
//                             />
//                             <label htmlFor="floatingInput">Email address</label>
//                         </div>
//                         <div className="form-floating mb-4">
//                             <input
//                                 type="password"
//                                 className="form-control"
//                                 id="floatingPassword"
//                                 placeholder="Password"
//                                 value={values.password}
//                                 onChange={(ev) => {
//                                     handleChange(ev.target.value, 'password')
//                                 }}
//                             />
//                             <label htmlFor="floatingPassword">Password</label>
//                         </div>
//                         <div className="d-flex align-items-center justify-content-between mb-4">
//                             <div className="form-check">
//                                 <input
//                                     type="checkbox"
//                                     className="form-check-input"
//                                     id="exampleCheck"
//                                     checked={values.remember}
//                                     onChange={() => {
//                                         handleChange(!values.remember, 'remember')
//                                     }}
//                                 />
//                                 <label className="form-check-label" htmlFor="exampleCheck">Remember Me</label>
//                             </div>
//                         </div>
//                         <button
//                             type="submit"
//                             className="btn btn-primary py-3 w-100 mb-4"
//                             onClick={handleSgnIn}
//                         >
//                             Sign In
//                         </button>
//                         <button
//                             className="btn btn-light py-1 w-100"
//                             onClick={() => {
//                                 openCloseModal(false)
//                             }}
//                         >
//                             Forgot Password ?
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             {
//                 changePassStatus === 'pending'
//                 || getKeyStatus === 'pending'
//                 || loginStatus === 'pending' ? (
//                     <div className='spinner-container'>
//                         <Spinner animation="border" variant="primary"/>
//                     </div>
//                 ) : null
//             }
//
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal small"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal(false)
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {
//                             openCloseModal(false)
//                         }}
//                     >
//                         X
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id='email'
//                             placeholder='Email'
//                             value={values.email}
//                             onChange={(e) => {
//                                 handleChange(e.target.value, 'email')
//                             }}
//                         />
//                         <label htmlFor='email'>Email</label>
//                     </div>
//                     <div className='btn-container'>
//                         <button
//                             className="btn btn-outline-danger"
//                             onClick={() => {
//                                 openCloseModal(false)
//                             }}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="btn btn-primary"
//                             onClick={handleGetKey}
//                         >
//                             Get Key
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//
//             <Modal
//                 isOpen={passwordModalIsOpen}
//                 className="modal small"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal(true)
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {
//                             openCloseModal(true)
//                         }}
//                     >
//                         X
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id='token'
//                             placeholder='Token'
//                             value={values.token}
//                             onChange={(e) => {
//                                 handleChange(e.target.value, 'token')
//                             }}
//                         />
//                         <label htmlFor='token'>Token</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="password"
//                             className="form-control"
//                             id='password'
//                             placeholder='Password'
//                             value={values.password}
//                             onChange={(e) => {
//                                 handleChange(e.target.value, 'password')
//                             }}
//                         />
//                         <label htmlFor='password'>Password</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="password"
//                             className="form-control"
//                             id='confirmPassword'
//                             placeholder='Confirm password'
//                             value={values.confirmPassword}
//                             onChange={(e) => {
//                                 handleChange(e.target.value, 'confirmPassword')
//                             }}
//                         />
//                         <label htmlFor='confirmPassword'>Confirm password</label>
//                     </div>
//                     <div className='btn-container'>
//                         <button
//                             className="btn btn-outline-danger"
//                             onClick={() => {
//                                 openCloseModal(true);
//                                 openCloseModal(false);
//                             }}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="btn btn-primary"
//                             onClick={handleChangePass}
//                         >
//                             Change Password
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// }
//
// export default Login;
