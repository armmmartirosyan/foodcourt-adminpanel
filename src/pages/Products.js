import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {
    allProductsListRequest,
} from "../store/actions/products";
import _ from 'lodash';
import {toast} from "react-toastify";
import qs from 'query-string';
import {useLocation, useNavigate} from "react-router-dom";
import TopBar from "../components/TopBar";
import PageNumbers from "../components/PageNumbers";
import EmptyPage from "../components/EmptyPage";
import {allCategoriesListRequest} from "../store/actions/categories";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:'imagePath',
        label:'Image',
    },
    {
        path:'title',
        label:'Title',
    },
    {
        path:'price',
        label:'Price',
    },
];

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const products = useSelector(state => state.products.products);
    const totalPages = useSelector(state => state.products.pages);
    const statusGetAll = useSelector(state => state.status.productsGetAllStatus);
    const statusGetCategories = useSelector(state => state.status.categoriesGetAllStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [myTimeout, setMyTimeout] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [title, setTitle] = useState(qs.parse(location.search).title || '');

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
        const page = qs.parse(location.search).page || 1;
        const newTitle = qs.parse(location.search).title;
        const category = qs.parse(location.search).category;

        (async () => {
            const data = await dispatch(allProductsListRequest({page, category, title: newTitle}));

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

            setCurrentPage(+page || 1);
            setSelectedCategoryId(category ? +category : 0);
        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/products?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        let category = qs.parse(location.search).category;
        setTitle(val);
        page = +page || 1;
        const query = qs.stringify({page, category, title: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/products${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout, location.search]);

    const onChangeCategory = useCallback((obj) => {
        let query = qs.parse(location.search);
        query.category = !_.isEmpty(obj) ? obj.value : null;
        query.page = 1;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/products?${query}`);
    }, [location.search]);

    return (
        <Wrapper
            statuses={{statusGetAll, statusGetCategories}}
            pageName='products'
        >
            <TopBar
                search={title}
                searchChange={(val) => searchChange(val)}
                pageName='products'
                categories={categories}
                onChangeCategory={onChangeCategory}
                allowAdd={true}
                selectedCategoryId={selectedCategoryId}
            />

            {
                !_.isEmpty(products) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={products}
                        path='products'
                    />
                ) : <EmptyPage/>
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
        </Wrapper>
    );
}

export default Products;


// import React, {useCallback, useEffect, useState} from 'react';
// import Wrapper from "../components/Wrapper";
// import {useDispatch, useSelector} from "react-redux";
// import Modal from "react-modal";
// import {
//     addProductRequest,
//     allProductsListRequest,
//     deleteProductRequest,
//     updateProductRequest
// } from "../store/actions/products";
// import _ from 'lodash';
// import {toast} from "react-toastify";
// import moment from "moment/moment";
// import qs from 'query-string';
// import {useLocation, useNavigate} from "react-router-dom";
// import TopBar from "../components/TopBar";
// import PageNumbers from "../components/PageNumbers";
// import SingleImage from "../components/SingleImage";
// import Validator from "../helpers/Validator";
// import EmptyPage from "../components/EmptyPage";
// import Select from "react-select";
// import {allCategoriesListRequest} from "../store/actions/categories";
// import Table from "../components/Table";
// import Helper from "../helpers/Helper";
//
// const tableHeader = [
//     {
//         path:'imagePath',
//         label:'Image',
//     },
//     {
//         path:'title',
//         label:'Title',
//     },
//     {
//         path:'price',
//         label:'Price',
//     },
// ];
//
// function Products() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const products = useSelector(state => state.products.products);
//     const categoriesList = useSelector(state => state.categories.categories);
//     const totalPages = useSelector(state => state.products.pages);
//     const statusGetAll = useSelector(state => state.status.productsGetAllStatus);
//     const statusAdd = useSelector(state => state.status.productsAddStatus);
//     const statusUpdate = useSelector(state => state.status.productsUpdateStatus);
//     const statusDelete = useSelector(state => state.status.productsDeleteStatus);
//     const admin = useSelector(state => state.admin.admin);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [uploadProcess, setUploadProcess] = useState(100);
//     const [product, setProduct] = useState({});
//     const [image, setImage] = useState({});
//     const [currentPage, setCurrentPage] = useState(1);
//     const [myTimeout, setMyTimeout] = useState();
//     const [categories, setCategories] = useState([]);
//     const [title, setTitle] = useState(qs.parse(location.search).title || '');
//     const [values, setValues] = useState({
//         title: '',
//         description: '',
//         price: 0,
//         categoryId: [],
//     });
//
//     useEffect(() => {
//         (async () => {
//             const data = await dispatch(allCategoriesListRequest());
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, []);
//
//     useEffect(() => {
//         const page = qs.parse(location.search).page || 1;
//         const newTitle = qs.parse(location.search).title;
//         const category = qs.parse(location.search).category;
//
//         setCurrentPage(+page || 1);
//
//         (async () => {
//             const data = await dispatch(allProductsListRequest({page, category, title: newTitle}));
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, [location.search]);
//
//     useEffect(() => {
//         if (!_.isEmpty(categoriesList)) {
//             const list = categoriesList.map(cat => {
//                 return {value: cat.id, label: cat.name}
//             });
//
//             setCategories(list);
//         }
//     }, [categoriesList]);
//
//     const openCloseModal = useCallback((prod) => {
//         if (!_.isEmpty(prod)) {
//             setProduct(prod);
//             setValues({
//                 title: prod.title,
//                 description: prod.description,
//                 price: prod.price,
//                 categorySlug: prod.categorySlug,
//             });
//         }
//
//         if (modalIsOpen) {
//             setProduct({});
//             setImage({});
//             setValues({
//                 title: '',
//                 description: '',
//                 price: 0,
//                 categorySlug: '',
//             });
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const handleChangeValues = useCallback((val, key) => {
//         setValues({
//             ...values,
//             [key]: val,
//         })
//     }, [values]);
//
//     const handleChangeImage = useCallback((e) => {
//         const {files} = e.target;
//
//         if (files.length) {
//             files[0]._src = URL.createObjectURL(files[0]);
//             setImage(files[0]);
//         } else {
//             setImage({});
//         }
//     }, []);
//
//     const handleClickPage = useCallback((p) => {
//         let query = qs.parse(location.search);
//         query.page = p;
//         query = qs.stringify(query, {skipNull: true});
//
//         navigate(`/products?${query}`);
//     }, [location.search]);
//
//     const searchChange = useCallback((val) => {
//         let page = val ? 1 : qs.parse(location.search).page;
//         let category = qs.parse(location.search).category;
//         setTitle(val);
//         page = +page || 1;
//         const query = qs.stringify({page, category, title: val || null}, {skipNull: true});
//
//         clearTimeout(myTimeout);
//
//         setMyTimeout(setTimeout(() => {
//             navigate(`/products${query ? `?${query}` : ''}`);
//         }, 400));
//     }, [myTimeout, location.search]);
//
//     const onChangeSelect = useCallback((data) => {
//         const ids = data.map(d => d.value);
//
//         setValues({
//             ...values,
//             categoryId: ids
//         })
//     }, [values]);
//
//     const onChangeCategory = useCallback((obj) => {
//         let query = qs.parse(location.search);
//         query.category = !_.isEmpty(obj) ? obj.value : null;
//         query = qs.stringify(query, {skipNull: true});
//
//         navigate(`/products?${query}`);
//     }, [location.search]);
//
//     const handleAddProduct = useCallback(async () => {
//         const validateValues = [
//             Validator.validTitle(values.title),
//             Validator.validDesc(values.description),
//             Validator.validPrice(values.price),
//             //Validator.validSlug(values.categorySlug),
//         ];
//
//         const invalidVal = validateValues.find((v) => v !== true);
//
//         if (invalidVal) {
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//         if (!image.type) {
//             toast.error("Select image!");
//             return;
//         }
//
//         const data = await dispatch(addProductRequest({
//             title: values.title,
//             description: values.description,
//             price: values.price,
//             categoryId: values.categoryId,
//             image,
//             onUploadProcess: (ev) => {
//                 const {total, loaded} = ev;
//                 setUploadProcess(loaded / total * 100);
//             }
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//         }
//
//         await dispatch(allProductsListRequest({page: currentPage}));
//         openCloseModal();
//         toast.success('Product added successfully.');
//     }, [image, values, currentPage]);
//
//     const handleUpdateProduct = useCallback(async () => {
//         const validateValues = [
//             values.title ? Validator.validTitle(values.title) : true,
//             values.description ? Validator.validDesc(values.description) : true,
//             values.price || values.price === 0 ? Validator.validPrice(values.price) : true,
//             /*!_.isEmpty(values.categoryId) ? Validator.validSlug(values.categorySlugs) : true,*/
//         ];
//
//         const invalidVal = validateValues.find((v) => v !== true);
//
//         if (invalidVal) {
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//
//         if (!values.title && !values.categorySlug
//             && !values.description && !values.price
//             && !image.type) {
//             toast.error("Fill one of fields!");
//             return;
//         }
//
//         const data = await dispatch(updateProductRequest({
//             slugName: product.slugName,
//             title: values.title || undefined,
//             description: values.description || undefined,
//             price: values.price || undefined,
//             categoryId: !_.isEmpty(values.categoryId) ? values.categoryId : undefined,
//             image: image.type ? image : undefined,
//             onUploadProcess: (ev) => {
//                 const {total, loaded} = ev;
//                 setUploadProcess(loaded / total * 100);
//             }
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//         }
//
//         await dispatch(allProductsListRequest({page: currentPage}));
//         openCloseModal();
//         toast.success('Product updated successfully.');
//     }, [image, values, currentPage]);
//
//     const handleDelete = useCallback(async (e, id) => {
//         e.stopPropagation();
//         const data = await dispatch(deleteProductRequest({id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         (products.length === 1 && currentPage > 1) ?
//             navigate(`/products?page=${currentPage - 1}`)
//             : await dispatch(allProductsListRequest({page: currentPage}));
//         toast.success('Product deleted successfully.');
//     }, [currentPage, products]);
//
//     return (
//         <Wrapper
//             statuses={{statusDelete, statusGetAll, statusAdd, statusUpdate}}
//             uploadProcess={uploadProcess}
//             pageName='products'
//         >
//             <div className="col-12">
//                 <div className="bg-light rounded h-100 p-4">
//                     <TopBar
//                         search={title}
//                         searchChange={(val) => searchChange(val)}
//                         openCloseModal={openCloseModal}
//                         pageName='products'
//                         categories={categories}
//                         onChangeCategory={onChangeCategory}
//                     />
//                     {
//                         !_.isEmpty(products) ? (
//                             <Table
//                                 tableHeader={tableHeader}
//                                 list={products}
//                                 handleDelete={handleDelete}
//                                 openCloseModal={openCloseModal}
//                             />
//                         ) : <EmptyPage/>
//                     }
//                     {
//                         totalPages > 1 ? (
//                             <PageNumbers
//                                 handleClickPage={handleClickPage}
//                                 totalPages={totalPages}
//                                 currentPage={currentPage}
//                             />
//                         ) : null
//                     }
//                 </div>
//             </div>
//
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {
//                             openCloseModal()
//                         }}
//                     >
//                         X
//                     </div>
//                     <h6 className="mb-4">
//                         {`${!_.isEmpty(product) ? 'Update' : 'Add'} product`}
//                     </h6>
//                     {
//                         !_.isEmpty(product) || !_.isEmpty(image) ? (
//                             <SingleImage
//                                 image={image}
//                                 obj={product}
//                                 handleChangeImage={handleChangeImage}
//                             />
//                         ) : null
//                     }
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="title"
//                             placeholder="Title"
//                             value={values.title}
//                             disabled={admin && admin.role === 'manager'}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'title')
//                             }}
//                         />
//                         <label htmlFor="title">Title</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <textarea
//                             className="form-control"
//                             placeholder="Description"
//                             id="description"
//                             style={{height: '150px'}}
//                             disabled={admin && admin.role === 'manager'}
//                             value={values.description}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'description')
//                             }}
//                         />
//                         <label htmlFor="description">Description</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="number"
//                             className="form-control"
//                             id="price"
//                             placeholder="Price"
//                             disabled={admin && admin.role === 'manager'}
//                             value={values.price}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'price')
//                             }}
//                         />
//                         <label htmlFor="price">Price(AMD)</label>
//                     </div>
//                     {
//                         !_.isEmpty(categories) ? (
//                             <div className="mb-3">
//                                 <label htmlFor="category-select" className="form-label">Select Categories</label>
//                                 <Select
//                                     defaultValue={!_.isEmpty(product) ?
//                                         product.categories.map(cat => {
//                                             return {value: cat.id, label: cat.name}
//                                         }) : undefined
//                                     }
//                                     isMulti
//                                     name="colors"
//                                     options={categories}
//                                     className="basic-multi-select"
//                                     classNamePrefix="select"
//                                     onChange={onChangeSelect}
//                                     id='category-select'
//                                 />
//                             </div>
//                         ) : null
//                     }
//                     <div className="mb-3">
//                         <label htmlFor="formFile" className="form-label">Select Image</label>
//                         <input
//                             className="form-control"
//                             type="file"
//                             id="formFile"
//                             disabled={admin && admin.role === 'manager'}
//                             accept="image/*"
//                             onChange={handleChangeImage}
//                         />
//                     </div>
//                     {
//                         !_.isEmpty(product) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{product.slugName}</p>
//                                     <label>Slug Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(product.createdAt).format('LLL')}
//                                     </p>
//                                     <label>Created At</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(product.updatedAt).format('LLL')}
//                                     </p>
//                                     <label>Last Update</label>
//                                 </div>
//                             </>
//                         ) : null
//                     }
//
//                     <div className='btn-container'>
//                         <button
//                             className="btn btn-outline-danger"
//                             onClick={() => {
//                                 openCloseModal()
//                             }}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="btn btn-primary"
//                             disabled={admin && admin.role === 'manager'}
//                             onClick={
//                                 !_.isEmpty(product) ? handleUpdateProduct : handleAddProduct
//                             }
//                         >
//                             {
//                                 !_.isEmpty(product) ? 'Update' : 'Add'
//                             }
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default Products;
