import React from 'react';
import SingleImage from "./SingleImage";
import Select from "react-select";
import momentWL from 'moment-with-locales-es6'
import PhoneInput from "react-phone-number-input";
import en from 'react-phone-number-input/locale/en'
import YandexMap from "./YandexMap";
import ImagesList from "./ImagesList";
import PropTypes from "prop-types";
import _ from 'lodash';

function Single(props) {
    const {drawData, obj, changeValues, values} = props;
    const excludePath = [
        'confirmPassword',
        'description',
        'imageSelect',
        'categories',
        'imagesList',
        'createdAt',
        'updatedAt',
        'branchId',
        'allowUse',
        'phoneNum',
        'password',
        'address',
        'message',
        'images',
        'status',
        'image',
        'role',
        'main',
        'map',
    ];

    return (
        <>
            {
                drawData.map(item => {
                    const tempPath = item.path[item.path.length - 1];
                    let value = !_.isEmpty(values) ? values : obj;

                    item.path.forEach(p => {
                        value = value[p];
                    });

                    return (
                        <div key={tempPath}>
                            {
                                tempPath === 'map' && !_.isEmpty(values) ? (
                                    <div className="container mb-3">
                                        <YandexMap
                                            singleBranch={values.id ? values : {}}
                                            onMapClick={changeValues}
                                            center={values.center[0] !== 0 ? values.center : []}
                                            allowMapClick={!item.disabled}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === "image"
                                && (!_.isEmpty(obj) || !_.isEmpty(values.image)) ? (
                                    <SingleImage
                                        image={value}
                                        obj={obj}
                                        handleChangeImage={changeValues}
                                    />
                                ) : null
                            }
                            {
                                tempPath === 'imagesList' ? (
                                    <div className="image-list">
                                        {
                                            values.id || !_.isEmpty(values.images) ? (
                                                values.images.map(image => (
                                                    <ImagesList
                                                        key={image.id || image._src}
                                                        image={image}
                                                        handleDeleteImage={item.handleDelete}
                                                    />
                                                ))
                                            ) : null
                                        }
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'images' ? (
                                    <div className="mb-3">
                                        <label htmlFor={tempPath} className="form-label">{item.label}</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id={tempPath}
                                            accept="image/*"
                                            multiple={true}
                                            onChange={(e) => {
                                                changeValues(e, tempPath);
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'imageSelect' ? (
                                    <div className="mb-3">
                                        <label htmlFor={tempPath} className="form-label">{item.label}</label>
                                        <input
                                            className="form-control"
                                            accept="image/*"
                                            type="file"
                                            id={tempPath}
                                            disabled={item.disabled}
                                            onChange={(e) => {
                                                changeValues(e, 'image')
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === "description" || (tempPath === "message" && value) || tempPath === 'comment' ? (
                                    <div className="form-floating mb-3">
                                    <textarea
                                        className="form-control description-input"
                                        id={tempPath}
                                        placeholder={item.label}
                                        disabled={item.disabled}
                                        value={value}
                                        onChange={(e) => {
                                            changeValues(e.target.value, tempPath)
                                        }}
                                    />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'categories' ? (
                                    <div className="mb-3">
                                        <label htmlFor={tempPath} className="form-label">{item.label}</label>
                                        <Select
                                            value={item.array.filter(i => values.categoryId.includes(i.value))}
                                            isMulti
                                            name={item.label}
                                            options={item.array}
                                            isDisabled={item.disabled}
                                            classNamePrefix="select"
                                            className="multi-select"
                                            id={tempPath}
                                            placeholder='Категории'
                                            onChange={(e) => {
                                                changeValues(e, tempPath)
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'branchId' ? (
                                    <div className="mb-3">
                                        <label htmlFor={tempPath} className="form-label">{item.label}</label>
                                        <Select
                                            value={item.array.find(i => i.value === values[tempPath])}
                                            name={item.label}
                                            options={item.array}
                                            id={tempPath}
                                            isDisabled={item.disabled}
                                            classNamePrefix="select"
                                            className="single-select"
                                            placeholder='Ветви'
                                            onChange={(e) => {
                                                changeValues(e, tempPath)
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'phoneNum' ? (
                                    <div className='mb-3'>
                                        <label htmlFor={tempPath}>{item.label}</label>
                                        <PhoneInput
                                            international
                                            defaultCountry="AM"
                                            labels={en}
                                            id={tempPath}
                                            disabled={item.disabled}
                                            value={value}
                                            onChange={(num) => {
                                                changeValues(num, tempPath)
                                            }}
                                        />
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'role' ? (
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id={tempPath}
                                            value={values.role}
                                            disabled={item.disabled}
                                            onChange={(e) => {
                                                changeValues(e.target.value, tempPath)
                                            }}
                                        >
                                            <option value="manager">Manager</option>
                                            <option value="admin manager">Admin Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                _.isEmpty(obj) && !obj.password
                                && (tempPath === 'password' || tempPath === 'confirmPassword') ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id={tempPath}
                                            placeholder={item.label}
                                            value={value}
                                            disabled={item.disabled}
                                            onChange={(e) => {
                                                changeValues(e.target.value, tempPath)
                                            }}
                                        />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                tempPath === 'main' || tempPath === 'allowUse' ? (
                                    <div className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={tempPath}
                                            checked={value}
                                            disabled={item.disabled}
                                            onChange={(e) => {
                                                console.log(values.allowUse);
                                                changeValues(!values.allowUse, tempPath)
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor={tempPath}>
                                            {item.label}
                                        </label>
                                    </div>
                                ) : null
                            }
                            {
                                (tempPath === 'status' && obj.id && obj.status) ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            type='text'
                                            className="form-control"
                                            id={tempPath}
                                            placeholder={item.label}
                                            disabled={item.disabled}
                                            value={_.capitalize(value.split(/(?=[A-Z])/).join(' '))}
                                        />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                (tempPath === 'createdAt' || tempPath === 'updatedAt') && obj.id ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            type='text'
                                            className="form-control"
                                            id={tempPath}
                                            placeholder={item.label}
                                            disabled={item.disabled}
                                            value={momentWL(value).format('LLL')}
                                        />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                (tempPath === 'address') && value ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            type={tempPath === 'price' ? 'number' : 'text'}
                                            className="form-control"
                                            id={tempPath}
                                            placeholder={item.label}
                                            disabled={item.disabled}
                                            value={value}
                                            onChange={(e) => {
                                                changeValues(e.target.value, tempPath)
                                            }}
                                        />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                            {
                                !excludePath.includes(tempPath) ? (
                                    <div className="form-floating mb-3">
                                        <input
                                            type={tempPath === 'price' ? 'number' : 'text'}
                                            className="form-control"
                                            id={tempPath}
                                            placeholder={item.label}
                                            disabled={item.disabled}
                                            value={value}
                                            onChange={(e) => {
                                                changeValues(e.target.value, tempPath)
                                            }}
                                        />
                                        <label htmlFor={tempPath}>{item.label}</label>
                                    </div>
                                ) : null
                            }
                        </div>
                    )
                })
            }
        </>
    );
}

Single.propTypes = {
    drawData: PropTypes.array.isRequired,
    changeValues: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    obj: PropTypes.object.isRequired,
}

export default Single;
