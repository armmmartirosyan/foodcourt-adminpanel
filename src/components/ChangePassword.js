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
                    placeholder='Token'
                    value={values.token}
                    onChange={(e) => {
                        handleChange(e.target.value, 'token')
                    }}
                />
                <label htmlFor='token'>Token</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id='password'
                    placeholder='Password'
                    value={values.password}
                    onChange={(e) => {
                        handleChange(e.target.value, 'password')
                    }}
                />
                <label htmlFor='password'>Password</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control"
                    id='confirmPassword'
                    placeholder='Confirm password'
                    value={values.confirmPassword}
                    onChange={(e) => {
                        handleChange(e.target.value, 'confirmPassword')
                    }}
                />
                <label htmlFor='confirmPassword'>Confirm password</label>
            </div>
            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={backFunc}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    onClick={forwardFunc}
                >
                    Change Password
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
