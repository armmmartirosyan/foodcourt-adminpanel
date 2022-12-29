import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {allOffersListRequest, deleteOfferRequest} from "../store/actions/offers";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const {REACT_APP_API_URL} = process.env;

function OfferRow(props) {
    const {offer, openCloseModal} = props;
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin.admin);

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const data = await dispatch(deleteOfferRequest({slugName}));

        if (data.error) {
            toast.error(data.error.message);
        }

        await dispatch(allOffersListRequest());
        toast.success('Offer deleted successfully.');
    }, []);

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(offer);
            }}
        >
            <th>
                <img
                    src={`${REACT_APP_API_URL}/${offer.imagePath}`}
                    alt="image"
                    className='table-img'
                />
            </th>
            <td>{offer.title}</td>
            <td>{`${offer.price} AMD`}</td>
            <td>
                <button
                    className="btn btn-sm btn-danger right"
                    disabled={admin && admin.possibility === 'junior'}
                    onClick={async (e) => {
                        await handleDelete(e, offer.slugName)
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
OfferRow.propTypes = {
    offer: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default OfferRow;
