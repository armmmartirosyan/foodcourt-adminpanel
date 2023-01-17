import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {toast} from "react-toastify";
import {allBranchesListRequest} from "../store/actions/map";
import Wrapper from "../components/Wrapper";
import TopBar from "../components/TopBar";
import Helper from "../helpers/Helper";
import YandexMap from "../components/YandexMap";

function Branches() {
    const dispatch = useDispatch();
    const branches = useSelector(state => state.map?.branches);
    const statusGetAll = useSelector(state => state.status.branchesGetAllStatus);
    const [center, setCenter] = useState([0, 0]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(allBranchesListRequest());

            if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            }

            let mediumNum = [0, 0];

            data.payload.branches.forEach(b => {
                mediumNum[0] = +mediumNum[0] + +b.lat;
                mediumNum[1] = +mediumNum[1] + +b.lon;
            });

            if(data.payload.branches.length) {
                setCenter([
                    mediumNum[0] / data.payload.branches.length,
                    mediumNum[1] / data.payload.branches.length,
                ]);
            }
        })()
    }, []);

    return (
        <Wrapper
            pageName='branches'
            statuses={{statusGetAll}}
        >
            <TopBar
                pageName='branches'
                allowAdd={true}
            />
            <div className="container mb-3">
                <YandexMap
                    center={center[0] !== 0 ? center : [40.786543, 43.838250]}
                    branches={branches || []}
                />
            </div>
        </Wrapper>
    );
}

export default Branches;

{/*<YMaps*/}
{/*    query={{*/}
{/*        ns: 'use-load-option'*/}
{/*    }}>*/}
{/*    <Map*/}
{/*        modules={["geocode"]}*/}
{/*        width="100%"*/}
{/*        height="100%"*/}
{/*        defaultState={{*/}
{/*            center: center[0] !== 0 ? center : [40.786543, 43.838250],*/}
{/*            zoom: 12,*/}
{/*        }}*/}
{/*    >*/}
{/*        {*/}
{/*            branches?.length ? (*/}
{/*                branches.map(branchObj => (*/}
{/*                    <YandexPlacemark*/}
{/*                        key={branchObj.id}*/}
{/*                        geometry={[branchObj.lat, branchObj.lon]}*/}
{/*                        slugName={branchObj.slugName}*/}
{/*                    />*/}
{/*                ))*/}
{/*            ) : null*/}
{/*        }*/}
{/*    </Map>*/}
{/*</YMaps>*/}

