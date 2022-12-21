import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {
    allCategoriesListRequest,
    deleteCategoryRequest
} from "../store/actions/categories";

const {REACT_APP_API_URL} = process.env;

function CategoryRow(props) {
    const {category, openCloseModal} = props;
    const dispatch = useDispatch();

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const {payload} = await dispatch(deleteCategoryRequest({slugName}));

        if (payload.status === 'ok') {
            await dispatch(allCategoriesListRequest());
        }
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
                    className="btn btn-sm btn-primary"
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

export default CategoryRow;
