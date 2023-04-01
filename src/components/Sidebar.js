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

        window.location.href = "/";
    }, []);

    const openCloseProfile = useCallback(() => {
        if (pageName !== 'profile') setIsOpenProfile(!isOpenProfile);
    }, [isOpenProfile, pageName]);

    return (
        <div className="container-xxl position-relative bg-white d-flex p-0">
            <div className='sidebar pe-4 pb-3'>
                <nav className="navbar bg-light navbar-light">
                    <Link to="/orders" className="navbar-brand mx-4 mb-3">
                        <h3 className="text-primary">Шашлыков</h3>
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
                                        Профиль
                                    </NavLink>
                                    <div
                                        className="nav-item nav-link"
                                        onClick={openCloseModal}
                                    >
                                        Выйти
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="navbar-nav w-100">
                        <NavLink to="/orders" className="nav-item nav-link">
                            Заказы
                        </NavLink>
                        {
                            admin.role !== 'админ' ? (
                                <>
                                    <NavLink to="/products" className="nav-item nav-link">
                                        Продукты
                                    </NavLink>
                                    <NavLink to="/categories" className="nav-item nav-link">
                                        Категории
                                    </NavLink>
                                    <NavLink to="/offers" className="nav-item nav-link">
                                        Предложения
                                    </NavLink>
                                    <NavLink to="/slides" className="nav-item nav-link">
                                        Слайды
                                    </NavLink>
                                    <NavLink to="/maps" className="nav-item nav-link">
                                        Ветви
                                    </NavLink>
                                    <NavLink to="/about" className="nav-item nav-link">
                                        О нас
                                    </NavLink>
                                    <NavLink to="/comments" className="nav-item nav-link">
                                        Комментария
                                    </NavLink>
                                </>
                            ) : null
                        }
                        {
                            admin.role === 'владелец' ? (
                                <>
                                    <NavLink to="/users" className="nav-item nav-link">
                                        Пользователи
                                    </NavLink>
                                    <NavLink to="/admin" className="nav-item nav-link">
                                        Админы
                                    </NavLink>
                                    <NavLink to="/payment-types" className="nav-item nav-link">
                                        Тип платежей
                                    </NavLink>
                                    <NavLink to="/footer" className="nav-item nav-link">
                                        Нижний колонтитул
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
                        Выйти ?
                    </h6>
                    <div className='btn-container'>
                        <button
                            className="btn btn-danger"
                            onClick={openCloseModal}
                        >
                            Отмена
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleLogOut}
                        >
                            Да
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
