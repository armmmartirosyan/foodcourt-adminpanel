import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
    addCategoryRequest,
    deleteCategoryRequest, singleCategoryRequest,
    updateCategoryRequest
} from "../store/actions/categories";
import {toast} from "react-toastify";
import _ from "lodash";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import SingleImage from "../components/SingleImage";
import moment from "moment/moment";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";

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
    const [name, setName] = useState('');
    const [image, setImage] = useState({});
    const [category, setCategory] = useState({});

    useEffect(() => {
        if(params.slugName){
            (async () => {
                const data = await dispatch(singleCategoryRequest({slugName: params.slugName}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }
                const tempCategory = data?.payload?.category;

                setName(tempCategory.name);
                setCategory({...tempCategory})
            })()
        }
    }, [params.slugName]);

    const handleChangeName = useCallback((e) => {
        setName(e.target.value);
    }, []);

    const handleChangeImage = useCallback((e) => {
        const {files} = e.target;

        if (files.length) {
            files[0]._src = URL.createObjectURL(files[0]);
            setImage(files[0]);
        } else {
            setImage({});
        }
    }, []);

    const handleAddCategory = useCallback(async () => {
        const validateValues = [
            Validator.validName(name),
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

        const data = await dispatch(addCategoryRequest({
            name,
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

        toast.success('Category added successfully');
        navigate('/categories');
    }, [image, name]);

    const handleUpdateCategory = useCallback(async () => {
        const validateValues = [
            name ? Validator.validName(name) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!name && !image.type) {
            toast.error("Either fill name field, either select new image!");
            return;
        }

        const data = await dispatch(updateCategoryRequest({
            id: category.id,
            name: name || undefined,
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

        toast.success('Category added successfully');
        navigate('/categories');
    }, [image, name]);

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
            {
                !_.isEmpty(category) || !_.isEmpty(image) ? (
                    <SingleImage
                        image={image}
                        obj={category}
                        handleChangeImage={handleChangeImage}
                    />
                ) : null
            }
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Name"
                    disabled={admin && admin.role === 'manager'}
                    value={name}
                    onChange={handleChangeName}
                />
                <label htmlFor="name">Name</label>
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
                !_.isEmpty(category) ? (
                    <>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(category.createdAt).format('LLL')}
                            </p>
                            <label>Created At</label>
                        </div>
                        <div className="form-floating mb-3">
                            <p className='form-control'>
                                {moment(category.updatedAt).format('LLL')}
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
