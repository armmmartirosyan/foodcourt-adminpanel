import React from 'react';
import {useSelector} from "react-redux";

function AdminRow(props) {
    const {admin, openCloseModal} = props;
    const currentAdmin = useSelector(state => state.admin.admin);

    return (
        <>
            {
                admin.email !== currentAdmin.email ? (
                    <tr
                        className='table-row'
                        onClick={() => {
                            openCloseModal(false, admin);
                        }}
                    >
                        <td>{admin.firstName}</td>
                        <td>{admin.lastName}</td>
                        <td>{admin.email}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openCloseModal(true, admin)
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ) : null
            }
        </>
    );
}

export default AdminRow;
