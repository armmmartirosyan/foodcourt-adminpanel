import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {allCategoriesListRequest} from "../store/actions/categories";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import {
    addProductRequest,
    deleteProductRequest, singleProductRequest,
    updateProductRequest
} from "../store/actions/products";
import Validator from "../helpers/Validator";
import SingleImage from "../components/SingleImage";
import Select from "react-select";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";

function SingleProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const products = useSelector(state => state.products.products);
    const statusGetSingle = useSelector(state => state.status.productsGetSingleStatus);
    const statusAdd = useSelector(state => state.status.productsAddStatus);
    const statusUpdate = useSelector(state => state.status.productsUpdateStatus);
    const statusDelete = useSelector(state => state.status.productsDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [product, setProduct] = useState({});
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
                const data = await dispatch(singleProductRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                const tempProduct = data?.payload?.product;

                setProduct({...tempProduct});
                setValues({
                    title: tempProduct.title,
                    description: tempProduct.description,
                    price: tempProduct.price,
                    categoryId: [...tempProduct.categories.map(c => c.id)],
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

    const onChangeSelect = useCallback((data) => {
        const ids = data.map(d => d.value);

        setValues({
            ...values,
            categoryId: ids
        })
    }, [values]);

    const handleAddProduct = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.description),
            Validator.validPrice(values.price),
            //Validator.validSlug(values.categorySlug),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addProductRequest({
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
        }

        toast.success('Product added successfully.');
        navigate('/products');
    }, [image, values]);

    const handleUpdateProduct = useCallback(async () => {
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

        if (!values.title && !values.categorySlug
            && !values.description && !values.price
            && !image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateProductRequest({
            id: product.id,
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

        toast.success('Product updated successfully.');
        navigate('/products');
    }, [image, values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteProductRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Product deleted successfully.');
        navigate('/products');
    }, [products]);

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
            {
                !_.isEmpty(product) || !_.isEmpty(image) ? (
                    <SingleImage
                        image={image}
                        obj={product}
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
                            disabled={admin && admin.role === 'manager'}
                            value={values.description}
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
                    placeholder="Price"
                    disabled={admin && admin.role === 'manager'}
                    value={values.price}
                    onChange={(e) => {
                        handleChangeValues(e.target.value, 'price')
                    }}
                />
                <label htmlFor="price">Price(AMD)</label>
            </div>
            {
                !_.isEmpty(categories)
                && (!_.isEmpty(product) || !params.slugName) ? (
                    <div className="mb-3">
                        <label htmlFor="category-select" className="form-label">Select Categories</label>
                        <Select
                            defaultValue={!_.isEmpty(product) ?
                                product.categories.map(cat => {
                                    return {value: cat.id, label: cat.name}
                                }) : undefined
                            }
                            isMulti
                            name="colors"
                            options={categories}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={onChangeSelect}
                            id='category-select'
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
                !_.isEmpty(product) ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(product.createdAt).format('LLL')}
                            </p>
                            <label>Created At</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(product.updatedAt).format('LLL')}
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
