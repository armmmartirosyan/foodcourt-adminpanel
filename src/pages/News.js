import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {addNewsRequest, allNewsListRequest, updateNewsRequest} from "../store/actions/news";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-modal";
import moment from "moment";
import NewsRow from "../components/NewsRow";
import TopBar from "../components/TopBar";
import SingleImage from "../components/SingleImage";
import {useLocation, useNavigate} from "react-router-dom";
import qs from "query-string";
import PageNumbers from "../components/PageNumbers";

function News() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const newsList = useSelector(state => state.news.news);
    const totalPages = useSelector(state => state.news.pages);
    const statusGetAll = useSelector(state => state.status.newsGetAllStatus);
    const statusAdd = useSelector(state => state.status.newsAddStatus);
    const statusUpdate = useSelector(state => state.status.newsUpdateStatus);
    const statusDelete = useSelector(state => state.status.newsDeleteStatus);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [news, setNews] = useState({});
    const [image, setImage] = useState({});
    const [title, setTitle] = useState('');
    const [values, setValues] = useState({
        title: '',
        description: '',
    });

    useEffect(() => {
        const page = qs.parse(location.search).page;
        const title = qs.parse(location.search).title;
        setCurrentPage(+page || 1);

        (async () => {
            await dispatch(allNewsListRequest({page, title}));
        })()
    }, [location.search]);

    useEffect(() => {
        let page = title ? 1 : qs.parse(location.search).page;
        page = +page || 1;
        const query = qs.stringify({page, title: title || null}, {skipNull: true});

        navigate(`/news${query ? `?${query}` : ''}`);
    }, [title]);

    const openCloseModal = useCallback((newObj) => {
        if (!_.isEmpty(newObj)) {
            setNews(newObj);
            setValues({
                title: newObj.title,
                description: newObj.description,
            });
        }

        if (modalIsOpen) {
            setNews({});
            setImage({});
            setValues({
                title: '',
                description: '',
            });
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddNews = useCallback(async () => {
        if (values.title.length < 2) {
            toast.error("Field title can't contain less than 2 symbols!");
            return;
        }
        if (values.description.length < 2) {
            toast.error("Field description can't contain less than 2 symbols!");
            return;
        }
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addNewsRequest({
            title: values.title,
            description: values.description,
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            console.log(data.error);
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allNewsListRequest({page: currentPage}));
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

    const handleUpdateNews = useCallback(async () => {
        if (values.title.length < 2
            && values.description.length < 2
            && !image.type) {
            toast.error("Fill one of fields");
            return;
        }

        const data = await dispatch(updateNewsRequest({
            slugName: news.slugName,
            title: values.title || undefined,
            description: values.description || undefined,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            console.log(data.error);
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allNewsListRequest({page: currentPage}));
            openCloseModal();
        }
    }, [image, values, currentPage]);

    const handleClickPage = useCallback((p) => {
        let query = qs.parse(location.search);
        query.page = p;
        query = qs.stringify(query, {skipNull: true});

        navigate(`/news?${query}`);
    }, [location.search]);

    return (
        <Wrapper
            searchable={true}
            setSearch={setTitle}
            statusDelete={statusDelete}
            statusGetAll={statusGetAll}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        openCloseModal={openCloseModal}
                        pageName='News'
                    />
                    {
                        !_.isEmpty(newsList) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Description</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        newsList.map(objNew => (
                                            <NewsRow
                                                news={objNew}
                                                key={objNew.id}
                                                openCloseModal={openCloseModal}
                                                page={currentPage}
                                                newsList={newsList}
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
                <div className="bg-light rounded h-100 p-4">
                    <h6 className="mb-4">
                        {`${!_.isEmpty(news) ? 'Update' : 'Add'} product`}
                    </h6>
                    {
                        !_.isEmpty(news) || !_.isEmpty(image) ? (
                            <SingleImage
                                image={image}
                                obj={news}
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
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'description')
                            }}
                        />
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Select Image</label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                    </div>
                    {
                        !_.isEmpty(news) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{news.slugName}</p>
                                    <label>Slug Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(news.createdAt).format('LLL')}
                                    </p>
                                    <label>Created At</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(news.updatedAt).format('LLL')}
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
                        {
                            statusAdd === 'pending' || statusUpdate === 'pending' ? (
                                <div>
                                    <Spinner animation="border" variant="primary"/>
                                    <p>{`${Math.floor(uploadProcess)}%`}</p>
                                </div>
                            ) : null
                        }
                        <button
                            className="btn btn-primary"
                            onClick={
                                !_.isEmpty(news) ? handleUpdateNews : handleAddNews
                            }
                        >
                            {
                                !_.isEmpty(news) ? 'Update' : 'Add'
                            }
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default News;
