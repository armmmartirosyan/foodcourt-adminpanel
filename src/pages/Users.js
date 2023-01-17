import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {allUsersListRequest} from "../store/actions/users";
import Wrapper from "../components/Wrapper";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import PageNumbers from "../components/PageNumbers";
import {toast} from "react-toastify";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:'firstName',
        label:'First Name',
    },
    {
        path:'lastName',
        label:'Last Name',
    },
    {
        path:'email',
        label:'Email',
    },
];

function Users() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector(state => state.users.users);
    const statusGetAll = useSelector(state => state.status.usersGetAllStatus);
    const totalPages = useSelector(state => state.users.pages);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState(qs.parse(location.search).name || '');
    const [myTimeout, setMyTimeout] = useState();

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const name = qs.parse(location.search).name;
        setCurrentPage(+page || 1);

        (async () => {
            const data = await dispatch(allUsersListRequest({page, name}));

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/users?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        setName(val);
        page = +page || 1;
        const query = qs.stringify({page, name: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/users${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='users'
        >
            <TopBar
                pageName='users'
                search={name}
                searchChange={searchChange}
            />
            {
                !_.isEmpty(users) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={users}
                        path='users'
                    />
                ) : <EmptyPage/>
            }
            {
                totalPages > 1 ? (
                    <PageNumbers
                        handleClickPage={handleClickPage}
                        totalPages={totalPages}
                        currentPage={currentPage}
                    />
                ) : null
            }
        </Wrapper>
    );
}

export default Users;

// import React, {useCallback, useEffect, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import _ from "lodash";
// import {allUsersListRequest, deleteUserAccountRequest} from "../store/actions/users";
// import Modal from "react-modal";
// import moment from "moment";
// import Wrapper from "../components/Wrapper";
// import qs from "query-string";
// import {useLocation, useNavigate} from "react-router-dom";
// import PageNumbers from "../components/PageNumbers";
// import {toast} from "react-toastify";
// import EmptyPage from "../components/EmptyPage";
// import TopBar from "../components/TopBar";
// import Table from "../components/Table";
// import Helper from "../helpers/Helper";
//
// const tableHeader = [
//     {
//         path:'firstName',
//         label:'First Name',
//     },
//     {
//         path:'lastName',
//         label:'Last Name',
//     },
//     {
//         path:'email',
//         label:'Email',
//     },
// ];
//
// function Users() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const users = useSelector(state => state.users.users);
//     const statusGetAll = useSelector(state => state.status.usersGetAllStatus);
//     const totalPages = useSelector(state => state.users.pages);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [name, setName] = useState(qs.parse(location.search).name || '');
//     const [user, setUser] = useState({});
//     const [myTimeout, setMyTimeout] = useState();
//
//     useEffect(() => {
//         const page = qs.parse(location.search).page;
//         const name = qs.parse(location.search).name;
//         setCurrentPage(+page || 1);
//
//         (async () => {
//             const data = await dispatch(allUsersListRequest({page, name}));
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, [location.search]);
//
//     const openCloseModal = useCallback((userObj = {}) => {
//         if (!_.isEmpty(userObj)) {
//             setUser(userObj);
//         }
//
//         if (modalIsOpen) {
//             setUser({});
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const handleClickPage = useCallback((p) => {
//         let query = qs.parse(location.search);
//         query.page = p;
//         query = qs.stringify(query, {skipNull: true});
//
//         navigate(`/users?${query}`);
//     }, [location.search]);
//
//     const searchChange = useCallback((val) => {
//         let page = val ? 1 : qs.parse(location.search).page;
//         setName(val);
//         page = +page || 1;
//         const query = qs.stringify({page, name: val || null}, {skipNull: true});
//
//         clearTimeout(myTimeout);
//
//         setMyTimeout(setTimeout(() => {
//             navigate(`/users${query ? `?${query}` : ''}`);
//         }, 400));
//     }, [myTimeout]);
//
//     const handleDelete = useCallback(async (e, id) => {
//         e.stopPropagation();
//         const data = await dispatch(deleteUserAccountRequest({id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         (users.length === 1 && currentPage > 1) ?
//             navigate(`/users?page=${currentPage - 1}`)
//             : await dispatch(allUsersListRequest({page: currentPage}));
//
//         toast.success('User deleted successfully');
//     }, [user, currentPage]);
//
//     return (
//         <Wrapper
//             statuses={{statusGetAll}}
//             pageName='users'
//         >
//             <div className="col-12">
//                 <div className="bg-light rounded h-100 p-4">
//                     <TopBar
//                         pageName='users'
//                         search={name}
//                         searchChange={searchChange}
//                     />
//                     {
//                         !_.isEmpty(users) ? (
//                             <Table
//                                 tableHeader={tableHeader}
//                                 list={users}
//                                 handleDelete={handleDelete}
//                                 openCloseModal={openCloseModal}
//                             />
//                         ) : <EmptyPage/>
//                     }
//                 </div>
//                 {
//                     totalPages > 1 ? (
//                         <PageNumbers
//                             handleClickPage={handleClickPage}
//                             totalPages={totalPages}
//                             currentPage={currentPage}
//                         />
//                     ) : null
//                 }
//             </div>
//
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {openCloseModal()}}
//                     >
//                         X
//                     </div>
//                     <h6 className="mb-4">
//                         User
//                     </h6>
//                     {
//                         !_.isEmpty(user) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{user.firstName}</p>
//                                     <label>First Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{user.lastName}</p>
//                                     <label>Last Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{user.email}</p>
//                                     <label>Email</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{user.phoneNum}</p>
//                                     <label>Phone Number</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{user.status}</p>
//                                     <label>Status</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(user.createdAt).format('LLL')}
//                                     </p>
//                                     <label>Created At</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(user.updatedAt).format('LLL')}
//                                     </p>
//                                     <label>Last Update</label>
//                                 </div>
//                             </>
//                         ) : null
//                     }
//
//                     <div className='btn-container'>
//                         <button
//                             className="btn btn-outline-danger"
//                             onClick={() => {
//                                 openCloseModal()
//                             }}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default Users;
