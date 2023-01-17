import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allNewsListRequest} from "../store/actions/news";
import TopBar from "../components/TopBar";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "query-string";
import PageNumbers from "../components/PageNumbers";
import EmptyPage from "../components/EmptyPage";
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
        path:'description',
        label:'Description',
    },
];

function News() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const newsList = useSelector(state => state.news.news);
    const totalPages = useSelector(state => state.news.pages);
    const statusGetAll = useSelector(state => state.status.newsGetAllStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [myTimeout, setMyTimeout] = useState();
    const [title, setTitle] = useState(qs.parse(location.search).title || '');

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const title = qs.parse(location.search).title;
        setCurrentPage(+page || 1);

        (async () => {
            const data = await dispatch(allNewsListRequest({page, title}));

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

        })()
    }, [location.search]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/news?${query}`);
    }, [location.search]);

    const searchChange = useCallback((val) => {
        let page = val ? 1 : qs.parse(location.search).page;
        setTitle(val);
        page = +page || 1;
        const query = qs.stringify({page, title: val || null}, {skipNull: true});

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/news${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    return (
        <Wrapper
            statuses={{statusGetAll}}
            pageName='news'
        >
            <TopBar
                searchChange={searchChange}
                search={title}
                pageName='news'
                allowAdd={true}
            />
            {
                !_.isEmpty(newsList) ? (
                    <Table
                        tableHeader={tableHeader}
                        list={newsList}
                        path='news'
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

export default News;


// import React, {useCallback, useEffect, useState} from 'react';
// import Wrapper from "../components/Wrapper";
// import {useDispatch, useSelector} from "react-redux";
// import _ from "lodash";
// import {toast} from "react-toastify";
// import {addNewsRequest, allNewsListRequest, deleteNewsRequest, updateNewsRequest} from "../store/actions/news";
// import Modal from "react-modal";
// import moment from "moment";
// import TopBar from "../components/TopBar";
// import SingleImage from "../components/SingleImage";
// import {useLocation, useNavigate} from "react-router-dom";
// import qs from "query-string";
// import PageNumbers from "../components/PageNumbers";
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
//         path:'title',
//         label:'Title',
//     },
//     {
//         path:'description',
//         label:'Description',
//     },
// ];
//
// function News() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const newsList = useSelector(state => state.news.news);
//     const totalPages = useSelector(state => state.news.pages);
//     const statusGetAll = useSelector(state => state.status.newsGetAllStatus);
//     const statusAdd = useSelector(state => state.status.newsAddStatus);
//     const statusUpdate = useSelector(state => state.status.newsUpdateStatus);
//     const statusDelete = useSelector(state => state.status.newsDeleteStatus);
//     const admin = useSelector(state => state.admin.admin);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [uploadProcess, setUploadProcess] = useState(100);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [news, setNews] = useState({});
//     const [image, setImage] = useState({});
//     const [myTimeout, setMyTimeout] = useState();
//     const [title, setTitle] = useState(qs.parse(location.search).title || '');
//     const [values, setValues] = useState({
//         title: '',
//         description: '',
//     });
//
//     useEffect(() => {
//         const page = qs.parse(location.search).page;
//         const title = qs.parse(location.search).title;
//         setCurrentPage(+page || 1);
//
//         (async () => {
//             const data = await dispatch(allNewsListRequest({page, title}));
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//
//         })()
//     }, [location.search]);
//
//     const openCloseModal = useCallback((newObj) => {
//         if (!_.isEmpty(newObj)) {
//             setNews(newObj);
//             setValues({
//                 title: newObj.title,
//                 description: newObj.description,
//             });
//         }
//
//         if (modalIsOpen) {
//             setNews({});
//             setImage({});
//             setValues({
//                 title: '',
//                 description: '',
//             });
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const handleAddNews = useCallback(async () => {
//         const validateValues = [
//             Validator.validTitle(values.title),
//             Validator.validDesc(values.description),
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
//         const data = await dispatch(addNewsRequest({
//             title: values.title,
//             description: values.description,
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
//         await dispatch(allNewsListRequest({page: currentPage}));
//         openCloseModal();
//         toast.success('News added successfully.');
//     }, [image, values, currentPage]);
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
//     const handleUpdateNews = useCallback(async () => {
//         const validateValues = [
//             values.title ? Validator.validTitle(values.title) : true,
//             values.description ? Validator.validDesc(values.description) : true,
//         ];
//
//         const invalidVal = validateValues.find((v) => v!==true);
//
//         if(invalidVal){
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//
//         if (!values.title && !values.description && !image.type) {
//             toast.error("Fill one of fields!");
//             return;
//         }
//
//         if (values.title.length < 2
//             && values.description.length < 2
//             && !image.type) {
//             toast.error("Fill one of fields");
//             return;
//         }
//
//         const data = await dispatch(updateNewsRequest({
//             slugName: news.slugName,
//             title: values.title || undefined,
//             description: values.description || undefined,
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
//         await dispatch(allNewsListRequest({page: currentPage}));
//         openCloseModal();
//         toast.success('News updated successfully.');
//     }, [image, values, currentPage]);
//
//     const handleClickPage = useCallback((p) => {
//         let query = qs.parse(location.search);
//         query.page = p;
//         query = qs.stringify(query, {skipNull: true});
//
//         navigate(`/news?${query}`);
//     }, [location.search]);
//
//     const searchChange = useCallback((val) => {
//         let page = val ? 1 : qs.parse(location.search).page;
//         setTitle(val);
//         page = +page || 1;
//         const query = qs.stringify({page, title: val || null}, {skipNull: true});
//
//         clearTimeout(myTimeout);
//
//         setMyTimeout(setTimeout(() => {
//             navigate(`/news${query ? `?${query}` : ''}`);
//         }, 400));
//     }, [myTimeout]);
//
//     const handleDelete = useCallback(async (e, id) => {
//         e.stopPropagation();
//         const data = await dispatch(deleteNewsRequest({id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         (newsList.length === 1 && currentPage > 1) ?
//             navigate(`/news?page=${currentPage-1}`)
//             : await dispatch(allNewsListRequest({page: currentPage}));
//         toast.success('News deleted successfully.');
//     }, [currentPage, newsList]);
//
//     return (
//         <Wrapper
//             statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
//             uploadProcess={uploadProcess}
//             pageName='news'
//         >
//             <div className="col-12">
//                 <div className="bg-light rounded h-100 p-4">
//                     <TopBar
//                         searchChange={searchChange}
//                         search={title}
//                         openCloseModal={openCloseModal}
//                         pageName='news'
//                     />
//                     {
//                         !_.isEmpty(newsList) ? (
//                             <Table
//                                 tableHeader={tableHeader}
//                                 list={newsList}
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
//                         onClick={() => {openCloseModal()}}
//                     >
//                         X
//                     </div>
//                     <h6 className="mb-4">
//                         {`${!_.isEmpty(news) ? 'Update' : 'Add'} news`}
//                     </h6>
//                     {
//                         !_.isEmpty(news) || !_.isEmpty(image) ? (
//                             <SingleImage
//                                 image={image}
//                                 obj={news}
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
//                         !_.isEmpty(news) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{news.slugName}</p>
//                                     <label>Slug Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(news.createdAt).format('LLL')}
//                                     </p>
//                                     <label>Created At</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(news.updatedAt).format('LLL')}
//                                     </p>
//                                     <label>Last Update</label>
//                                 </div>
//                             </>
//                         ) : null
//                     }
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
//                                 !_.isEmpty(news) ? handleUpdateNews : handleAddNews
//                             }
//                         >
//                             {
//                                 !_.isEmpty(news) ? 'Update' : 'Add'
//                             }
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default News;
