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
import TopBar from "../components/TopBar";
import Wrapper from "../components/Wrapper";
import Single from "../components/Single";

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
    const [values, setValues] = useState({
        title: '',
        description: '',
        image: {}
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
            path: ['imageSelect'],
            label: 'Select Image',
            disabled: false,
        },
    ];

    useEffect(() => {
        if(params.slugName){
            (async () => {
                const data = await dispatch(singleNewsRequest({slugName: params.slugName}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                const tempNews = data?.payload?.singleNews;

                setValues({
                    ...values,
                    title: tempNews.title,
                    description: tempNews.description,
                });
                setNews({...tempNews});
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
        }else{
            setValues({
                ...values,
                [key]: val,
            });
        }
    }, [values]);

    const handleAddNews = useCallback(async () => {
        const validateValues = [
            Validator.validString(values.title),
            Validator.validString(values.description),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if (!values.image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addNewsRequest({
            title: values.title,
            description: values.description,
            image: values.image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('News added successfully.');
        navigate('/news');
    }, [values]);

    const handleUpdateNews = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validString(values.title) : true,
            values.description ? Validator.validString(values.description) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description && !values.image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        if (values.title.length < 2
            && values.description.length < 2
            && !values.image.type) {
            toast.error("Fill one of fields");
            return;
        }

        const data = await dispatch(updateNewsRequest({
            id: news.id,
            title: values.title || undefined,
            description: values.description || undefined,
            image: values.image.type ? values.image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('News updated successfully.');
        navigate('/news');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteNewsRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
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

            <Single
                drawData={drawData}
                obj={news}
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
