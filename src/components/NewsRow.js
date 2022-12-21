import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {allNewsListRequest, deleteNewsRequest} from "../store/actions/news";
import {useNavigate} from "react-router-dom";

const {REACT_APP_API_URL} = process.env;

function NewsRow(props) {
    const {news, openCloseModal, newsList, page} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const {payload} = await dispatch(deleteNewsRequest({slugName}));

        if (payload.status === 'ok') {
            (newsList.length === 1 && page > 1) ?
                navigate(`/news?page=${page-1}`)
                : await dispatch(allNewsListRequest({page}));
        }
    }, [page, newsList]);

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(news);
            }}
        >
            <th>
                <img
                    src={`${REACT_APP_API_URL}/${news.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </th>
            <td>{news.title}</td>
            <td>
                {
                    news.description.length > 50 ?
                        `${news.description.slice(0, 50)} ...`
                        : news.description
                }
            </td>
            <td>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={async (e) => {
                        await handleDelete(e, news.slugName)
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default NewsRow;