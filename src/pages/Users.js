import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {allUsersListRequest} from "../store/actions/users";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-modal";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import UserRow from "../components/UserRow";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import PageNumbers from "../components/PageNumbers";

function Users() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const users = useSelector(state => state.users.users);
    const statusGetAll = useSelector(state => state.status.usersGetAllStatus);
    const totalPages = useSelector(state => state.users.pages);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState('');
    const [user, setUser] = useState({});

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const name = qs.parse(location.search).name;
        setCurrentPage(+page || 1);

        (async () => {
            await dispatch(allUsersListRequest({page, name}));
        })()
    }, [location.search]);

    useEffect(() => {
        let page = name ? 1 : qs.parse(location.search).page;
        page = +page || 1;
        const query = qs.stringify({page, name: name || null}, {skipNull: true});

        navigate(`/users${query ? `?${query}` : ''}`);
    }, [name]);

    const openCloseModal = useCallback((userObj) => {
        if (!_.isEmpty(userObj)) {
            setUser(userObj);
        }

        if (modalIsOpen) {
            setUser({});
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/users?${query}`);
    }, [location.search]);

    return (
        <Wrapper
            searchable={true}
            setSearch={setName}
            statusGetAll={statusGetAll}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <div className='d-flex justify-content-between'>
                        <h6 className="mb-4">Users</h6>
                    </div>
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
                        ) : null
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
                <div className="bg-light rounded h-100 p-4">
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
        </Wrapper>
    );
}

export default Users;
