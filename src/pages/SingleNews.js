import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
    addNewsRequest,
    deleteNewsRequest,
    singleNewsRequest,
    updateNewsRequest
} from "../store/actions/news";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import SingleImage from "../components/SingleImage";
import moment from "moment/moment";
import TopBar from "../components/TopBar";
import Wrapper from "../components/Wrapper";

function SingleNews() {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const statusGetSingle = useSelector(state => state.status.newsGetSingleStatus);
    const statusAdd = useSelector(state => state.status.newsAddStatus);
    const statusUpdate = useSelector(state => state.status.newsUpdateStatus);
    const statusDelete = useSelector(state => state.status.newsDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [news, setNews] = useState({});
    const [image, setImage] = useState({});
    const [values, setValues] = useState({
        title: '',
        description: '',
    });

    useEffect(() => {
        if(params.slugName){
            (async () => {
                const data = await dispatch(singleNewsRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }

                setValues({
                    title: data.payload.singleNews.title,
                    description: data.payload.singleNews.description,
                });
                setNews({...data.payload.singleNews});
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

    const handleAddNews = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.description),
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

        const data = await dispatch(addNewsRequest({
            title: values.title,
            description: values.description,
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

        toast.success('News added successfully.');
        navigate('/news');
    }, [image, values]);

    const handleUpdateNews = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validTitle(values.title) : true,
            values.description ? Validator.validDesc(values.description) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description && !image.type) {
            toast.error("Fill one of fields!");
            return;
        }

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

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('News updated successfully.');
        navigate('/news');
    }, [image, values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteNewsRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('News deleted successfully.');
        navigate('/news');
    }, []);

    return (
        <Wrapper
            statuses={{statusGetSingle, statusAdd, statusDelete, statusUpdate}}
            uploadProcess={uploadProcess}
            pageName={`news${news.title ? ' - ' + news.title : ''}`}
        >
            <TopBar
                pageName={`news${news.title ? ' - ' + news.title : ''}`}
                allowAdd={false}
            />
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
                !_.isEmpty(news) ? (
                    <>
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
                    !_.isEmpty(news) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, news.id)
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
                        !_.isEmpty(news) ? handleUpdateNews : handleAddNews
                    }
                >
                    {
                        !_.isEmpty(news) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleNews;
