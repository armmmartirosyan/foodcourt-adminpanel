import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {allProductsListRequest, deleteProductRequest} from "../store/actions/products";
import {useNavigate} from "react-router-dom";

const {REACT_APP_API_URL} = process.env;

function ProductRow(props) {
    const {product, openCloseModal, page, products} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const {payload} = await dispatch(deleteProductRequest({slugName}));

        if (payload.status === 'ok') {
            (products.length === 1 && page > 1) ?
                navigate(`/products?page=${page-1}`)
                : await dispatch(allProductsListRequest({page}));
        }
    }, [page, products]);

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(product);
            }}
        >
            <th>
                <img
                    src={`${REACT_APP_API_URL}/${product.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </th>
            <td>{product.title}</td>
            <td>{`${product.price} AMD`}</td>
            <td>{product.categorySlug}</td>
            <td>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={async (e) => {
                        await handleDelete(e, product.slugName)
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default ProductRow;
