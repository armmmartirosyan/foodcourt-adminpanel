import React, {useCallback} from 'react';
import PropTypes from "prop-types";

function UpdateValues(props) {
    const {forwardFunc, backFunc, value, setValue} = props;

    const handleChangeValue = useCallback((val) => {
        setValue({
            ...value,
            value: val,
        });
    }, [value]);

    return (
        <div className="profile__table position-relative pt-5">
            <div
                className="modal_close"
                onClick={() => {
                    backFunc()
                }}
            >
                X
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id='name'
                    disabled={value.name === 'Пароль'}
                    placeholder={value.name}
                    value={value.value}
                    onChange={(e) => {
                        handleChangeValue(e.target.value)
                    }}
                />
                <label htmlFor='name'>{value.name}</label>
            </div>
            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        backFunc()
                    }}
                >
                    Отмена
                </button>
                <button
                    className="btn btn-primary"
                    onClick={forwardFunc}
                >
                    {
                        value.name === 'Пароль' ? 'Получить ключ' : 'Изменить'
                    }
                </button>
            </div>
        </div>
    );
}

UpdateValues.propTypes = {
    forwardFunc: PropTypes.func.isRequired,
    backFunc: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
}

export default UpdateValues;
