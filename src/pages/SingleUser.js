import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {deleteUserAccountRequest, singleUserRequest} from "../store/actions/users";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import moment from "moment/moment";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";

function SingleUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.usersGetSingleStatus);
    const [user, setUser] = useState({});

    useEffect(() => {
        if(params.id){
            (async () => {
                const data = await dispatch(singleUserRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                setUser({...data.payload.user});
            })()
        }
    }, [params.id]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteUserAccountRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        // (users.length === 1 && currentPage > 1) ?
        //     navigate(`/users?page=${currentPage - 1}`)
        //     : navigate(`/users?page=${currentPage - 1}`);

        toast.success('User deleted successfully');
        navigate("/users");
    }, []);

    return (
        <Wrapper
            statuses={{statusGetSingle}}
            pageName={`user${user.email ? ' - ' + user.email : ''}`}
        >
            <TopBar
                pageName={`user${user.email ? ' - ' + user.email : ''}`}
                allowAdd={false}
            />
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
                    !_.isEmpty(user) && user.status !== 'blocked' ? (
                        <button
                            className="btn btn-danger"
                            onClick={async (e) => {
                                await handleDelete(e, user.id)
                            }}
                        >
                            Block
                        </button>
                    ) : null
                }
            </div>
        </Wrapper>
    );
}

export default SingleUser;
