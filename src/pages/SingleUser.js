import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {deleteUserAccountRequest, singleUserRequest} from "../store/actions/users";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

function SingleUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.usersGetSingleStatus);
    const [user, setUser] = useState({});

    const drawData = [
        {
            path: ['firstName'],
            label: 'First name',
            disabled: true,
        },
        {
            path: ['lastName'],
            label: 'Last name',
            disabled: true,
        },
        {
            path: ['email'],
            label: 'Email',
            disabled: true,
        },
        {
            path: ['phoneNum'],
            label: 'Phone',
            disabled: true,
        },
        {
            path: ['status'],
            label: 'Status',
            disabled: true,
        },
    ];

    useEffect(() => {
        if(params.id){
            (async () => {
                const data = await dispatch(singleUserRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                setUser({
                    ...data.payload.user,
                    phoneNum: '+' + data.payload.user.phoneNum,
                });
            })()
        }
    }, [params.id]);

    const handleBlock = useCallback(async (e, id) => {
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
            pageName={`user ${user.firstName ? user.firstName : ''}`}
        >
            <TopBar
                pageName={`user ${user.firstName ? user.firstName : ''}`}
                allowAdd={false}
            />
            {
                !_.isEmpty(user) ? (
                    <Single
                        drawData={drawData}
                        obj={user}
                        changeValues={() => {}}
                        values={{...user}}
                    />
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
                                await handleBlock(e, user.id)
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
