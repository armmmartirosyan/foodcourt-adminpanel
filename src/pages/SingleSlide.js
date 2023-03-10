import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "../components/TopBar";
import _ from "lodash";
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
import Single from "../components/Single";
import Validator from "../helpers/Validator";

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
    const [slide, setSlide] = useState({});
    const [values, setValues] = useState({
        image: {},
        title: '',
        description: '',
    });

    const drawData = [
        {
            path: ['image'],
            label: 'Image',
            disabled: false,
        },
        {
            path: ['title'],
            label: 'Title',
            disabled: false,
        },
        {
            path: ['description'],
            label: 'Description',
            disabled: false,
        },
        {
            path: ['imageSelect'],
            label: 'Select Image',
            disabled: false,
        },
    ];

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(singleSlideRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                setSlide({...data.payload.slide});
                setValues({
                    ...values,
                    title: data.payload.slide.title || '',
                    description: data.payload.slide.description || '',
                })
            })()
        }
    }, [params.id]);

    const handleChangeValues = useCallback((val, key) => {
        if (key === 'image' && val.target
            && !_.isEmpty(val.target.files)) {
            const {files} = val.target;

            files[0]._src = URL.createObjectURL(files[0]);
            setValues({
                ...values,
                [key]: files[0],
            });
        } else if (key === 'image') {
            setValues({
                ...values,
                [key]: {},
            });
        } else {
            setValues({
                ...values,
                [key]: val,
            });
        }
    }, [values]);

    const handleAddSlide = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validString(values.title) : true,
            values.description ? Validator.validString(values.description) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addSlideRequest({
            image: values.image,
            title: values.title || undefined,
            description: values.description || undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Slide added successfully.');
        navigate('/slides');
    }, [values]);

    const handleUpdateSlide = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validString(values.title) : true,
            values.description ? Validator.validString(values.description) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description && !values.image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateSlideRequest({
            id: slide.id,
            image: values.image.type ? values.image : undefined,
            title: values.title || undefined,
            description: values.description || undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Slide updated successfully.');
        navigate('/slides');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteSlideRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Slide deleted successfully.');
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

            <Single
                drawData={drawData}
                obj={slide}
                changeValues={handleChangeValues}
                values={values}
            />

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
