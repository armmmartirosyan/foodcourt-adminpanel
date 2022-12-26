import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import Modal from "react-modal";
import {addProductRequest, allProductsListRequest, updateProductRequest} from "../store/actions/products";
import _ from 'lodash';
import ProductRow from "../components/ProductRow";
import {toast} from "react-toastify";
import moment from "moment/moment";
import qs from 'query-string';
import {useLocation, useNavigate} from "react-router-dom";
import TopBar from "../components/TopBar";
import PageNumbers from "../components/PageNumbers";
import SingleImage from "../components/SingleImage";
import Validator from "../helpers/Validator";

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const products = useSelector(state => state.products.products);
    const totalPages = useSelector(state => state.products.pages);
    const statusGetAll = useSelector(state => state.status.productsGetAllStatus);
    const statusAdd = useSelector(state => state.status.productsAddStatus);
    const statusUpdate = useSelector(state => state.status.productsUpdateStatus);
    const statusDelete = useSelector(state => state.status.productsDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [product, setProduct] = useState({});
    const [image, setImage] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [myTimeout, setMyTimeout] = useState();
    const [title, setTitle] = useState(qs.parse(location.search).title || '');
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: 0,
        categorySlug: '',
    });


    // useMemo(() => {
    //     console.log(1)
    //     if(!qs.parse(location.search).page){
    //         let page = 1;
    //         let title = qs.parse(location.search).title;
    //         const query = qs.stringify({page, title: title || null}, {skipNull: true});
    //         navigate({
    //             pathname:location.pathname,
    //             search:query,
    //         },{replace:true});
    //         // `/products${query ? `?${query}` : ''}`
    //     }
    // }, []);

    useEffect(() => {
        const page = qs.parse(location.search).page || 1;
        const newTitle = qs.parse(location.search).title;

        // const query = qs.stringify({page, title: newTitle || null}, {skipNull: true});
        //
        // navigate({
        //     pathname:location.pathname,
        //     search:query,
        // },{replace:true});

        setCurrentPage(+page || 1);

        (async () => {
            await dispatch(allProductsListRequest({page, title: newTitle}));
        })()
    }, [location.search]);

    useEffect(() => {

    }, [title]);

    const openCloseModal = useCallback((prod) => {
        if (!_.isEmpty(prod)) {
            setProduct(prod);
            setValues({
                title: prod.title,
                description: prod.description,
                price: prod.price,
                categorySlug: prod.categorySlug,
            });
        }

        if (modalIsOpen) {
            setProduct({});
            setImage({});
            setValues({
                title: '',
                description: '',
                price: 0,
                categorySlug: '',
            });
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddProduct = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.description),
            Validator.validPrice(values.price),
            Validator.validSlug(values.categorySlug),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
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
            categorySlug: values.categorySlug,
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allProductsListRequest({page: currentPage}));

            openCloseModal();
        }
    }, [image, values, currentPage]);

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

    const handleUpdateProduct = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validTitle(values.title) : true,
            values.description ? Validator.validDesc(values.description) : true,
            values.price || values.price === 0 ? Validator.validPrice(values.price) : true,
            values.categorySlug ? Validator.validSlug(values.categorySlug) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
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
            slugName: product.slugName,
            title: values.title || undefined,
            description: values.description || undefined,
            price: values.price || undefined,
            categorySlug: values.categorySlug || undefined,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allProductsListRequest({page: currentPage}));

            openCloseModal();
        }
    }, [image, values, currentPage]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/products?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val)=>{
        setTitle(val)
        let page = val ? 1 : qs.parse(location.search).page;
        page = +page || 1;
        const query = qs.stringify({page, title: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/products${query ? `?${query}` : ''}`);
        }, 400));
    },[])

    return (
        <Wrapper
            statuses={{statusDelete, statusGetAll, statusAdd, statusUpdate}}
            setSearch={setTitle}
            search={title}
            uploadProcess={uploadProcess}
            searchChang={(val)=>searchChange(val)}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        openCloseModal={openCloseModal}
                        pageName='Product'
                    />
                    {
                        !_.isEmpty(products) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Cat. Slug Name</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        products.map(product => (
                                            <ProductRow
                                                products={products}
                                                product={product}
                                                key={product.id}
                                                openCloseModal={openCloseModal}
                                                page={currentPage}
                                            />
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        ) : null
                    }
                    {
                        totalPages > 1 ? (
                            <PageNumbers
                                handleClickPage={handleClickPage}
                                totalPages={totalPages}
                                currentPage={currentPage}
                            />
                        ) : null
                    }
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
                        {`${!_.isEmpty(product) ? 'Update' : 'Add'} product`}
                    </h6>
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
                            disabled={admin && admin.possibility === 'junior'}
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
                            disabled={admin && admin.possibility === 'junior'}
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
                            disabled={admin && admin.possibility === 'junior'}
                            value={values.price}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'price')
                            }}
                        />
                        <label htmlFor="price">Price(AMD)</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="categorySlug"
                            placeholder="Category Slug Name"
                            value={values.categorySlug}
                            disabled={admin && admin.possibility === 'junior'}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'categorySlug')
                            }}
                        />
                        <label htmlFor="categorySlug">Category Slug Name</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Select Image</label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            disabled={admin && admin.possibility === 'junior'}
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                    </div>
                    {
                        !_.isEmpty(product) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{product.slugName}</p>
                                    <label>Slug Name</label>
                                </div>
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

                    <div className='modal-btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                openCloseModal()
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={admin && admin.possibility === 'junior'}
                            onClick={
                                !_.isEmpty(product) ? handleUpdateProduct : handleAddProduct
                            }
                        >
                            {
                                !_.isEmpty(product) ? 'Update' : 'Add'
                            }
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Products;
