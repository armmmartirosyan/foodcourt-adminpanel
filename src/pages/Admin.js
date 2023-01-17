import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {
    getAdminsListRequest,
} from "../store/actions/admin";
import Wrapper from "../components/Wrapper";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path: 'firstName',
        label: 'First Name',
    },
    {
        path: 'lastName',
        label: 'Last Name',
    },
    {
        path: 'email',
        label: 'Email',
    },
];

function Admin() {
    const dispatch = useDispatch();
    const adminsList = useSelector(state => state.admin.adminsList);
    const statusAdminsList = useSelector(state => state.status.adminsListStatus);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAdminsListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, []);

    return (
        <Wrapper
            statuses={{statusAdminsList}}
            pageName='admin'
        >
            <div className='d-flex justify-content-between'>
                <TopBar
                    pageName='admin'
                    allowAdd={true}
                />
            </div>
            {
                !_.isEmpty(adminsList) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={adminsList}
                        path='admin'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Admin;


// import React, {useCallback, useEffect, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import _ from "lodash";
// import {toast} from "react-toastify";
// import {
//     deleteAdminAccountRequest,
//     getAdminsListRequest,
//     modifyAdminAccountRequest,
//     registerAdminRequest
// } from "../store/actions/admin";
// import Wrapper from "../components/Wrapper";
// import Modal from "react-modal";
// import moment from "moment";
// import Validator from "../helpers/Validator";
// import EmptyPage from "../components/EmptyPage";
// import TopBar from "../components/TopBar";
// import Table from "../components/Table";
// import {allBranchesListRequest} from "../store/actions/map";
// import Select from "react-select";
// import Helper from "../helpers/Helper";
// import PhoneInput from 'react-phone-number-input'
// import ru from 'react-phone-number-input/locale/ru'
//
// const tableHeader = [
//     {
//         path: 'firstName',
//         label: 'First Name',
//     },
//     {
//         path: 'lastName',
//         label: 'Last Name',
//     },
//     {
//         path: 'email',
//         label: 'Email',
//     },
// ];
//
// function Admin() {
//     const [editModalIsOpen, setEditModalIsOpen] = useState(false);
//     const dispatch = useDispatch();
//     const adminsList = useSelector(state => state.admin.adminsList);
//     const branches = useSelector(state => state.map.branches);
//     const statusBranchesList = useSelector(state => state.status.branchesGetAllStatus);
//     const statusAdminsList = useSelector(state => state.status.adminsListStatus);
//     const statusRegister = useSelector(state => state.status.adminRegisterStatus);
//     const statusModify = useSelector(state => state.status.adminModifyStatus);
//     const statusDelete = useSelector(state => state.status.adminDeleteStatus);
//     const [admin, setAdmin] = useState({});
//     const [branchesList, setBranchesList] = useState([]);
//     const [values, setValues] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         phoneNum: '',
//         status: '',
//         role: 'manager',
//         branchId: 0,
//     });
//
//     useEffect(() => {
//         (async () => {
//             const data = await dispatch(getAdminsListRequest());
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, []);
//
//     useEffect(() => {
//         if(!_.isEmpty(branches)){
//             setBranchesList([
//                 {value: 0, label: 'All branches'},
//                 ...branches.map(branch => {
//                     return {
//                         value: branch.id,
//                         label: branch.title
//                     }
//                 })
//             ]);
//         }
//     }, [branches]);
//
//     const openCloseModal = useCallback(async (adminObj = {}) => {
//         if (!_.isEmpty(adminObj)) {
//             setAdmin(adminObj);
//             setValues({
//                 firstName: adminObj.firstName,
//                 lastName: adminObj.lastName,
//                 email: adminObj.email,
//                 phoneNum: "+" + adminObj.phoneNum,
//                 role: adminObj.role,
//                 status: adminObj.status,
//                 branchId: adminObj.branchId || 0,
//             });
//         } else if (editModalIsOpen) {
//             setAdmin({});
//             setValues({
//                 firstName: '',
//                 lastName: '',
//                 email: '',
//                 password: '',
//                 phoneNum: '',
//                 status: '',
//                 role: 'manager',
//             });
//         }
//
//         if(!editModalIsOpen){
//             const data = await dispatch(allBranchesListRequest());
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         }
//
//         setEditModalIsOpen(!editModalIsOpen);
//     }, [editModalIsOpen]);
//
//     const handleRegisterAdmin = useCallback(async () => {
//         const validateValues = [
//             Validator.validEmail(values.email),
//             Validator.validPhoneNum(values.phoneNum.slice(1)),
//         ];
//
//         const invalidVal = validateValues.find((v) => v !== true);
//
//         if (invalidVal) {
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//         if (values.confirmPassword !== values.password) {
//             toast.error("Invalid confirm password");
//             return;
//         }
//
//         const data = await dispatch(registerAdminRequest({
//             firstName: values.firstName,
//             lastName: values.lastName,
//             email: values.email,
//             phoneNum: values.phoneNum.slice(1),
//             role: values.role,
//             password: values.password,
//             confirmPassword: values.confirmPassword,
//             branchId: values.branchId || null
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(getAdminsListRequest());
//         openCloseModal();
//         toast.success('Admin registered successfully');
//     }, [values]);
//
//     const handleChangeValues = useCallback((val, key) => {
//         setValues({
//             ...values,
//             [key]: val,
//         })
//     }, [values]);
//
//     const handleModifyAdminAccount = useCallback(async () => {
//         const validateValues = [
//             values.email ? Validator.validEmail(values.email) : true,
//             values.phoneNum ? Validator.validPhoneNum(values.phoneNum.slice(1)) : true,
//         ];
//
//         const invalidVal = validateValues.find((v) => v !== true);
//
//         if (invalidVal) {
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//
//         if (!values.firstName && !values.lastName
//             && !values.email && !values.phoneNum
//             && !values.role) {
//             toast.error("Fill one of fields!");
//             return;
//         }
//
//         const data = await dispatch(modifyAdminAccountRequest({
//             id: admin.id,
//             firstName: values.firstName || undefined,
//             lastName: values.lastName || undefined,
//             email: values.email || undefined,
//             phoneNum: values.phoneNum.slice(1) || undefined,
//             role: values.role || undefined,
//             branchId: values.branchId || null,
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(getAdminsListRequest());
//         openCloseModal();
//         toast.success('Admin modified successfully');
//     }, [values]);
//
//     const handleDelete = useCallback(async (e, id) => {
//         e.stopPropagation();
//         const data = await dispatch(deleteAdminAccountRequest({id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(getAdminsListRequest());
//         toast.success('Admin deleted successfully');
//     }, [admin]);
//
//     return (
//         <Wrapper
//             statuses={{statusDelete, statusModify, statusRegister, statusAdminsList, statusBranchesList}}
//             pageName='admin'
//         >
//             <div className="col-12">
//                 <div className="bg-light rounded h-100 p-4">
//                     <div className='d-flex justify-content-between'>
//                         <TopBar
//                             pageName='admin'
//                             openCloseModal={openCloseModal}
//                         />
//                     </div>
//                     {
//                         !_.isEmpty(adminsList) ? (
//                             <Table
//                                 tableHeader={tableHeader}
//                                 list={adminsList}
//                                 handleDelete={handleDelete}
//                                 openCloseModal={openCloseModal}
//                             />
//                         ) : <EmptyPage/>
//                     }
//                 </div>
//             </div>
//
//             <Modal
//                 isOpen={editModalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 {
//                     statusBranchesList === 'success' ? (
//                         <div className="bg-light rounded h-100 p-4 modal-container">
//                             <div
//                                 className="modal_close"
//                                 onClick={() => {
//                                     openCloseModal()
//                                 }}
//                             >
//                                 X
//                             </div>
//                             <h6 className="mb-4">
//                                 {`Admin ${!_.isEmpty(admin) ? `${admin.firstName} ${admin.lastName}` : 'Register'}`}
//                             </h6>
//                             <div className="form-floating mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="firstName"
//                                     placeholder="First Name"
//                                     value={values.firstName}
//                                     disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
//                                     onChange={(e) => {
//                                         handleChangeValues(e.target.value, 'firstName')
//                                     }}
//                                 />
//                                 <label htmlFor="firstName">First Name</label>
//                             </div>
//                             <div className="form-floating mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="lastName"
//                                     placeholder="Last Name"
//                                     value={values.lastName}
//                                     disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
//                                     onChange={(e) => {
//                                         handleChangeValues(e.target.value, 'lastName')
//                                     }}
//                                 />
//                                 <label htmlFor="lastName">Last Name</label>
//                             </div>
//                             <div className="form-floating mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="email"
//                                     placeholder="Email"
//                                     value={values.email}
//                                     disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
//                                     onChange={(e) => {
//                                         handleChangeValues(e.target.value, 'email')
//                                     }}
//                                 />
//                                 <label htmlFor="email">Email</label>
//                             </div>
//                             {
//                                 _.isEmpty(admin) ? (
//                                     <>
//                                         <div className="form-floating mb-3">
//                                             <input
//                                                 type="password"
//                                                 className="form-control"
//                                                 id="password"
//                                                 placeholder="Password"
//                                                 value={values.password}
//                                                 disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
//                                                 onChange={(e) => {
//                                                     handleChangeValues(e.target.value, 'password')
//                                                 }}
//                                             />
//                                             <label htmlFor="password">Password</label>
//                                         </div>
//                                         <div className="form-floating mb-3">
//                                             <input
//                                                 type="password"
//                                                 className="form-control"
//                                                 id="confirmPassword"
//                                                 placeholder="Confirm Password"
//                                                 value={values.confirmPassword}
//                                                 disabled={admin && (admin.status === 'active' || admin.status === 'deleted')}
//                                                 onChange={(e) => {
//                                                     handleChangeValues(e.target.value, 'confirmPassword')
//                                                 }}
//                                             />
//                                             <label htmlFor="confirmPassword">Confirm Password</label>
//                                         </div>
//                                     </>
//                                 ) : null
//                             }
//                             <div className='mb-3'>
//                                 <label htmlFor="admin-phone">Phone</label>
//                                 <PhoneInput
//                                     international
//                                     defaultCountry="RU"
//                                     labels={ru}
//                                     id='admin-phone'
//                                     disabled={!_.isEmpty(admin) && admin.status !== 'pending'}
//                                     value={values.phoneNum}
//                                     onChange={(num) => {
//                                         handleChangeValues(num, 'phoneNum')
//                                     }}
//                                 />
//                             </div>
//                             <div className="form-floating mb-3">
//                                 <select
//                                     className="form-select"
//                                     id="role"
//                                     aria-label="Floating label select example"
//                                     value={values.role}
//                                     disabled={!_.isEmpty(admin) && admin.status === 'deleted'}
//                                     onChange={(e) => {
//                                         handleChangeValues(e.target.value, 'role')
//                                     }}
//                                 >
//                                     <option value="manager">Manager</option>
//                                     <option value="admin manager">Admin Manager</option>
//                                     <option value="admin">Admin</option>
//                                 </select>
//                                 <label htmlFor="role">Role</label>
//                             </div>
//                             {
//                                 !_.isEmpty(branchesList) ? (
//                                     <div className='mb-3'>
//                                         <label htmlFor="branch-list">Select Branch</label>
//                                         <Select
//                                             defaultValue={!_.isEmpty(admin) ?
//                                                 branchesList.find(branch => branch.value === admin.branchId) : undefined
//                                             }
//                                             name="colors"
//                                             options={branchesList}
//                                             className="basic-multi-select"
//                                             classNamePrefix="select"
//                                             id='branch-list'
//                                             isDisabled={!_.isEmpty(admin) && admin.status === 'deleted'}
//                                             onChange={(e) => {
//                                                 handleChangeValues(e.value, 'branchId')
//                                             }}
//                                         />
//                                     </div>
//                                 ) : null
//                             }
//                             {
//                                 !_.isEmpty(admin) ? (
//                                     <>
//                                         <div className="form-floating mb-3">
//                                             <p className='form-control'>
//                                                 {values.status}
//                                             </p>
//                                             <label>Status</label>
//                                         </div>
//                                         <div className="form-floating mb-3">
//                                             <p className='form-control'>
//                                                 {moment(admin.createdAt).format('LLL')}
//                                             </p>
//                                             <label>Created At</label>
//                                         </div>
//                                         <div className="form-floating mb-3">
//                                             <p className='form-control'>
//                                                 {moment(admin.updatedAt).format('LLL')}
//                                             </p>
//                                             <label>Last Update</label>
//                                         </div>
//                                     </>
//                                 ) : null
//                             }
//
//                             <div className='btn-container'>
//                                 <button
//                                     className="btn btn-outline-danger"
//                                     onClick={() => {
//                                         openCloseModal()
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                                 {
//                                     admin && admin.status !== 'deleted' ? (
//                                         <button
//                                             className="btn btn-primary"
//                                             onClick={
//                                                 !_.isEmpty(admin) ? handleModifyAdminAccount : handleRegisterAdmin
//                                             }
//                                         >
//                                             {
//                                                 !_.isEmpty(admin) ? 'Modify' : 'Register'
//                                             }
//                                         </button>
//                                     ) : null
//                                 }
//                             </div>
//                         </div>
//                     ) : null
//                 }
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default Admin;
