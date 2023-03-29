import React from 'react';
import PropTypes from "prop-types";

function ChangePassword(props) {
    const {values, handleChange, forwardFunc, backFunc} = props;

    return (
        <>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id='token'
                    placeholder='Ключ'
                    value={values.token}
                    onChange={(e) => {
                        handleChange(e.target.value, 'token')
                    }}
                />
                <label htmlFor='token'>Ключ</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id='password'
                    placeholder='Пароль'
                    value={values.password}
                    onChange={(e) => {
                        handleChange(e.target.value, 'password')
                    }}
                />
                <label htmlFor='password'>Пароль</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id='confirmPassword'
                    placeholder='Подтвердите пароль'
                    value={values.confirmPassword}
                    onChange={(e) => {
                        handleChange(e.target.value, 'confirmPassword')
                    }}
                />
                <label htmlFor='confirmPassword'>Подтвердите пароль</label>
            </div>
            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={backFunc}
                >
                    Отмена
                </button>
                <button
                    className="btn btn-primary"
                    onClick={forwardFunc}
                >
                    Изменить пароль
                </button>
            </div>
        </>
    );
}
ChangePassword.propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    forwardFunc: PropTypes.func.isRequired,
    backFunc: PropTypes.func.isRequired,
}

export default ChangePassword;
