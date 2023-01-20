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

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

            let mediumNum = [0, 0];

            data.payload.branches.forEach(b => {
                mediumNum[0] = +mediumNum[0] + +b.lat;
                mediumNum[1] = +mediumNum[1] + +b.lon;
            });

            if(data.payload.branches.length) {
                setCenter([
                    mediumNum[0] / data.payload.branches.length,
                    mediumNum[1] / data.payload.branches.length,
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
                    center={center[0] !== 0 ? center : [40.786543, 43.838250]}
                    branches={branches || []}
                />
            </div>
        </Wrapper>
    );
}

export default Branches;
