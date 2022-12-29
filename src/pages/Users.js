import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {allUsersListRequest, deleteUserAccountRequest} from "../store/actions/users";
import Modal from "react-modal";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import UserRow from "../components/UserRow";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import PageNumbers from "../components/PageNumbers";
import {toast} from "react-toastify";
import EmptyPage from "../components/EmptyPage";
import TopBar from "../components/TopBar";

function Users() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector(state => state.users.users);
    const statusGetAll = useSelector(state => state.status.usersGetAllStatus);
    const totalPages = useSelector(state => state.users.pages);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState(qs.parse(location.search).name || '');
    const [user, setUser] = useState({});
    const [myTimeout, setMyTimeout] = useState();
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const name = qs.parse(location.search).name;
        setCurrentPage(+page || 1);

        (async () => {
            await dispatch(allUsersListRequest({page, name}));
        })()
    }, [location.search]);

    const openCloseModal = useCallback((userObj, isDelete = false) => {
        if (!_.isEmpty(userObj)) {
            setUser(userObj);
        }

        if (modalIsOpen || deleteModalIsOpen) {
            setUser({});
        }

        isDelete ?
            setDeleteModalIsOpen(!deleteModalIsOpen) :
            setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen, deleteModalIsOpen]);

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

    const handleDelete = useCallback(async (e) => {
        e.stopPropagation();
        const data = await dispatch(deleteUserAccountRequest({id: user.id}));

        if (data.error) {
            toast.error('Error deleting user!');
            return;
        }

        await dispatch(allUsersListRequest());
        openCloseModal({}, true);
        toast.success('User deleted successfully');
    }, [user]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='users'
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        pageName='users'
                        search={name}
                        searchChange={searchChange}
                    />
                    {
                        !_.isEmpty(users) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Email</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        users.map(user => (
                                            <UserRow
                                                user={user}
                                                key={user.id}
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
                {
                    totalPages > 1 ? (
                        <PageNumbers
                            handleClickPage={handleClickPage}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    ) : null
                }
            </div>

            <Modal
                isOpen={modalIsOpen}
                className="modal"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal()
                }}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {openCloseModal()}}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        User
                    </h6>
                    {
                        !_.isEmpty(user) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{user.firstName}</p>
                                    <label>First Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{user.lastName}</p>
                                    <label>Last Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{user.email}</p>
                                    <label>Email</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{user.phoneNum}</p>
                                    <label>Phone Number</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{user.status}</p>
                                    <label>Status</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(user.createdAt).format('LLL')}
                                    </p>
                                    <label>Created At</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(user.updatedAt).format('LLL')}
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
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={deleteModalIsOpen}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal({}, true)
                }}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {
                            openCloseModal({}, true)
                        }}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        {`Do you really want to delete user ${user.firstName} ${user.lastName}?`}
                    </h6>
                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal({}, true)
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={ handleDelete }
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Users;
