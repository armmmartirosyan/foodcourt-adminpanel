import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addBranchRequest, deleteBranchRequest, singleBranchRequest, updateBranchRequest} from "../store/actions/map";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import Wrapper from "../components/Wrapper";
import {useNavigate, useParams} from "react-router-dom";
import TopBar from "../components/TopBar";
import Single from "../components/Single";
import {errorConfig} from "../helpers/ErrorConfig";

function SingleBranch() {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const statusGetSingle = useSelector(state => state.status.branchesGetSingleStatus);
    const statusAdd = useSelector(state => state.status.branchAddStatus);
    const statusUpdate = useSelector(state => state.status.branchUpdateStatus);
    const statusDelete = useSelector(state => state.status.branchDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [values, setValues] = useState({
        title: '',
        location: '',
        lat: '',
        lon: '',
        phoneNum: '',
        city: '',
        country: '',
        main: false,
        center: [0, 0],
        images: [],
    });

    useEffect(() => {
        if (params.id) {
            (async () => {
                const data = await dispatch(singleBranchRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }

                const tempBranch = {...data.payload.singleBranch};

                setValues({
                    ...tempBranch,
                    phoneNum: "+" + tempBranch.phoneNum,
                    main: tempBranch.main === 'main',
                    center: [tempBranch.lat, tempBranch.lon],
                    images: [...tempBranch.images]
                });
            })()
        }
    }, [params.id]);

    const handleChangeValues = useCallback((val, key) => {
        if (key === 'map') {
            const coords = val.get('coords');

            setValues({
                ...values,
                lat: coords[0],
                lon: coords[1],
            });
            toast.info(`Выбранные координаты\` \n${coords[0]} \n${coords[1]}`);
        } else if (key === 'images') {
            const {files} = val.target;
            const imagesList = [...values.images];

            [...files].forEach((file) => {
                file._src = URL.createObjectURL(file);

                imagesList.push(file);
            });

            if (imagesList.length > 10) {
                toast.info('Максимальное количество изображений');
                imagesList.length = 10;
            }

            setValues({
                ...values,
                images: [...imagesList],
            });
            val.target.value = '';
        } else {
            setValues({
                ...values,
                [key]: val,
            })
        }
    }, [values]);

    const handleDeleteImage = useCallback(({src, name}) => {
        if (src) {
            setValues({
                ...values,
                images: values.images.filter((image => image._src !== src))
            })
        } else if (name) {
            setValues({
                ...values,
                images: values.images.filter((image => image.name !== name))
            })
        }
    }, [values]);

    const handleAddBranch = useCallback(async () => {
        const validateValues = [
            Validator.validPhoneNum(values.phoneNum.slice(1), errorConfig.phoneNum),
            Validator.validString(values.title, errorConfig.title),
            Validator.validString(values.location, 'Неверный адрес'),
            Validator.validString(values.country, errorConfig.country),
            Validator.validString(values.city, errorConfig.city),
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(invalidVal);
            return;
        }
        if (!values.images.length) {
            toast.error("Выберите изображение");
            return;
        }

        const data = await dispatch(addBranchRequest({
            title: values.title,
            location: values.location,
            lat: values.lat,
            lon: values.lon,
            phoneNum: values.phoneNum.slice(1),
            city: values.city,
            country: values.country,
            main: values.main,
            images: values.images,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Филиал добавлен');
        navigate(`/maps`);
    }, [values]);

    const handleUpdateBranch = useCallback(async () => {
        const notDeleteImageIdList = values.images.map(file => file.id);

        const validateValues = [
            values.phoneNum ? Validator.validPhoneNum(values.phoneNum.slice(1)) : true,
            values.title ? Validator.validString(values.title, errorConfig.title) : true,
            values.location ? Validator.validString(values.location, 'Неверный адрес') : true,
            values.country ? Validator.validString(values.country, errorConfig.country) : true,
            values.city ? Validator.validString(values.city, errorConfig.city) : true,
        ];

        const invalidVal = validateValues.find((v) => v !== true);

        if (invalidVal) {
            toast.error(invalidVal);
            return;
        }

        if (!values.phoneNum && !values.title && !values.location
            && !values.country && !values.city && !values.lat && !values.lon
            && _.isEmpty(notDeleteImageIdList) && _.isEmpty(values.images)
        ) {
            toast.error(`Заполните одно из полей`);
            return;
        }

        const data = await dispatch(updateBranchRequest({
            id: values.id,
            title: values.title ? values.title : undefined,
            location: values.location ? values.location : undefined,
            lat: values.lat ? values.lat : undefined,
            lon: values.lon ? values.lon : undefined,
            phoneNum: values.phoneNum ? values.phoneNum.slice(1) : undefined,
            city: values.city ? values.city : undefined,
            country: values.country ? values.country : undefined,
            main: values.main ? values.main : undefined,
            images: values.images.length ? values.images.filter(file => !file.id) : undefined,
            notDeleteImageIdList,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Ветка обновлена');
        navigate(`/maps`);
    }, [values]);

    const handleDelete = useCallback(async () => {
        const data = await dispatch(deleteBranchRequest({id: values.id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Ветка удалена');
        navigate(`/maps`);
    }, [values]);

    const drawData = [
        {
            path: ['map'],
            label: 'карта',
            disabled: false,
        },
        {
            path: ['title'],
            label: 'Название',
            disabled: false,
        },
        {
            path: ['country'],
            label: 'Страна',
            disabled: false,
        },
        {
            path: ['city'],
            label: 'Город',
            disabled: false,
        },
        {
            path: ['location'],
            label: 'Адрес',
            disabled: false,
        },
        {
            path: ['lat'],
            label: 'Lat',
            disabled: false,
        },
        {
            path: ['lon'],
            label: 'Lon',
            disabled: false,
        },
        {
            path: ['phoneNum'],
            label: 'Номер телефона',
            disabled: false,
        },
        {
            path: ['main'],
            label: 'Основная',
            disabled: false,
        },
        {
            path: ['images'],
            label: 'Выберите изображение',
            disabled: false,
        },
        {
            path: ['imagesList'],
            label: 'Список изображений',
            handleDelete: handleDeleteImage,
        },
    ];

    return (
        <Wrapper
            pageName={`Ветвь${values.id ? ' - ' + values.title : ''}`}
            uploadProcess={uploadProcess}
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
        >
            <TopBar
                pageName={`Ветвь${values.id ? ' - ' + values.title : ''}`}
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={values}
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
                    values.id ? (
                        <>
                            <button
                                className="btn btn-danger"
                                disabled={admin && admin.role === 'админ'}
                                onClick={handleDelete}
                            >
                                Удалить
                            </button>
                        </>
                    ) : null
                }
                <button
                    className="btn btn-primary"
                    onClick={values.id ? handleUpdateBranch : handleAddBranch}
                >
                    {
                        values.id ? 'Обнавить' : 'Добавить'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleBranch;
//шашлыков
