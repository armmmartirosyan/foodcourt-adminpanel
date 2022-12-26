import React from 'react';
import PropTypes from "prop-types";

function UserRow(props) {
    const {user, openCloseModal} = props;

    return (
        <tr
            className='table-row'
            onClick={() => {
                openCloseModal(user);
            }}
        >
            <td>
                {user.firstName}
            </td>
            <td>
                {user.lastName}
            </td>
            <td>
                {user.email}
            </td>
        </tr>
    );
}
UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default UserRow;
