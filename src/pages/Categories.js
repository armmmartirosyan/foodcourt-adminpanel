import React, {useCallback, useEffect, useState} from 'react';
import _ from "lodash";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {
    allCategoriesListRequest,
} from "../store/actions/categories";
import {toast} from "react-toastify";
import TopBar from "../components/TopBar";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import EmptyPage from "../components/EmptyPage";
import Table from "../components/Table";
import Helper from "../helpers/Helper";

const tableHeader = [
    {
        path:'imagePath',
        label:'Image',
    },
    {
        path:'name',
        label:'Name',
    },
];

function Categories() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const categories = useSelector(state => state.categories.categories);
    const statusGetAll = useSelector(state => state.status.categoriesGetAllStatus);
    const [searchName, setSearchName] = useState(qs.parse(location.search).name || '');
    const [myTimeout, setMyTimeout] = useState();

    useEffect(() => {
        const newName = qs.parse(location.search).name;

        (async () => {
            const data = await dispatch(allCategoriesListRequest({name: newName}));

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }
        })()
    }, [location.search]);

    const searchChange = useCallback((val) => {
        const query = qs.stringify({name: val || null}, {skipNull: true});
        setSearchName(val);

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/categories${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='categories'
        >
            <TopBar
                search={searchName}
                searchChange={searchChange}
                pageName='categories'
                allowAdd={true}
            />
            {
                !_.isEmpty(categories) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={categories}
                        path='categories'
                    />
                ) : <EmptyPage/>
            }
        </Wrapper>
    );
}

export default Categories;


