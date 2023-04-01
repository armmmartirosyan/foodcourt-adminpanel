import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import {
    addFooterSocialRequest,
    deleteFooterSocialRequest,
    getSingleFooterSocialRequest,
    updateFooterSocialRequest
} from "../store/actions/footer";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

const drawData = [
    {
        path: ['image'],
        label: 'Икона',
        disabled: false,
    },
    {
        path: ['link'],
        label: 'Ссылка',
        disabled: false,
    },
    {
        path: ['imageSelect'],
        label: 'Выберите икона',
        disabled: false,
    },
];

function SingleFooterSocial() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.socialGetSingleStatus);
    const statusAdd = useSelector(state => state.status.socialAddStatus);
    const statusUpdate = useSelector(state => state.status.socialUpdateStatus);
    const statusDelete = useSelector(state => state.status.socialDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [social, setSocial] = useState({});
    const [values, setValues] = useState({
        image: {},
        link: '',
    });

    const handleChangeValues = useCallback((val, key) => {
        if (key === 'image' && val.target && !_.isEmpty(val.target.files)) {
            const {files} = val.target;

            files[0]._src = URL.createObjectURL(files[0]);
            setValues({
                ...values,
                [key]: files[0],
            });
        } else if (key === 'image') {
            setValues({
                ...values,
                [key]: {},
            });
        } else {
            setValues({
                ...values,
                [key]: val,
            });
        }
    }, [values]);

    const handleUpdateSocial = useCallback(async () => {
        const data = await dispatch(updateFooterSocialRequest({
            id: social.id,
            image: values.image ? values.image : undefined,
            link: values.link ? values.link : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/footer');
        toast.success('Социальные сети обновлены');
    }, [social, values]);

    const handleAddSocial = useCallback(async () => {
        const data = await dispatch(addFooterSocialRequest({
            image: values.image,
            link: values.link,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/footer');
        toast.success('Социальные сети добавлены');
    }, [values]);

    const handleDeleteSocial = useCallback(async (e, id) => {
        const data = await dispatch(deleteFooterSocialRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        navigate('/footer');
        toast.success('Социальные сети удалены');
    }, []);

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(getSingleFooterSocialRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                const socialSingle = data.payload.social;
                setSocial({...socialSingle})
                setValues({
                    link: socialSingle.link,
                })
            })()
        }
    }, [params.id]);

    return (
        <Wrapper
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
            uploadProcess={uploadProcess}
            pageName='социальные сети'
        >
            <TopBar
                pageName='социальные сети'
                allowAdd={false}
            />
            <Single
                drawData={drawData}
                obj={social}
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
                    Назад
                </button>
                {
                    !_.isEmpty(social) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'админ'}
                            onClick={async (e) => {
                                await handleDeleteSocial(e, social.id)
                            }}
                        >
                            Удалить
                        </button>
                    ) : null
                }
                <button
                    className="btn btn-primary"
                    disabled={admin && admin.role === 'админ'}
                    onClick={
                        !_.isEmpty(social) ? handleUpdateSocial : handleAddSocial
                    }
                >
                    {
                        !_.isEmpty(social) ? 'Обнавить' : 'Добавить'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleFooterSocial;