// import React, {useCallback, useEffect, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import _ from "lodash";
// import {toast} from "react-toastify";
// import {addBranchRequest, allBranchesListRequest, deleteBranchRequest, updateBranchRequest} from "../store/actions/map";
// import Modal from "react-modal";
// import moment from "moment";
// import Wrapper from "../components/Wrapper";
// import {Map, Placemark, YMaps} from "react-yandex-maps";
// import TopBar from "../components/TopBar";
// import Validator from "../helpers/Validator";
// import Helper from "../helpers/Helper";
// import PhoneInput from "react-phone-number-input";
// import ru from 'react-phone-number-input/locale/ru'
//
// const {REACT_APP_API_URL} = process.env;
//
// function Branches() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const dispatch = useDispatch();
//     const branches = useSelector(state => state.map?.branches);
//     const statusGetAll = useSelector(state => state.status.branchesGetAllStatus);
//     const statusAdd = useSelector(state => state.status.branchAddStatus);
//     const statusUpdate = useSelector(state => state.status.branchUpdateStatus);
//     const statusDelete = useSelector(state => state.status.branchDeleteStatus);
//     const admin = useSelector(state => state.admin.admin);
//     const [uploadProcess, setUploadProcess] = useState(100);
//     const [branch, setBranch] = useState({});
//     const [images, setImages] = useState([]);
//     const [values, setValues] = useState({
//         title: '',
//         location: '',
//         lat: '',
//         lon: '',
//         phone: '',
//         city: '',
//         country: '',
//         main: false
//     });
//
//     useEffect(() => {
//         (async () => {
//             const data = await dispatch(allBranchesListRequest());
//
//             if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//                 toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//                 return;
//             }
//         })()
//     }, []);
//
//     const openCloseModal = useCallback((branchObj) => {
//         if (!_.isEmpty(branchObj)) {
//             setBranch(branchObj);
//             setImages([...branchObj.images]);
//             setValues({
//                 title: branchObj.title,
//                 location: branchObj.location,
//                 lat: branchObj.lat,
//                 lon: branchObj.lon,
//                 city: branchObj.city,
//                 country: branchObj.country,
//                 phone: branchObj.phone,
//                 main: branchObj.main === 'main',
//             });
//         }
//
//         if (modalIsOpen) {
//             setBranch({});
//             setImages([]);
//             setValues({
//                 title: '',
//                 location: '',
//                 lat: '',
//                 lon: '',
//                 phone: '',
//                 city: '',
//                 country: '',
//                 main: false
//             });
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const handleAddBranch = useCallback(async () => {
//         const validateValues = [
//             Validator.validTitle(values.title),
//             Validator.validDesc(values.location),
//             Validator.validGeometry(values.lat),
//             Validator.validGeometry(values.lon),
//             Validator.validPhoneNum(values.phone.slice(1)),
//             Validator.validCountry(values.country),
//             Validator.validCity(values.city),
//         ];
//
//         const invalidVal = validateValues.find((v) => v !== true);
//
//         if (invalidVal) {
//             toast.error(`Invalid ${invalidVal}`);
//             return;
//         }
//         if (!images.length) {
//             toast.error("Select image!");
//             return;
//         }
//
//         const data = await dispatch(addBranchRequest({
//             title: values.title,
//             location: values.location,
//             lat: values.lat,
//             lon: values.lon,
//             phone: values.phone.slice(1),
//             city: values.city,
//             country: values.country,
//             main: values.main,
//             images,
//             onUploadProcess: (ev) => {
//                 const {total, loaded} = ev;
//                 setUploadProcess(loaded / total * 100);
//             }
//         }));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(allBranchesListRequest());
//         openCloseModal();
//         toast.success('Branch added successfully');
//     }, [images, values]);
//
//     const handleChangeValues = useCallback((val, key) => {
//         setValues({
//             ...values,
//             [key]: val,
//         })
//     }, [values]);
//
//     const handleChangeImages = useCallback((e) => {
//         const {files} = e.target;
//         const imagesList = [...images];
//
//         [...files].forEach((file) => {
//             file._src = URL.createObjectURL(file);
//
//             imagesList.push(file);
//         });
//
//         if (imagesList.length > 10) {
//             toast.info('max images limit');
//             imagesList.length = 10;
//         }
//
//         setImages(imagesList);
//         e.target.value = '';
//     }, [images]);
//
//     const handleDeleteImage = useCallback(({src, name}) => {
//         if (src) {
//             setImages(images.filter((image => image._src !== src)));
//         } else if (name) {
//             setImages(images.filter((image => image.name !== name)));
//         }
//     }, [images]);
//
//     const handleDelete = useCallback(async () => {
//         const data = await dispatch(deleteBranchRequest({id: branch.id}));
//
//         if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
//             toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
//             return;
//         }
//
//         await dispatch(allBranchesListRequest());
//         openCloseModal();
//         toast.success('Branch deleted successfully');
//     }, [branch]);
//
//     const onMapClick = useCallback((e) => {
//         const coords = e.get('coords');
//
//         setValues({
//             ...values,
//             lat: coords[0],
//             lon: coords[1],
//         });
//         openCloseModal();
//     }, [values]);
//
//     // const handleUpdateBranch = useCallback(async () => {
//     //     if (values.title.length < 2
//     //         && values.location.length < 2
//     //         && !values.lat
//     //         && !values.lon
//     //         && !images.length) {
//     //         toast.error("Fill one of fields");
//     //         return;
//     //     }
//     //
//     //     const data = await dispatch(updateBranchRequest({
//     //         slugName: branch.slugName,
//     //         title: values.title || undefined,
//     //         location: values.location || undefined,
//     //         lat: values.lat || undefined,
//     //         lon: values.lon || undefined,
//     //         images: images.length ? images : undefined,
//     //         onUploadProcess: (ev) => {
//     //             const {total, loaded} = ev;
//     //             setUploadProcess(loaded / total * 100);
//     //         }
//     //     }));
//     //
//     //     if (data.error) {
//     //         toast.error(data.error.message);
//     //     } else if (data.payload?.status === 'ok') {
//     //         await dispatch(allBranchesListRequest());
//     //         openCloseModal();
//     //     }
//     // }, [images, values, branch]);
//
//     return (
//         <Wrapper
//             pageName='branches'
//             uploadProcess={uploadProcess}
//             statuses={{statusAdd, statusDelete, statusUpdate, statusGetAll}}
//         >
//             <TopBar
//                 openCloseModal={openCloseModal}
//                 pageName='branches'
//             />
//             <div className="container">
//                 <YMaps
//                     query={{
//                         ns: 'use-load-option'
//                     }}>
//                     <Map
//                         modules={["geocode"]}
//                         onClick={(e) => {
//                             if (admin && admin.role !== 'manager') onMapClick(e)
//                         }}
//                         width="100%"
//                         height="100%"
//                         defaultState={{
//                             center: [40.786543, 43.838250],
//                             zoom: 14,
//                         }}>
//                         {
//                             branches?.length ? (
//                                 branches.map(branchObj => (
//                                     <Placemark
//                                         key={branchObj.id}
//                                         //modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
//                                         defaultGeometry={[branchObj.lat, branchObj.lon]}
//                                         onClick={() => {
//                                             openCloseModal(branchObj)
//                                         }}
//                                         // properties={{
//                                         //     balloonContentHeader: `${branchObj.title}`,
//                                         //     balloonContentBody: `${branchObj.location}`,
//                                         //     balloonContentFooter: '',
//                                         // }}
//                                         options={{
//                                             preset: 'islands#geolocationIcon',
//                                             iconColor: 'red',
//                                         }}
//                                     />
//                                 ))
//                             ) : null
//                         }
//                     </Map>
//                 </YMaps>
//             </div>
//
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <div
//                         className="modal_close"
//                         onClick={() => {
//                             openCloseModal()
//                         }}
//                     >
//                         X
//                     </div>
//                     <h6 className="mb-4">
//                         {`${!_.isEmpty(branch) ? 'Update' : 'Add'} branch`}
//                     </h6>
//                     <div className="image-list">
//                         {
//                             !_.isEmpty(branch) || !_.isEmpty(images) ? (
//                                 images.map(image => (
//                                     <ImagesList
//                                         image={image}
//                                         handleDeleteImage={handleDeleteImage}
//                                     />
//                                 ))
//                             ) : null
//                         }
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="title"
//                             placeholder="Title"
//                             value={values.title}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'title')
//                             }}
//                         />
//                         <label htmlFor="title">Title</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="country"
//                             placeholder="Country"
//                             value={values.country}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'country')
//                             }}
//                         />
//                         <label htmlFor="country">Country</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="city"
//                             placeholder="City"
//                             value={values.city}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'city')
//                             }}
//                         />
//                         <label htmlFor="city">City</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="title"
//                             placeholder="Location"
//                             value={values.location}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'location')
//                             }}
//                         />
//                         <label htmlFor="location">Location</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="number"
//                             className="form-control"
//                             id="floatingInput"
//                             placeholder="Lat"
//                             value={values.lat}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'lat')
//                             }}
//                         />
//                         <label htmlFor="lat">Lat</label>
//                     </div>
//                     <div className="form-floating mb-3">
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="floatingInput"
//                             placeholder="Lat"
//                             value={values.lon}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(e.target.value, 'lon')
//                             }}
//                         />
//                         <label htmlFor="lon">Lon</label>
//                     </div>
//                     {
//                         _.isEmpty(branch) ? (
//                             <div className="mb-3">
//                                 <label htmlFor="formFile" className="form-label">Select Image</label>
//                                 <input
//                                     className="form-control"
//                                     type="file"
//                                     id="formFile"
//                                     accept="image/*"
//                                     multiple={true}
//                                     onChange={handleChangeImages}
//                                 />
//                             </div>
//                         ) : null
//                     }
//                     <div className='mb-3'>
//                         <label htmlFor="admin-phone">Phone</label>
//                         <PhoneInput
//                             international
//                             labels={ru}
//                             defaultCountry="RU"
//                             id='admin-phone'
//                             disabled={!_.isEmpty(branch)}
//                             value={!_.isEmpty(branch) ? `+${values.phone}` : values.phone}
//                             onChange={(num) => {
//                                 handleChangeValues(num, 'phone')
//                             }}
//                         />
//                     </div>
//                     <div className="form-check form-switch">
//                         <input
//                             className="form-check-input"
//                             type="checkbox"
//                             role="switch"
//                             id="flexSwitchCheckChecked"
//                             checked={values.main}
//                             disabled={!_.isEmpty(branch)}
//                             onChange={(e) => {
//                                 handleChangeValues(!values.main, 'main')
//                             }}
//                         />
//                         <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
//                             Main branch
//                         </label>
//                     </div>
//                     {
//                         !_.isEmpty(branch) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>{branch.slugName}</p>
//                                     <label htmlFor="floatingInput">Slug Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(branch.createdAt).format('LLL')}
//                                     </p>
//                                     <label htmlFor="floatingInput">Created At</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(branch.updatedAt).format('LLL')}
//                                     </p>
//                                     <label htmlFor="floatingInput">Last Update</label>
//                                 </div>
//                             </>
//                         ) : null
//                     }
//
//                     <div className='btn-container'>
//                         <div>
//                             <button
//                                 className="btn btn-outline-danger"
//                                 onClick={() => {
//                                     openCloseModal()
//                                 }}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                         {
//                             !_.isEmpty(branch) ? (
//                                 <button
//                                     className="btn btn-danger"
//                                     disabled={admin && admin.role === 'manager'}
//                                     onClick={handleDelete}
//                                 >
//                                     Delete
//                                 </button>
//                             ) : (
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={handleAddBranch}
//                                 >
//                                     Add
//                                 </button>
//                             )
//                         }
//                     </div>
//                 </div>
//             </Modal>
//         </Wrapper>
//     );
// }
//
// export default Branches;
