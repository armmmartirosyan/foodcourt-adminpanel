import React, {useCallback} from 'react';

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
                onClick={() => {backFunc()}}
            >
                X
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id='name'
                    disabled={value.key === 'email'}
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
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    onClick={forwardFunc}
                >
                    {
                        value.key === 'email' ? 'Get Key' : 'Modify'
                    }
                </button>
            </div>
        </div>
    );
}

export default UpdateValues;
