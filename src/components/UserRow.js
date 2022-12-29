import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

function UserRow(props) {
    const {user, openCloseModal} = props;

    return (
        <tr
            className={classNames(
                'table-row',
                {deleted: user.status === 'deleted'})
            }
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
            <td>
                {
                    user.status !== 'deleted' ? (
                        <button
                            className="btn btn-sm btn-danger right"
                            onClick={(e) => {
                                e.stopPropagation();
                                openCloseModal(user, true)
                            }}
                        >
                            Delete
                        </button>
                    ) : null
                }
            </td>
        </tr>
    );
}
UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}
export default UserRow;
