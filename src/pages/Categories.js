import React, {useCallback, useEffect, useState} from 'react';
import _ from "lodash";
import Modal from "react-modal";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {addCategoryRequest, allCategoriesListRequest, updateCategoryRequest} from "../store/actions/categories";
import CategoryRow from "../components/CategoryRow";
import {toast} from "react-toastify";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";
import TopBar from "../components/TopBar";
import SingleImage from "../components/SingleImage";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";

function Categories() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const categories = useSelector(state => state.categories.categories);
    const statusGetAll = useSelector(state => state.status.categoriesGetAllStatus);
    const statusAdd = useSelector(state => state.status.categoriesAddStatus);
    const statusUpdate = useSelector(state => state.status.categoriesUpdateStatus);
    const statusDelete = useSelector(state => state.status.categoriesDeleteStatus);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [searchName, setSearchName] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState({});
    const [category, setCategory] = useState({});

    useEffect(() => {
        const name = qs.parse(location.search).name;

        (async () => {
            await dispatch(allCategoriesListRequest({name}));
        })()
    }, [location.search]);

    useEffect(() => {
        const query = qs.stringify({name: searchName || null}, {skipNull: true});

        navigate(`/categories${query ? `?${query}` : ''}`);
    }, [searchName]);

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

    const openCloseModal = useCallback((cat) => {
        if (!_.isEmpty(cat)) {
            setCategory(cat);
            setName(cat.name);
        }

        if (modalIsOpen) {
            setCategory({});
            setName('');
            setImage({});
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddCategory = useCallback(async () => {
        if (name.length < 2) {
            toast.error("Field name can't contain less than 2 symbols!");
            return;
        }
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const {payload} = await dispatch(addCategoryRequest({
            name,
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (payload.status === 'ok') {
            await dispatch(allCategoriesListRequest());
            openCloseModal();
        }
    }, [image, name]);

    const handleUpdateCategory = useCallback(async () => {
        if (name.length < 2 && !image.type) {
            toast.error("Fill name more then 2 symbols or select image!");
            return;
        }

        const {payload} = await dispatch(updateCategoryRequest({
            slugName: category.slugName,
            name: name || undefined,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (payload.status === 'ok') {
            await dispatch(allCategoriesListRequest());
            openCloseModal();
        }
    }, [image, name]);

    return (
        <Wrapper
            statusDelete={statusDelete}
            statusGetAll={statusGetAll}
            searchable={true}
            setSearch={setSearchName}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        openCloseModal={openCloseModal}
                        pageName='Category'
                    />
                    {
                        !_.isEmpty(categories) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Name</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        categories.map(category => (
                                            <CategoryRow
                                                category={category}
                                                key={category.id}
                                                openCloseModal={openCloseModal}
                                            />
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
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
                        {`${!_.isEmpty(category) ? 'Update' : 'Add'} category`}
                    </h6>
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
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                    </div>
                    {
                        !_.isEmpty(category) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{category.slugName}</p>
                                    <label>Slug Name</label>
                                </div>
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
                                !_.isEmpty(category) ? handleUpdateCategory : handleAddCategory
                            }
                        >
                            {
                                !_.isEmpty(category) ? 'Update' : 'Add'
                            }
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Categories;
