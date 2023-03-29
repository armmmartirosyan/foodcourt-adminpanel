import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {useDispatch} from "react-redux";
import {singleBranchRequest} from "../store/actions/map";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import PropTypes from "prop-types";

function ProfileTable(props) {
    const {data = [], admin, updateValues} = props;
    const [branchTitle, setBranchTitle] = useState('Все ветви')
    const dispatch = useDispatch();
    const excludeLabel = [
        'Пароль',
        'Роль',
        'Ветвь',
        'Номер телефона',
    ];

    useEffect(() => {
        (async () => {
            if (admin.branchId) {
                const data = await dispatch(singleBranchRequest({id: admin.branchId}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                setBranchTitle(data?.payload?.singleBranch?.title);
            }
        })()
    }, []);

    return (
        <div className="profile__table">
            <table className="table">
                <tbody>
                {
                    !_.isEmpty(data) ? (
                        data.map(item => (
                            <tr
                                key={item.label}
                                className='profile__row'
                                onClick={() => {
                                    if (item.edit) updateValues(item.path, admin[item.path], item.label);
                                }}
                            >
                                <td>{item.label}</td>
                                <td>
                                    {
                                        item.label === 'Пароль' ? 'Забыли пароль?' : null
                                    }
                                    {
                                        item.label === 'Роль' ? _.capitalize(admin.role) : null
                                    }
                                    {
                                        item.label === 'Ветвь' ? branchTitle : null
                                    }
                                    {
                                        item.label === 'Номер телефона' ? `+${admin[item.path]}` : null
                                    }
                                    {
                                        !excludeLabel.includes(item.label) ? admin[item.path] : null
                                    }
                                </td>
                                <td>{item.edit ? '>' : null}</td>
                            </tr>
                        ))
                    ) : null
                }
                </tbody>
            </table>
        </div>
    );
}

ProfileTable.propTypes = {
    data: PropTypes.array,
    admin: PropTypes.object.isRequired,
    updateValues: PropTypes.func.isRequired,
}

export default ProfileTable;
