import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import Validator from "../helpers/Validator";
import {toast} from "react-toastify";
import {addOfferRequest, deleteOfferRequest, singleOfferRequest, updateOfferRequest} from "../store/actions/offers";
import Helper from "../helpers/Helper";
import SingleImage from "../components/SingleImage";
import Select from "react-select";
import moment from "moment/moment";
import Wrapper from "../components/Wrapper";
import {allCategoriesListRequest} from "../store/actions/categories";
import TopBar from "../components/TopBar";

function SingleOffer() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const statusGetSingle = useSelector(state => state.status.offersGetSingleStatus);
    const statusAdd = useSelector(state => state.status.offersAddStatus);
    const statusUpdate = useSelector(state => state.status.offersUpdateStatus);
    const statusDelete = useSelector(state => state.status.offersDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [offer, setOffer] = useState({});
    const [image, setImage] = useState({});
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: 0,
        categoryId: [],
    });

    useEffect(() => {
        (async () => {
            const data = await dispatch(allCategoriesListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

            const list = data.payload.categories.map(cat => {
                return {value: cat.id, label: cat.name}
            });

            setCategories(list);
        })()
    }, []);

    useEffect(() => {
        if (params.slugName) {
            (async () => {
                const data = await dispatch(singleOfferRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                setOffer({...data.payload.offer});
                setValues({
                    title: data.payload.offer.title,
                    description: data.payload.offer.description,
                    price: data.payload.offer.price,
                    categoryId: [...data.payload.offer.categories.map(c => c.id)]
                });
            })()
        }
    }, [params.slugName]);

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        })
    }, [values]);

    const handleChangeImage = useCallback((e) => {
        const {files} = e.target;

        if (files.length) {
            files[0]._src = URL.createObjectURL(files[0]);
            setImage(files[0]);
        } else {
            setImage({});
        }
    }, []);

    const handleAddOffer = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.description),
            Validator.validPrice(values.price),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (_.isEmpty(values.categoryId)) {
            toast.error(`Select category(at least 1 category!)`);
            return;
        }
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addOfferRequest({
            title: values.title,
            description: values.description,
            price: values.price,
            categoryId: values.categoryId,
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

        toast.success('Offer added successfully.');
        navigate('/offers');
    }, [image, values]);

    const handleUpdateOffer = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validTitle(values.title) : true,
            values.description ? Validator.validDesc(values.description) : true,
            values.price || values.price === 0 ? Validator.validPrice(values.price) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description
            && !values.price && !image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateOfferRequest({
            slugName: offer.slugName,
            title: values.title || undefined,
            description: values.description || undefined,
            price: values.price || undefined,
            categoryId: !_.isEmpty(values.categoryId) ? values.categoryId : undefined,
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

        toast.success('Offer updated successfully.');
        navigate('/offers');
    }, [image, values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteOfferRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Offer deleted successfully.');
        navigate('/offers');
    }, []);

    return (
        <Wrapper
            statuses={{statusGetSingle, statusAdd, statusDelete, statusUpdate}}
            uploadProcess={uploadProcess}
            pageName={`offer${offer.title ? ' - ' + offer.title : ''}`}
        >
            <TopBar
                pageName={`offer${offer.title ? ' - ' + offer.title : ''}`}
                allowAdd={false}
            />
            {
                !_.isEmpty(offer) || !_.isEmpty(image) ? (
                    <SingleImage
                        image={image}
                        obj={offer}
                        handleChangeImage={handleChangeImage}
                    />
                ) : null
            }
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Title"
                    value={values.title}
                    disabled={admin && admin.role === 'manager'}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'title')
                    }}
                />
                <label htmlFor="title">Title</label>
            </div>
            <div className="form-floating mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Description"
                            id="description"
                            style={{height: '150px'}}
                            value={values.description}
                            disabled={admin && admin.role === 'manager'}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'description')
                            }}
                        />
                <label htmlFor="description">Description</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="number"
                    className="form-control"
                    id="price"
                    placeholder="Price(AMD)"
                    value={values.price}
                    disabled={admin && admin.role === 'manager'}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'price')
                    }}
                />
                <label htmlFor="price">Price(AMD)</label>
            </div>
            {
                !_.isEmpty(categories)
                && (!_.isEmpty(offer) || !params.slugName) ? (
                    <div className="mb-3">
                        <label htmlFor="category-list" className="form-label">Select Categories</label>
                        <Select
                            defaultValue={!_.isEmpty(offer) ?
                                offer.categories.map(cat => {
                                    return {value: cat.id, label: cat.name}
                                }) : undefined
                            }
                            isMulti
                            name="colors"
                            options={categories}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(data) => {
                                handleChangeValues(data.map(d => d.value), "categoryId")
                            }}
                            id='category-list'
                        />
                    </div>
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
                !_.isEmpty(offer) ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(offer.createdAt).format('LLL')}
                            </p>
                            <label>Created At</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(offer.updatedAt).format('LLL')}
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
                    !_.isEmpty(offer) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, offer.id)
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
                        !_.isEmpty(offer) ? handleUpdateOffer : handleAddOffer
                    }
                >
                    {
                        !_.isEmpty(offer) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleOffer;
