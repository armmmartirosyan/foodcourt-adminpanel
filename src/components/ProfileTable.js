import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {useDispatch} from "react-redux";
import {singleBranchRequest} from "../store/actions/map";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";

function ProfileTable(props) {
    const {data, admin, updateValues} = props;
    const [branchTitle, setBranchTitle] = useState('All branches')
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if(admin.branchId){
                const data = await dispatch(singleBranchRequest({id: admin.branchId}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                setBranchTitle(data.payload.singleBranch.title);
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
                                        item.label === 'Password' ? 'Forgot Password?' : null
                                    }
                                    {
                                        item.label === 'Branch' ? branchTitle : null
                                    }
                                    {
                                        item.label !== 'Password'
                                        && item.label !== 'Branch'
                                            ? admin[item.path] : null
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

export default ProfileTable;
