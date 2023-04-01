import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {changeUserStatusRequest, singleUserRequest} from "../store/actions/users";
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
            label: 'Имя',
            disabled: true,
        },
        {
            path: ['email'],
            label: 'Электронная почта',
            disabled: true,
        },
        {
            path: ['phoneNum'],
            label: 'Номер телефона',
            disabled: true,
        },
        {
            path: ['status'],
            label: 'Положение',
            disabled: true,
        },
    ];

    useEffect(() => {
        if(params.id){
            (async () => {
                const data = await dispatch(singleUserRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
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

    const handleChangeUserStatus = useCallback(async (e, id, status) => {
        e.stopPropagation();
        const data = await dispatch(changeUserStatusRequest({id, status}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success(`Статус пользователя изменен.`);
        navigate("/users");
    }, []);

    return (
        <Wrapper
            statuses={{statusGetSingle}}
            pageName={`пользовател ${user.firstName ? user.firstName : ''}`}
        >
            <TopBar
                pageName={`пользовател ${user.firstName ? user.firstName : ''}`}
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
                    Назад
                </button>
                {
                    !_.isEmpty(user) && user.status !== 'blocked' ? (
                        <button
                            className="btn btn-danger"
                            onClick={async (e) => {
                                await handleChangeUserStatus(e, user.id, 'blocked')
                            }}
                        >
                            Блокировать
                        </button>
                    ) : (
                        <button
                            className="btn btn-success"
                            onClick={async (e) => {
                                await handleChangeUserStatus(e, user.id, 'active')
                            }}
                        >
                            Разблокировать
                        </button>
                    )
                }
            </div>
        </Wrapper>
    );
}

export default SingleUser;
