import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {allProductsListRequest, deleteProductRequest} from "../store/actions/products";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import PropTypes from "prop-types";

const {REACT_APP_API_URL} = process.env;

function ProductRow(props) {
    const {product, openCloseModal, page, products} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const data = await dispatch(deleteProductRequest({slugName}));

        if (data.error) {
            toast.error(data.error.message);
        }

        (products.length === 1 && page > 1) ?
            navigate(`/products?page=${page-1}`)
            : await dispatch(allProductsListRequest({page}));
        toast.success('Product deleted successfully.');
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
                    className="btn btn-sm btn-danger right"
                    disabled={admin && admin.possibility === 'junior'}
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
ProductRow.propTypes = {
    product: PropTypes.object.isRequired,
    page: PropTypes.number.isRequired,
    products: PropTypes.array.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default ProductRow;
