import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "../components/TopBar";
import _ from "lodash";
import SingleImage from "../components/SingleImage";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {
    addSlideRequest,
    deleteSlideRequest,
    singleSlideRequest,
    updateSlideRequest
} from "../store/actions/slides";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import {useNavigate, useParams} from "react-router-dom";
import Wrapper from "../components/Wrapper";

function SingleSlide() {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);
    const statusAdd = useSelector(state => state.status.slidesAddStatus);
    const statusUpdate = useSelector(state => state.status.slidesUpdateStatus);
    const statusDelete = useSelector(state => state.status.slidesDeleteStatus);
    const statusGetSingle = useSelector(state => state.status.slidesGetSingleStatus);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [image, setImage] = useState({});
    const [slide, setSlide] = useState({});

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(singleSlideRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                setSlide({...data.payload.slide});
            })()
        }
    }, [params.id]);

    const handleChangeImage = useCallback((e) => {
        const {files} = e.target;

        if (files.length) {
            files[0]._src = URL.createObjectURL(files[0]);
            setImage(files[0]);
        } else {
            setImage({});
        }
    }, []);

    const handleAddSlide = useCallback(async () => {
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addSlideRequest({
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Slide added successfully.');
        navigate('/slides');
    }, [image]);

    const handleUpdateSlide = useCallback(async () => {
        if (!image.type) {
            toast.error("Select image");
            return;
        }

        const data = await dispatch(updateSlideRequest({
            id: slide.id,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Slide updated successfully.');
        navigate('/slides');
    }, [image]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteSlideRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/slides');
    }, []);

    return (
        <Wrapper
            pageName='slide'
            uploadProcess={uploadProcess}
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
        >
            <TopBar
                pageName='slide'
                allowAdd={false}
            />
            {
                !_.isEmpty(slide) || !_.isEmpty(image) ? (
                    <SingleImage
                        image={image}
                        obj={slide}
                        handleChangeImage={handleChangeImage}
                    />
                ) : null
            }
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">Select Image</label>
                <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    disabled={admin && admin.role === 'manager'}
                    accept="image/*"
                    onChange={handleChangeImage}
                />
            </div>
            {
                !_.isEmpty(slide) ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(slide.createdAt).format('LLL')}
                            </p>
                            <label>Created At</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(slide.updatedAt).format('LLL')}
                            </p>
                            <label>Last Update</label>
                        </div>
                    </>
                ) : null
            }
            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Back
                </button>
                {
                    !_.isEmpty(slide) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, slide.id)
                            }}
                        >
                            Delete
                        </button>
                    ) : null
                }
                <button
                    className="btn btn-primary"
                    disabled={admin && admin.role === 'manager'}
                    onClick={
                        !_.isEmpty(slide) ? handleUpdateSlide : handleAddSlide
                    }
                >
                    {
                        !_.isEmpty(slide) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleSlide;
