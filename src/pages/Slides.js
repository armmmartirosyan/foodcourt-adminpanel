import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allSlidesListRequest} from "../store/actions/slides";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import EmptyPage from "../components/EmptyPage";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:'imagePath',
        label:'Image',
    },
];

function Slides() {
    const dispatch = useDispatch();
    const slides = useSelector(state => state.slides.slides);
    const statusGetAll = useSelector(state => state.status.slidesGetAllStatus);

    useEffect(() => {
        (async () => {
            const data = await dispatch(allSlidesListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, []);

    return (
        <Wrapper
            pageName='slides'
            statuses={{statusGetAll}}
        >
            <TopBar
                pageName='slides'
                allowAdd={true}
            />
            {
                !_.isEmpty(slides) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={slides}
                        path='slides'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Slides;
