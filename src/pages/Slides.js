import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {addSlideRequest, allSlidesListRequest, updateSlideRequest} from "../store/actions/slides";
import Modal from "react-modal";
import moment from "moment/moment";
import Wrapper from "../components/Wrapper";
import SlidesRow from "../components/SlidesRow";
import TopBar from "../components/TopBar";
import SingleImage from "../components/SingleImage";
import EmptyPage from "../components/EmptyPage";

function Slides() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();
    const slides = useSelector(state => state.slides.slides);
    const statusGetAll = useSelector(state => state.status.slidesGetAllStatus);
    const statusAdd = useSelector(state => state.status.slidesAddStatus);
    const statusUpdate = useSelector(state => state.status.slidesUpdateStatus);
    const statusDelete = useSelector(state => state.status.slidesDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [uploadProcess, setUploadProcess] = useState(100);
    const [slide, setSlide] = useState({});
    const [image, setImage] = useState({});

    useEffect(() => {
        (async () => {
            await dispatch(allSlidesListRequest());
        })()
    }, []);

    const openCloseModal = useCallback((slideObj) => {
        if (!_.isEmpty(slideObj)) {
            setSlide(slideObj);
        }

        if (modalIsOpen) {
            setSlide({});
            setImage({});
        }

        setModalIsOpen(!modalIsOpen);
    }, [modalIsOpen]);

    const handleAddSlide = useCallback(async () => {
        if (!image.type) {
            toast.error("Select image!");
            return;
        }

        const data = await dispatch(addSlideRequest({
            image,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allSlidesListRequest());

            setModalIsOpen(false);
            setImage({});
            toast.success('Slide added successfully.');
        }
    }, [image]);

    const handleChangeImage = useCallback((e) => {
        const {files} = e.target;

        if (files.length) {
            files[0]._src = URL.createObjectURL(files[0]);
            setImage(files[0]);
        } else {
            setImage({});
        }
    }, []);

    const handleUpdateSlide = useCallback(async () => {
        if (!image.type) {
            toast.error("Select image");
            return;
        }

        const data = await dispatch(updateSlideRequest({
            id: slide.id,
            image: image.type ? image : undefined,
            onUploadProcess: (ev) => {
                const {total, loaded} = ev;
                setUploadProcess(loaded / total * 100);
            }
        }));

        if (data.error) {
            toast.error(data.error.message);
        } else if (data.payload?.status === 'ok') {
            await dispatch(allSlidesListRequest());

            setModalIsOpen(false);
            setImage({});
            setSlide({});
            toast.success('Slide updated successfully.');
        }
    }, [image]);

    return (
        <Wrapper
            pageName='slides'
            uploadProcess={uploadProcess}
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
        >
            <div className="col-12">
                <div className="bg-light rounded h-100 p-4">
                    <TopBar
                        openCloseModal={openCloseModal}
                        pageName='slide'
                    />
                    {
                        !_.isEmpty(slides) ? (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        slides.map(slide => (
                                            <SlidesRow
                                                slide={slide}
                                                key={slide.id}
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
                        {`${!_.isEmpty(slide) ? 'Update' : 'Add'} Slide`}
                    </h6>
                    {
                        !_.isEmpty(slide) || !_.isEmpty(image) ? (
                            <SingleImage
                                image={image}
                                obj={slide}
                                handleChangeImage={handleChangeImage}
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
                        !_.isEmpty(slide) ? (
                            <>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(slide.createdAt).format('LLL')}
                                    </p>
                                    <label>Created At</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <p className='form-control'>
                                        {moment(slide.updatedAt).format('LLL')}
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
                                !_.isEmpty(slide) ? handleUpdateSlide: handleAddSlide
                            }
                        >
                            {
                                !_.isEmpty(slide) ? 'Update' : 'Add'
                            }
                        </button>
                    </div>
                </div>
            </Modal>
        </Wrapper>
    );
}

export default Slides;
