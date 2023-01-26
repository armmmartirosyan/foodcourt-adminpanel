import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
    addCategoryRequest,
    deleteCategoryRequest,
    singleCategoryRequest,
    updateCategoryRequest
} from "../store/actions/categories";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Single from "../components/Single";

function SingleCategory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.categoriesGetSingleStatus);
    const statusAdd = useSelector(state => state.status.categoriesAddStatus);
    const statusUpdate = useSelector(state => state.status.categoriesUpdateStatus);
    const statusDelete = useSelector(state => state.status.categoriesDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [category, setCategory] = useState({});
    const [values, setValues] = useState({
       name: '',
       image: {},
    });

    const drawData = [
        {
            path: ['image'],
            label: 'Image',
            disabled: false,
        },
        {
            path: ['name'],
            label: 'Name',
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
                const data = await dispatch(singleCategoryRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }
                const tempCategory = data?.payload?.category;

                setCategory({...tempCategory});
                setValues({
                    ...values,
                    name: tempCategory.name,
                });
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

    const handleAddCategory = useCallback(async () => {
        const validateValues = [
            Validator.validString(values.name),
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

        const data = await dispatch(addCategoryRequest({
            name: values.name,
            image: values.image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Category added successfully');
        navigate('/categories');
    }, [values]);

    const handleUpdateCategory = useCallback(async () => {
        const validateValues = [
            values.name ? Validator.validString(values.name) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.name && !values.image.type) {
            toast.error("Either fill name field, either select new image!");
            return;
        }

        const data = await dispatch(updateCategoryRequest({
            id: category.id,
            name: values.name || undefined,
            image: values.image.type ? values.image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Category added successfully');
        navigate('/categories');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deleteCategoryRequest({id}));

        if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Category deleted successfully.');
        navigate('/categories');
    }, []);

    return (
        <Wrapper
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
            uploadProcess={uploadProcess}
            pageName={`category${category.name ? ' - ' + category.name : ''}`}
        >
            <TopBar
                pageName={`category${category.name ? ' - ' + category.name : ''}`}
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={category}
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
                    !_.isEmpty(category) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, category.id)
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
                        !_.isEmpty(category) ? handleUpdateCategory : handleAddCategory
                    }
                >
                    {
                        !_.isEmpty(category) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SingleCategory;
