import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addBranchRequest, deleteBranchRequest, singleBranchRequest} from "../store/actions/map";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import Wrapper from "../components/Wrapper";
import PhoneInput from "react-phone-number-input";
import moment from "moment/moment";
import ImagesList from "../components/ImagesList";
import {useNavigate, useParams} from "react-router-dom";
import ru from 'react-phone-number-input/locale/ru';
import TopBar from "../components/TopBar";
import YandexMap from "../components/YandexMap";

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
    const [center, setCenter] = useState([0, 0]);
    const [images, setImages] = useState([]);
    const [values, setValues] = useState({
        title: '',
        location: '',
        lat: '',
        lon: '',
        phone: '',
        city: '',
        country: '',
        main: false
    });

    useEffect(() => {
        if (params.slugName) {
            (async () => {
                const data = await dispatch(singleBranchRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                const tempBranch = {...data.payload.singleBranch};

                setImages([...tempBranch.images]);
                setValues({
                    ...tempBranch,
                    main: tempBranch.main === 'main'
                });
                setCenter([
                    tempBranch.lat,
                    tempBranch.lon
                ]);
            })()
        }
    }, [params.slugName]);

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        })
    }, [values]);

    const handleChangeImages = useCallback((e) => {
        const {files} = e.target;
        const imagesList = [...images];

        [...files].forEach((file) => {
            file._src = URL.createObjectURL(file);

            imagesList.push(file);
        });

        if (imagesList.length > 10) {
            toast.info('max images limit');
            imagesList.length = 10;
        }

        setImages(imagesList);
        e.target.value = '';
    }, [images]);

    const handleDeleteImage = useCallback(({src, name}) => {
        if (src) {
            setImages(images.filter((image => image._src !== src)));
        } else if (name) {
            setImages(images.filter((image => image.name !== name)));
        }
    }, [images]);

    const onMapClick = useCallback((e) => {
        const coords = e.get('coords');

        setValues({
            ...values,
            lat: coords[0],
            lon: coords[1],
        });
    }, [values]);

    const handleAddBranch = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.location),
            Validator.validGeometry(values.lat),
            Validator.validGeometry(values.lon),
            Validator.validPhoneNum(values.phone.slice(1)),
            Validator.validCountry(values.country),
            Validator.validCity(values.city),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (!images.length) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addBranchRequest({
            title: values.title,
            location: values.location,
            lat: values.lat,
            lon: values.lon,
            phone: values.phone.slice(1),
            city: values.city,
            country: values.country,
            main: values.main,
            images,
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
    }, [images, values]);

    const handleDelete = useCallback(async () => {
        const data = await dispatch(deleteBranchRequest({id: values.id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Branch deleted successfully');
        navigate(`/maps`);
    }, [values]);

    // const handleUpdateBranch = useCallback(async () => {
    //     if (values.title.length < 2
    //         && values.location.length < 2
    //         && !values.lat
    //         && !values.lon
    //         && !images.length) {
    //         toast.error("Fill one of fields");
    //         return;
    //     }
    //
    //     const data = await dispatch(updateBranchRequest({
    //         slugName: branch.slugName,
    //         title: values.title || undefined,
    //         location: values.location || undefined,
    //         lat: values.lat || undefined,
    //         lon: values.lon || undefined,
    //         images: images.length ? images : undefined,
    //         onUploadProcess: (ev) => {
    //             const {total, loaded} = ev;
    //             setUploadProcess(loaded / total * 100);
    //         }
    //     }));
    //
    //     if (data.error) {
    //         toast.error(data.error.message);
    //     } else if (data.payload?.status === 'ok') {
    //         await dispatch(allBranchesListRequest());
    //         openCloseModal();
    //     }
    // }, [images, values, branch]);

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
            <div className="container mb-3">
                <YandexMap
                    singleBranch={values.id ? values : {}}
                    onMapClick={onMapClick}
                    center={center[0] !== 0 ? center : [40.786543, 43.838250]}
                    allowMapClick={!params.slugName}
                />
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Title"
                    value={values.title}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'title')
                    }}
                />
                <label htmlFor="title">Title</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="country"
                    placeholder="Country"
                    value={values.country}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'country')
                    }}
                />
                <label htmlFor="country">Country</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="city"
                    placeholder="City"
                    value={values.city}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'city')
                    }}
                />
                <label htmlFor="city">City</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Location"
                    value={values.location}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'location')
                    }}
                />
                <label htmlFor="location">Location</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Lat"
                    value={values.lat}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'lat')
                    }}
                />
                <label htmlFor="lat">Lat</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Lat"
                    value={values.lon}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'lon')
                    }}
                />
                <label htmlFor="lon">Lon</label>
            </div>
            {
                !values.id ? (
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Select Image</label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            accept="image/*"
                            multiple={true}
                            onChange={handleChangeImages}
                        />
                    </div>
                ) : null
            }
            <div className='mb-3'>
                <label htmlFor="admin-phone">Phone</label>
                <PhoneInput
                    international
                    labels={ru}
                    defaultCountry="RU"
                    id='admin-phone'
                    disabled={!!values.id}
                    value={values.id ? `+${values.phone}` : values.phone}
                    onChange={(num) => {
                        handleChangeValues(num, 'phone')
                    }}
                />
            </div>
            <div className="form-check form-switch mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    checked={values.main}
                    disabled={!!values.id}
                    onChange={(e) => {
                        handleChangeValues(!values.main, 'main')
                    }}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                    Main branch
                </label>
            </div>
            {
                values.id ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(values.createdAt).format('LLL')}
                            </p>
                            <label htmlFor="floatingInput">Created At</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(values.updatedAt).format('LLL')}
                            </p>
                            <label htmlFor="floatingInput">Last Update</label>
                        </div>
                    </>
                ) : null
            }
            <div className="image-list">
                {
                    values.id || !_.isEmpty(images) ? (
                        images.map(image => (
                            <ImagesList
                                key={image.id || image._src}
                                image={image}
                                handleDeleteImage={handleDeleteImage}
                            />
                        ))
                    ) : null
                }
            </div>
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

{/*<YMaps*/}
{/*    query={{*/}
{/*        ns: 'use-load-option'*/}
{/*    }}>*/}
{/*    <Map*/}
{/*        modules={["geocode"]}*/}
{/*        width="100%"*/}
{/*        height="100%"*/}
{/*        onClick={(e) => {*/}
{/*            if (!values.id) onMapClick(e);*/}
{/*        }}*/}
{/*        defaultState={{*/}
{/*            center: center[0] !== 0 ? center : [40.786543, 43.838250],*/}
{/*            zoom: 12,*/}
{/*        }}*/}
{/*    >*/}
{/*        {*/}
{/*            values.id ? (*/}
{/*                <YandexPlacemark*/}
{/*                    geometry={[+values.lat, +values.lon]}*/}
{/*                    slugName=''*/}
{/*                />*/}
{/*            ) : null*/}
{/*        }*/}
{/*    </Map>*/}
{/*</YMaps>*/}
