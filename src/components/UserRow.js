import React from 'react';

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

export default UserRow;
