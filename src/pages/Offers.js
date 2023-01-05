import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {addOfferRequest, allOffersListRequest, updateOfferRequest} from "../store/actions/offers";
import Modal from "react-modal";
import moment from "moment";
import Wrapper from "../components/Wrapper";
import OfferRow from "../components/OfferRow";
import TopBar from "../components/TopBar";
import SingleImage from "../components/SingleImage";
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";
import Validator from "../helpers/Validator";
import EmptyPage from "../components/EmptyPage";
import Select from "react-select";
import {allCategoriesListRequest} from "../store/actions/categories";

function Offers() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const categoriesList = useSelector(state => state.categories.categories);
    const offers = useSelector(state => state.offers.offers);
    const statusGetAll = useSelector(state => state.status.offersGetAllStatus);
    const statusAdd = useSelector(state => state.status.offersAddStatus);
    const statusUpdate = useSelector(state => state.status.offersUpdateStatus);
    const statusDelete = useSelector(state => state.status.offersDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [title, setTitle] = useState(qs.parse(location.search).title || '');
    const [offer, setOffer] = useState({});
    const [image, setImage] = useState({});
    const [categories, setCategories] = useState([]);
    const [myTimeout, setMyTimeout] = useState();
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: 0,
        categoryId: [],
    });

    useEffect(() => {
        const title = qs.parse(location.search).title;

        (async () => {
            await dispatch(allOffersListRequest({title}));
        })()
    }, [location.search]);

    useEffect(() => {
        (async () => {
            await dispatch(allCategoriesListRequest());
        })()
    }, []);

    useEffect(() => {
        if (!_.isEmpty(categoriesList)) {
            const list = categoriesList.map(cat => {
                return {value: cat.id, label: cat.name}
            })
            setCategories(list);
        }
    }, [categoriesList]);

    const openCloseModal = useCallback((offerObj) => {
        if (!_.isEmpty(offerObj)) {
            setOffer(offerObj);
            setValues({
                title: offerObj.title,
                description: offerObj.description,
                price: offerObj.price,
            });
        }

        if (modalIsOpen) {
            setOffer({});
            setImage({});
            setValues({
                title: '',
                description: '',
                price: 0,
            });
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddOffer = useCallback(async () => {
        const validateValues = [
            Validator.validTitle(values.title),
            Validator.validDesc(values.description),
            Validator.validPrice(values.price),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }
        if(_.isEmpty(values.categoryId)){
            toast.error(`Select category(at least 1 category!)`);
            return;
        }
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addOfferRequest({
            title: values.title,
            description: values.description,
            price: values.price,
            categoryId: values.categoryId,
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allOffersListRequest());
            openCloseModal();
            toast.success('Offer added successfully.');
        }
    }, [image, values]);

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

    const handleUpdateOffer = useCallback(async () => {
        const validateValues = [
            values.title ? Validator.validTitle(values.title) : true,
            values.description ? Validator.validDesc(values.description) : true,
            values.price || values.price === 0 ? Validator.validPrice(values.price) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.title && !values.description
            && !values.price && !image.type) {
            toast.error("Fill one of fields!");
            return;
        }

        const data = await dispatch(updateOfferRequest({
            slugName: offer.slugName,
            title: values.title || undefined,
            description: values.description || undefined,
            price: values.price || undefined,
            categoryId: !_.isEmpty(values.categoryId) ? values.categoryId : undefined,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allOffersListRequest());
            openCloseModal();
            toast.success('Offer updated successfully.');
        }
    }, [image, values]);

    const searchChange = useCallback((val) => {
        const query = qs.stringify({title: val || null}, {skipNull: true});
        setTitle(val);

        clearTimeout(myTimeout);

        setMyTimeout(setTimeout(() => {
            navigate(`/offers${query ? `?${query}` : ''}`);
        }, 400));
    }, [myTimeout]);

    const onChangeSelect = useCallback((data) => {
        const ids = data.map(d => d.value);

        setValues({
            ...values,
            categoryId: ids
        })
    }, [values]);

    return (
        <Wrapper
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
            uploadProcess={uploadProcess}
            pageName='offers'
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        searchChange={searchChange}
                        search={title}
                        openCloseModal={openCloseModal}
                        pageName='offer'
                    />
                    {
                        !_.isEmpty(offers) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Categories</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        offers.map(offer => (
                                            <OfferRow
                                                offer={offer}
                                                key={offer.id}
                                                openCloseModal={openCloseModal}
                                            />
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        ) : <EmptyPage/>
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
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={() => {openCloseModal()}}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        {`${!_.isEmpty(offer) ? 'Update' : 'Add'} offer`}
                    </h6>
                    {
                        !_.isEmpty(offer) || !_.isEmpty(image) ? (
                            <SingleImage
                                image={image}
                                obj={offer}
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
                            disabled={admin && admin.possibility === 'junior'}
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
                            disabled={admin && admin.possibility === 'junior'}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'description')
                            }}
                        />
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            placeholder="Price(AMD)"
                            value={values.price}
                            disabled={admin && admin.possibility === 'junior'}
                            onChange={(e) => {
                                handleChangeValues(e.target.value, 'price')
                            }}
                        />
                        <label htmlFor="price">Price(AMD)</label>
                    </div>
                    {
                        !_.isEmpty(categories) ? (
                            <Select
                                defaultValue={!_.isEmpty(offer) ?
                                    offer.categories.map(cat => {
                                        return {value: cat.id, label: cat.name}
                                    }) : undefined
                                }
                                isMulti
                                name="colors"
                                options={categories}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={onChangeSelect}
                            />
                        ) : null
                    }
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Select Image</label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            disabled={admin && admin.possibility === 'junior'}
                            accept="image/*"
                            onChange={handleChangeImage}
                        />
                    </div>
                    {
                        !_.isEmpty(offer) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>{offer.slugName}</p>
                                    <label>Slug Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(offer.createdAt).format('LLL')}
                                    </p>
                                    <label>Created At</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(offer.updatedAt).format('LLL')}
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
                        <button
                            className="btn btn-primary"
                            disabled={admin && admin.possibility === 'junior'}
                            onClick={
                                !_.isEmpty(offer) ? handleUpdateOffer : handleAddOffer
                            }
                        >
                            {
                                !_.isEmpty(offer) ? 'Update' : 'Add'
                            }
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Offers;
