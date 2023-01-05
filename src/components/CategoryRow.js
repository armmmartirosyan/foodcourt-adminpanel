import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    allCategoriesListRequest,
    deleteCategoryRequest
} from "../store/actions/categories";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const {REACT_APP_API_URL} = process.env;

function CategoryRow(props) {
    const {category, openCloseModal} = props;
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin.admin);

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const data = await dispatch(deleteCategoryRequest({slugName}));

        if (data.error) {
            toast.error(data.error.message);
            return;
        }

        await dispatch(allCategoriesListRequest());
        toast.success('Category deleted successfully.');
    }, []);

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(category);
            }}
        >
            <th>
                <img
                    src={`${REACT_APP_API_URL}/${category.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </th>
            <td>{category.name}</td>
            <td>
                <button
                    className="btn btn-sm btn-danger right"
                    disabled={admin && admin.possibility === 'junior'}
                    onClick={async (e) => {
                        await handleDelete(e, category.slugName)
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
CategoryRow.propTypes = {
    category: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}

export default CategoryRow;
