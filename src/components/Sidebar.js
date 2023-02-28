import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import _ from 'lodash';
import Account from "../helpers/Account";
import Modal from "react-modal";
import classNames from "classnames";
import PropTypes from "prop-types";

function Sidebar(props) {
    const {pageName} = props;
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const admin = useSelector(state => state.admin.admin);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(pageName === 'profile');

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current
                && pageName !== 'profile'
                && !profileRef.current.contains(event.target)) {
                setIsOpenProfile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    const openCloseModal = useCallback(() => {
        setIsOpenModal(!isOpenModal);
    }, [isOpenModal]);

    const handleLogOut = useCallback(() => {
        Account.deleteToken();

        navigate('/');
        window.location.reload();
    }, []);

    const openCloseProfile = useCallback(() => {
        if (pageName !== 'profile') setIsOpenProfile(!isOpenProfile);
    }, [isOpenProfile, pageName]);

    return (
        <div className="container-xxl position-relative bg-white d-flex p-0">
            <div className='sidebar pe-4 pb-3'>
                <nav className="navbar bg-light navbar-light">
                    <Link to="/home" className="navbar-brand mx-4 mb-3">
                        <h3 className="text-primary">FoodCourt</h3>
                    </Link>
                    {
                        !_.isEmpty(admin) ? (
                            <div className="ms-4 mb-3 admin__container" ref={profileRef}>
                                <div
                                    className="ms-4 admin"
                                    onClick={openCloseProfile}
                                >
                                    <h6 className="mb-0">{`${admin.firstName} ${admin.lastName}`}</h6>
                                    <span>{_.capitalize(admin.role)}</span>
                                </div>
                                <div className={classNames(
                                    'admin__options mt-4',
                                    {open: isOpenProfile}
                                )}>
                                    <NavLink
                                        to="/profile"
                                        className="nav-item nav-link"
                                    >
                                        Profile
                                    </NavLink>
                                    <div
                                        className="nav-item nav-link"
                                        onClick={openCloseModal}
                                    >
                                        Log Out
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="navbar-nav w-100">
                        <NavLink to="/home" className="nav-item nav-link">
                            Home
                        </NavLink>
                        {
                            admin.role !== 'manager' ? (
                                <>
                                    <NavLink to="/products" className="nav-item nav-link">
                                        Products
                                    </NavLink>
                                    <NavLink to="/categories" className="nav-item nav-link">
                                        Categories
                                    </NavLink>
                                    <NavLink to="/news" className="nav-item nav-link">
                                        News
                                    </NavLink>
                                    <NavLink to="/offers" className="nav-item nav-link">
                                        Offers
                                    </NavLink>
                                    <NavLink to="/slides" className="nav-item nav-link">
                                        Slides
                                    </NavLink>
                                    <NavLink to="/maps" className="nav-item nav-link">
                                        Branches
                                    </NavLink>
                                </>
                            ) : null
                        }
                        {
                            admin.role === 'admin' ? (
                                <>
                                    <NavLink to="/users" className="nav-item nav-link">
                                        Users
                                    </NavLink>
                                    <NavLink to="/admin" className="nav-item nav-link">
                                        Admin
                                    </NavLink>
                                    <NavLink to="/payment-types" className="nav-item nav-link">
                                        Payment types
                                    </NavLink>
                                </>
                            ) : null
                        }
                    </div>
                </nav>
            </div>
            <Modal
                isOpen={isOpenModal}
                className="modal small"
                overlayClassName="overlay"
                onRequestClose={openCloseModal}
            >
                <div className="bg-light rounded h-100 p-4 modal-container">
                    <div
                        className="modal_close"
                        onClick={openCloseModal}
                    >
                        X
                    </div>
                    <h6 className="mb-4">
                        Log Out ?
                    </h6>
                    <div className='btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={openCloseModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleLogOut}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

Sidebar.propTypes = {
    pageName: PropTypes.string.isRequired,
}

export default Sidebar;
