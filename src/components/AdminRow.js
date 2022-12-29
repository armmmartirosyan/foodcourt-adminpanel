import React from 'react';
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";

function AdminRow(props) {
    const {admin, openCloseModal} = props;
    const currentAdmin = useSelector(state => state.admin.admin);

    return (
        <>
            {
                admin.email !== currentAdmin.email ? (
                    <tr
                        className={classNames(
                            'table-row',
                            {deleted: admin.status === 'deleted'})
                        }
                        onClick={() => {
                            openCloseModal(false, admin);
                        }}
                    >
                        <td>{admin.firstName}</td>
                        <td>{admin.lastName}</td>
                        <td>{admin.email}</td>
                        <td>
                            {
                                admin.status !== 'deleted' ? (
                                    <button
                                        className="btn btn-sm btn-danger right"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openCloseModal(true, admin)
                                        }}
                                    >
                                        Delete
                                    </button>
                                ) : null
                            }
                        </td>
                    </tr>
                ) : null
            }
        </>
    );
}

AdminRow.propTypes = {
    admin: PropTypes.object.isRequired,
    openCloseModal: PropTypes.func.isRequired,
}

export default AdminRow;