// import React, {useCallback, useEffect, useState} from 'react';
// import _ from "lodash";
// import Modal from "react-modal";
// import Wrapper from "../components/Wrapper";
// import {useDispatch, useSelector} from "react-redux";
// import {
//     addCategoryRequest,
//     allCategoriesListRequest,
//     deleteCategoryRequest,
//     updateCategoryRequest
// } from "../store/actions/categories";
// import {toast} from "react-toastify";
// import moment from "moment";
// import TopBar from "../components/TopBar";
// import SingleImage from "../components/SingleImage";
// import qs from "query-string";
// import {useLocation, useNavigate} from "react-router-dom";
// import Validator from "../helpers/Validator";
// import EmptyPage from "../components/EmptyPage";
// import Table from "../components/Table";
// import Helper from "../helpers/Helper";
//
// const tableHeader = [
//     {
//         path:'imagePath',
//         label:'Image',
//     },
//     {
//         path:'name',
//         label:'Name',
//     },
// ];
//
// function Categories() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const categories = useSelector(state => state.categories.categories);
//     const statusGetAll = useSelector(state => state.status.categoriesGetAllStatus);
//     const statusAdd = useSelector(state => state.status.categoriesAddStatus);
//     const statusUpdate = useSelector(state => state.status.categoriesUpdateStatus);
//     const statusDelete = useSelector(state => state.status.categoriesDeleteStatus);
//     const admin = useSelector(state => state.admin.admin);
//     const [uploadProcess, setUploadProcess] = useState(100);
//     const [searchName, setSearchName] = useState(qs.parse(location.search).name || '');
//     const [name, setName] = useState('');
//     const [image, setImage] = useState({});
//     const [category, setCategory] = useState({});
//     const [myTimeout, setMyTimeout] = useState();
//
//     useEffect(() => {
//         const newName = qs.parse(location.search).name;
//
//         (async () => {
//             const data = await dispatch(allCategoriesListRequest({name: newName}));
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, [location.search]);
//
//     const handleChangeName = useCallback((e) => {
//         setName(e.target.value);
//     }, []);
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
//     const openCloseModal = useCallback((cat) => {
//         if (!_.isEmpty(cat)) {
//             setCategory(cat);
//             setName(cat.name);
//         }
//
//         if (modalIsOpen) {
//             setCategory({});
//             setName('');
//             setImage({});
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const handleAddCategory = useCallback(async () => {
//         const validateValues = [
//             Validator.validName(name),
//         ];
//
//         const invalidVal = validateValues.find((v) => v!==true);
//
//         if(invalidVal){
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//         if (!image.type) {
//             toast.error("Select image!");
//             return;
//         }
//
//         const data = await dispatch(addCategoryRequest({
//             name,
//             image,
//             onUploadProcess: (ev) => {
//                 const {total, loaded} = ev;
//                 setUploadProcess(loaded / total * 100);
//             }
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(allCategoriesListRequest());
//         openCloseModal();
//         toast.success('Category added successfully');
//     }, [image, name]);
//
//     const handleUpdateCategory = useCallback(async () => {
//         const validateValues = [
//             name ? Validator.validName(name) : true,
//         ];
//
//         const invalidVal = validateValues.find((v) => v!==true);
//
//         if(invalidVal){
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//
//         if (!name && !image.type) {
//             toast.error("Either fill name field, either select new image!");
//             return;
//         }
//
//         const data = await dispatch(updateCategoryRequest({
//             slugName: category.slugName,
//             name: name || undefined,
//             image: image.type ? image : undefined,
//             onUploadProcess: (ev) => {
//                 const {total, loaded} = ev;
//                 setUploadProcess(loaded / total * 100);
//             }
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(allCategoriesListRequest());
//         openCloseModal();
//         toast.success('Category added successfully');
//     }, [image, name]);
//
//     const searchChange = useCallback((val) => {
//         const query = qs.stringify({name: val || null}, {skipNull: true});
//         setSearchName(val);
//
//         clearTimeout(myTimeout);
//
//         setMyTimeout(setTimeout(() => {
//             navigate(`/categories${query ? `?${query}` : ''}`);
//         }, 400));
//     }, [myTimeout]);
//
//     const handleDelete = useCallback(async (e, id) => {
//         e.stopPropagation();
//         const data = await dispatch(deleteCategoryRequest({id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(allCategoriesListRequest());
//         toast.success('Category deleted successfully.');
//     }, []);
//
//     return (
//         <Wrapper
//             statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
//             uploadProcess={uploadProcess}
//             pageName='categories'
//         >
//             <div className="col-12">
//                 <div className="bg-light rounded h-100 p-4">
//                     <TopBar
//                         search={searchName}
//                         searchChange={searchChange}
//                         openCloseModal={openCloseModal}
//                         pageName='categories'
//                     />
//                     {
//                         !_.isEmpty(categories) ? (
//                             <Table
//                                 tableHeader={tableHeader}
//                                 list={categories}
//                                 handleDelete={handleDelete}
//                                 openCloseModal={openCloseModal}
//                             />
//                         ) : <EmptyPage/>
//                     }
//                 </div>
//             </div>
//
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 aria-hidden={true}
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {openCloseModal()}}
//                     >
//                         X
//                     </div>
//                     <h6 className="mb-4">
//                         {`${!_.isEmpty(category) ? 'Update' : 'Add'} category`}
//                     </h6>
//                     {
//                         !_.isEmpty(category) || !_.isEmpty(image) ? (
//                             <SingleImage
//                                 image={image}
//                                 obj={category}
//                                 handleChangeImage={handleChangeImage}
//                             />
//                         ) : null
//                     }
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="floatingInput"
//                             placeholder="Name"
//                             disabled={admin && admin.role === 'manager'}
//                             value={name}
//                             onChange={handleChangeName}
//                         />
//                         <label htmlFor="name">Name</label>
//                     </div>
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
//                         !_.isEmpty(category) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{category.slugName}</p>
//                                     <label>Slug Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(category.createdAt).format('LLL')}
//                                     </p>
//                                     <label>Created At</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(category.updatedAt).format('LLL')}
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
//                                 !_.isEmpty(category) ? handleUpdateCategory : handleAddCategory
//                             }
//                         >
//                             {
//                                 !_.isEmpty(category) ? 'Update' : 'Add'
//                             }
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default Categories;
