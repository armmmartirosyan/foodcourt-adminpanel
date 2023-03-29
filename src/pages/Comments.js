import React, {useEffect} from 'react';
import TopBar from "../components/TopBar";
import _ from "lodash";
import Table from "../components/Table";
import EmptyPage from "../components/EmptyPage";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import {getCommentsRequest} from "../store/actions/comment";

const tableHeader = [
    {
        path:['id'],
        label:'ID',
    },
    {
        path:['comment'],
        label:'Комментария',
    },
    {
        path:['status'],
        label:'Статус',
        disabled: true,
    },
];

function Comments() {
    const dispatch = useDispatch();
    const comments = useSelector(state => state.comments.comments);
    const statusGetAll = useSelector(state => state.status.commentGetAllStatus);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getCommentsRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, []);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='комментария'
        >
            <TopBar
                pageName='комментария'
                allowAdd={false}
            />
            {
                !_.isEmpty(comments) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={comments}
                        path='comments'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Comments;
