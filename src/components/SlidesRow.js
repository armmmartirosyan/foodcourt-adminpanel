import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {allSlidesListRequest, deleteSlideRequest} from "../store/actions/slides";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const {REACT_APP_API_URL} = process.env;

function SlidesRow(props) {
    const {slide, openCloseModal} = props;
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin.admin);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteSlideRequest({id}));

        if (data.error) {
            toast.error(data.error.message);
        }

        await dispatch(allSlidesListRequest());
        toast.success('Slide deleted successfully.');
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
                    className="btn btn-sm btn-danger right"
                    disabled={admin && admin.possibility === 'junior'}
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
SlidesRow.propTypes = {
    slide: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default SlidesRow;
