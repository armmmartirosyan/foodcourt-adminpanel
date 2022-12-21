import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {allSlidesListRequest, deleteSlideRequest} from "../store/actions/slides";

const {REACT_APP_API_URL} = process.env;

function SlidesRow(props) {
    const {slide, openCloseModal} = props;
    const dispatch = useDispatch();

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const {payload} = await dispatch(deleteSlideRequest({id}));

        if (payload.status === 'ok') {
            await dispatch(allSlidesListRequest());
        }
    }, []);

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(slide);
            }}
        >
            <th>
                <img
                    src={`${REACT_APP_API_URL}/${slide.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </th>
            <td>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={async (e) => {
                        await handleDelete(e, slide.id)
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default SlidesRow;
