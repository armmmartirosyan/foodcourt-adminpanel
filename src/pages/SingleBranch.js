import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addBranchRequest, deleteBranchRequest, singleBranchRequest} from "../store/actions/map";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import Wrapper from "../components/Wrapper";
import {useNavigate, useParams} from "react-router-dom";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

function SingleBranch() {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const statusGetSingle = useSelector(state => state.status.branchesGetSingleStatus);
    const statusAdd = useSelector(state => state.status.branchAddStatus);
    const statusUpdate = useSelector(state => state.status.branchUpdateStatus);
    const statusDelete = useSelector(state => state.status.branchDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [values, setValues] = useState({
        title: '',
        location: '',
        lat: '',
        lon: '',
        phoneNum: '',
        city: '',
        country: '',
        main: false,
        center: [0, 0],
        images: [],
    });

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(singleBranchRequest({id: params.id}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                const tempBranch = {...data.payload.singleBranch};

                setValues({
                    ...tempBranch,
                    phoneNum: "+" + tempBranch.phoneNum,
                    main: tempBranch.main === 'main',
                    center: [ tempBranch.lat, tempBranch.lon ],
                    images: [...tempBranch.images]
                });
            })()
        }
    }, [params.id]);

    const handleChangeValues = useCallback((val, key) =>    {
        if(key === 'map'){
            const coords = val.get('coords');

            setValues({
                ...values,
                lat: coords[0],
                lon: coords[1],
            });
        }else if(key === 'images'){
            const {files} = val.target;
            const imagesList = [...values.images];

            [...files].forEach((file) => {
                file._src = URL.createObjectURL(file);

                imagesList.push(file);
            });

            if (imagesList.length > 10) {
                toast.info('max images limit');
                imagesList.length = 10;
            }

            setValues({
                ...values,
                images: [...imagesList],
            });
            val.target.value = '';
        }else{
            setValues({
                ...values,
                [key]: val,
            })
        }
    }, [values]);

    const handleDeleteImage = useCallback(({src, name}) => {
        if (src) {
            setValues({
                ...values,
                images: values.images.filter((image => image._src !== src))
            })
        } else if (name) {
            setValues({
                ...values,
                images: values.images.filter((image => image.name !== name))
            })
        }
    }, [values]);

    const handleAddBranch = useCallback(async () => {
        const validateValues = [
            Validator.validPhoneNum(values.phoneNum.slice(1)),
            Validator.validString(values.title),
            Validator.validString(values.location),
            Validator.validString(values.country),
            Validator.validString(values.city),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (!values.images.length) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addBranchRequest({
            title: values.title,
            location: values.location,
            lat: values.lat,
            lon: values.lon,
            phoneNum: values.phoneNum.slice(1),
            city: values.city,
            country: values.country,
            main: values.main,
            images: values.images,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Branch added successfully');
        navigate(`/maps`);
    }, [values]);

    const handleDelete = useCallback(async () => {
        const data = await dispatch(deleteBranchRequest({id: values.id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Branch deleted successfully');
        navigate(`/maps`);
    }, [values]);

    const drawData = [
        {
            path: ['map'],
            label: 'Map',
            disabled: !values.id,
        },
        {
            path: ['title'],
            label: 'Title',
            disabled: !!values.id,
        },
        {
            path: ['country'],
            label: 'Country',
            disabled: !!values.id,
        },
        {
            path: ['city'],
            label: 'City',
            disabled: !!values.id,
        },
        {
            path: ['location'],
            label: 'Location',
            disabled: !!values.id,
        },
        {
            path: ['lat'],
            label: 'Lat',
            disabled: !!values.id,
        },
        {
            path: ['lon'],
            label: 'Lon',
            disabled: !!values.id,
        },
        {
            path: ['phoneNum'],
            label: 'Phone',
            disabled: !!values.id,
        },
        {
            path: ['main'],
            label: 'Main branch',
            disabled: !!values.id,
        },
        {
            path: ['images'],
            label: 'Select images',
            disabled: !!values.id,
        },
        {
            path: ['imagesList'],
            label: 'Images list',
            handleDelete: handleDeleteImage,
        },
    ];

    return (
        <Wrapper
            pageName={`branch${values.id ? ' - ' + values.title : ''}`}
            uploadProcess={uploadProcess}
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
        >
            <TopBar
                pageName={`branch${values.id ? ' - ' + values.title : ''}`}
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={values}
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
                    values.id ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleAddBranch}
                        >
                            Add
                        </button>
                    )
                }
            </div>
        </Wrapper>
    );
}

export default SingleBranch;
