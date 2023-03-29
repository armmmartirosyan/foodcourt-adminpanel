import React, {useCallback, useEffect} from 'react';
import TopBar from "../components/TopBar";
import Single from "../components/Single";
import _ from "lodash";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import {updateCommentStatusRequest, getSingleCommentRequest} from "../store/actions/comment";

const drawData = [
    {
        path:['comment'],
        label:'Комментария',
        disabled: true,
    },
    {
        path:['name'],
        label:'Имя',
        disabled: true,
    },
    {
        path:['status'],
        label:'Статус',
        disabled: true,
    },
];

function SingleComment() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.commentGetSingleStatus);
    const statusDelete = useSelector(state => state.status.commentDeleteStatus);
    const comment = useSelector(state => state.comments.singleComment);
    const admin = useSelector(state => state.admin.admin);

    const handleChangeStatus = useCallback(async (e, id, status) => {
        e.stopPropagation();
        const data = await dispatch(updateCommentStatusRequest({id, status}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Статус изменен');
        navigate('/comments');
    }, []);

    useEffect(() => {
        if(params.id){
            (async () => {
                const data = await dispatch(getSingleCommentRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }
            })()
        }
    }, [params.id]);

    return (
        <Wrapper
            statuses={{statusDelete, statusGetSingle}}
            pageName='комментария'
        >
            <TopBar
                pageName='комментария'
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={comment}
                changeValues={() => {}}
                values={{}}
            />

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
                    !_.isEmpty(comment) && comment.status !== 'заблокированный' ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'админ'}
                            onClick={async (e) => {
                                await handleChangeStatus(e, comment.id, 'заблокированный')
                            }}
                        >
                            Блокировать
                        </button>
                    ) : null
                }
                {
                    !_.isEmpty(comment) && comment.status !== 'активный' ? (
                        <button
                            className="btn btn-primary"
                            disabled={admin && admin.role === 'админ'}
                            onClick={async (e) => {
                                await handleChangeStatus(e, comment.id, 'активный')
                            }}
                        >
                            Активировать
                        </button>
                    ) : null
                }
            </div>
        </Wrapper>
    );
}
export default SingleComment;
