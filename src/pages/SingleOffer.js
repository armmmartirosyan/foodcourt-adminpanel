import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import Validator from "../helpers/Validator";
import {toast} from "react-toastify";
import {addOfferRequest, deleteOfferRequest, singleOfferRequest, updateOfferRequest} from "../store/actions/offers";
import Helper from "../helpers/Helper";
import Wrapper from "../components/Wrapper";
import {allCategoriesListRequest} from "../store/actions/categories";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

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
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: 0,
        categoryId: [],
        image: {},
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
            path: ['price'],
            label: 'Price(AMD)',
            disabled: false,
        },
        {
            path: ['categories'],
            label: 'Select Categories',
            array: [...categories],
            disabled: false,
        },
        {
            path: ['imageSelect'],
            label: 'Select Image',
            disabled: false,
        },
    ];

    useEffect(() => {
        (async () => {
            const data = await dispatch(allCategoriesListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
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
                    return;
                }

                const tempOffer = data?.payload?.offer

                setOffer({...tempOffer});
                setValues({
                    ...values,
                    title: tempOffer.title,
                    description: tempOffer.description,
                    price: tempOffer.price,
                    categoryId: [...tempOffer.categories.map(c => c.id)]
                });
            })()
        }
    }, [params.slugName]);

    const handleChangeValues = useCallback((val, key) => {
        if(key === 'image' && val.target
            && !_.isEmpty(val.target.files)){
            const {files} = val.target;

            files[0]._src = URL.createObjectURL(files[0]);
            setValues({
                ...values,
                [key]: files[0],
            });
        }else if(key === 'image'){
            setValues({
                ...values,
                [key]: {},
            });
        }else if(key === 'categories'){
            const ids = val.map(d => d.value);

            setValues({
                ...values,
                categoryId: ids
            });
        }else{
            setValues({
                ...values,
                [key]: val,
            });
        }
    }, [values]);

    const handleAddOffer = useCallback(async () => {
        const validateValues = [
            Validator.validString(values.title),
            Validator.validString(values.description),
            Validator.validNumGreatOne(values.price),
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
        if (!values.image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addOfferRequest({
            title: values.title,
            description: values.description,
            price: values.price,
            categoryId: values.categoryId,
            image: values.image,
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
    }, [values]);

    const handleUpdateOffer = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validString(values.title) : true,
            values.description ? Validator.validString(values.description) : true,
            values.price || values.price === 0 ? Validator.validNumGreatOne(values.price) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description
            && !values.price && !values.image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateOfferRequest({
            id: offer.id,
            title: values.title || undefined,
            description: values.description || undefined,
            price: values.price || undefined,
            categoryId: !_.isEmpty(values.categoryId) ? values.categoryId : undefined,
            image: values.image.type ? values.image : undefined,
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
    }, [values]);

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

            <Single
                drawData={drawData}
                obj={offer}
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
