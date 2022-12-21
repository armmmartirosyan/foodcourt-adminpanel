import React, {useCallback} from 'react';
import {useDispatch} from "react-redux";
import {allOffersListRequest, deleteOfferRequest} from "../store/actions/offers";

const {REACT_APP_API_URL} = process.env;

function OfferRow(props) {
    const {offer, openCloseModal} = props;
    const dispatch = useDispatch();

    const handleDelete = useCallback(async (e, slugName) => {
        e.stopPropagation();
        const {payload} = await dispatch(deleteOfferRequest({slugName}));

        if (payload.status === 'ok') {
            await dispatch(allOffersListRequest());
        }
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
                    className="btn btn-sm btn-primary"
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

export default OfferRow;
