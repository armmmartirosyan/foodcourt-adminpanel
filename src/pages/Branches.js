import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allBranchesListRequest} from "../store/actions/map";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Helper from "../helpers/Helper";
import YandexMap from "../components/YandexMap";

function Branches() {
    const dispatch = useDispatch();
    const branches = useSelector(state => state.map?.branches);
    const statusGetAll = useSelector(state => state.status.branchesGetAllStatus);
    const [center, setCenter] = useState([0, 0]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(allBranchesListRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const tempBranches = data.payload.branches;
            let mediumNum = [0, 0];

            tempBranches.forEach(b => {
                mediumNum[0] = +mediumNum[0] + +b.lat;
                mediumNum[1] = +mediumNum[1] + +b.lon;
            });

            if(tempBranches.length) {
                setCenter([
                    mediumNum[0] / tempBranches.length,
                    mediumNum[1] / tempBranches.length,
                ]);
            }
        })()
    }, []);

    return (
        <Wrapper
            pageName='branches'
            statuses={{statusGetAll}}
        >
            <TopBar
                pageName='branches'
                allowAdd={true}
            />
            <div className="container mb-3">
                <YandexMap
                    center={center[0] !== 0 ? center : []}
                    branches={branches || []}
                    allowMapClick={false}
                />
            </div>
        </Wrapper>
    );
}

export default Branches;
