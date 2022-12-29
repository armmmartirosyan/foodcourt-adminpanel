import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {addBranchRequest, allBranchesListRequest, deleteBranchRequest, updateBranchRequest} from "../store/actions/map";
import Modal from "react-modal";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import {Map, Placemark, YMaps} from "react-yandex-maps";
import TopBar from "../components/TopBar";
import Validator from "../helpers/Validator";

const {REACT_APP_API_URL} = process.env;

function Branches() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const branches = useSelector(state => state.map?.branches);
    const statusGetAll = useSelector(state => state.status.branchesGetAllStatus);
    const statusAdd = useSelector(state => state.status.branchAddStatus);
    const statusUpdate = useSelector(state => state.status.branchUpdateStatus);
    const statusDelete = useSelector(state => state.status.branchDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [branch, setBranch] = useState({});
    const [images, setImages] = useState([]);
    const [values, setValues] = useState({
        title: '',
        location: '',
        lat: '',
        lon: '',
    });

    useEffect(() => {
        (async () => {
            await dispatch(allBranchesListRequest());
        })()
    }, []);

    const openCloseModal = useCallback((branchObj) => {
        if (!_.isEmpty(branchObj)) {
            setBranch(branchObj);
            setImages([...branchObj.images]);
            setValues({
                title: branchObj.title,
                location: branchObj.location,
                lat: branchObj.lat,
                lon: branchObj.lon,
            });
        }

        if (modalIsOpen) {
            setBranch({});
            setImages([]);
            setValues({
                title: '',
                location: '',
                lat: '',
                lon: '',
            });
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddBranch = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.location),
            Validator.validGeometry(values.lat),
            Validator.validGeometry(values.lon),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
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
            images,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allBranchesListRequest());
            openCloseModal();
            toast.success('Branch added successfully');
        }
    }, [images, values]);

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

    const handleDelete = useCallback(async () => {
        const data = await dispatch(deleteBranchRequest({slugName: branch.slugName}));

        if(data.error){
            toast.error(data.error.message);
        }else if (data.payload.status === 'ok') {
            await dispatch(allBranchesListRequest());
            openCloseModal();
            toast.success('Branch deleted successfully');
        }
    }, [branch]);

    const onMapClick = useCallback((e) => {
        const coords = e.get('coords');

        setValues({
            ...values,
            lat: coords[0],
            lon: coords[1],
        });
        openCloseModal();
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
            pageName='branches'
            uploadProcess={uploadProcess}
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        openCloseModal={openCloseModal}
                        pageName='branch'
                    />
                    <div className="container">
                        <YMaps
                            query={{
                                ns: 'use-load-option'
                            }}>
                            <Map
                                modules={["geocode"]}
                                onClick={(e) => {if(admin && admin.possibility !== 'junior') onMapClick(e)}}
                                width="100%"
                                height="100%"
                                defaultState={{
                                    center: [40.786543, 43.838250],
                                    zoom: 14,
                                }}>
                                {
                                    branches?.length ? (
                                        branches.map(branchObj => (
                                            <Placemark
                                                key={branchObj.id}
                                                //modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                                defaultGeometry={[branchObj.lat, branchObj.lon]}
                                                onClick={() => {
                                                    openCloseModal(branchObj)
                                                }}
                                                // properties={{
                                                //     balloonContentHeader: `${branchObj.title}`,
                                                //     balloonContentBody: `${branchObj.location}`,
                                                //     balloonContentFooter: '',
                                                // }}
                                                options={{
                                                    preset: 'islands#geolocationIcon',
                                                    iconColor: 'red',
                                                }}
                                            />
                                        ))
                                    ) : null
                                }
                            </Map>
                        </YMaps>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                className="modal"
                overlayClassName="overlay"
                onRequestClose={() => {
                    openCloseModal()
                }}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {openCloseModal()}}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        {`${!_.isEmpty(branch) ? 'Update' : 'Add'} branch`}
                    </h6>
                    <div className="modal-img-list">
                        {
                            !_.isEmpty(branch) || !_.isEmpty(images) ? (
                                images.map(image => (
                                    <figure
                                        className='modal-img-container'
                                        key={image._src || image.id}
                                    >
                                        <img
                                            src={image._src || `${REACT_APP_API_URL}/${image.name}`}
                                            alt="image"
                                            className='modal-img'
                                        />
                                        {
                                            image.type ? (
                                                <div
                                                    className="modal-img-delete"
                                                    onClick={() => {
                                                        handleDeleteImage({src: image._src} || {name: image.name})
                                                    }}
                                                >
                                                    X
                                                </div>
                                            ) : null
                                        }
                                    </figure>
                                ))
                            ) : null
                        }
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Title"
                            value={values.title}
                            disabled={!_.isEmpty(branch)}
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
                            id="title"
                            placeholder="Location"
                            value={values.location}
                            disabled={!_.isEmpty(branch)}
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
                            disabled={!_.isEmpty(branch)}
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
                            disabled={!_.isEmpty(branch)}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'lon')
                            }}
                        />
                        <label htmlFor="lon">Lon</label>
                    </div>
                    {
                        _.isEmpty(branch) ? (
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
                    {
                        !_.isEmpty(branch) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{branch.slugName}</p>
                                    <label htmlFor="floatingInput">Slug Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(branch.createdAt).format('LLL')}
                                    </p>
                                    <label htmlFor="floatingInput">Created At</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(branch.updatedAt).format('LLL')}
                                    </p>
                                    <label htmlFor="floatingInput">Last Update</label>
                                </div>
                            </>
                        ) : null
                    }

                    <div className='modal-btn-container'>
                        <div>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    openCloseModal()
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        {
                            !_.isEmpty(branch) ? (
                                <button
                                    className="btn btn-danger"
                                    disabled={admin && admin.possibility === 'junior'}
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
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Branches;
