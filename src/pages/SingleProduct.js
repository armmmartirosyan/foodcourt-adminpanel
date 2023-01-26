import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {allCategoriesListRequest} from "../store/actions/categories";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import {
    addProductRequest,
    deleteProductRequest,
    singleProductRequest,
    updateProductRequest
} from "../store/actions/products";
import Validator from "../helpers/Validator";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

function SingleProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.productsGetSingleStatus);
    const statusAdd = useSelector(state => state.status.productsAddStatus);
    const statusUpdate = useSelector(state => state.status.productsUpdateStatus);
    const statusDelete = useSelector(state => state.status.productsDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [product, setProduct] = useState({});
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
                const data = await dispatch(singleProductRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                const tempProduct = data?.payload?.product;

                setProduct({...tempProduct});
                setValues({
                    ...values,
                    title: tempProduct.title,
                    description: tempProduct.description,
                    price: tempProduct.price,
                    categoryId: [...(tempProduct?.categories?.map(c => c.id) || [])],
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

    const handleAddProduct = useCallback(async () => {
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
        if (!values.image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addProductRequest({
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

        toast.success('Product added successfully.');
        navigate('/products');
    }, [values]);

    const handleUpdateProduct = useCallback(async () => {
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

        if (!values.title && !values.categorySlug
            && !values.description && !values.price
            && !values.image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateProductRequest({
            id: product.id,
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

        toast.success('Product updated successfully.');
        navigate('/products');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteProductRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Product deleted successfully.');
        navigate('/products');
    }, []);

    return (
        <Wrapper
            statuses={{statusDelete, statusGetSingle, statusAdd, statusUpdate}}
            uploadProcess={uploadProcess}
            pageName={`product${product.title ? ' - ' + product.title : ''}`}
        >
            <TopBar
                pageName={`product${product.title ? ' - ' + product.title : ''}`}
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={product}
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
                    !_.isEmpty(product) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, product.id)
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
                        !_.isEmpty(product) ? handleUpdateProduct : handleAddProduct
                    }
                >
                    {
                        !_.isEmpty(product) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleProduct;
