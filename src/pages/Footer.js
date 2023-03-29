import React, {useCallback, useEffect, useState} from 'react';
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {createFooterRequest, getFooterRequest, updateFooterRequest} from "../store/actions/footer";
import TopBar from "../components/TopBar";
import _ from 'lodash';
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import Single from "../components/Single";
import Table from "../components/Table";
import {Link} from "react-router-dom";

const drawData = [
    {
        path: ['copyright'],
        label: 'Авторские права',
        disabled: false,
    },
    {
        path: ['socialMediaTitle'],
        label: 'Заголовок в социальных сетях',
        disabled: false,
    },
];

const tableHeader = [
    {
        path:['imagePath'],
        label:'Икона',
    },
    {
        path:['link'],
        label:'Ссылка',
    },
];

function Footer() {
    const dispatch = useDispatch();
    const getFooterStatus = useSelector(state => state.status.footerGetStatus);
    const createFooterStatus = useSelector(state => state.status.footerCreateStatus);
    const updateFooterStatus = useSelector(state => state.status.footerUpdateStatus);
    const footer = useSelector(state => state.footer.footer);
    const [values, setValues] = useState({
        copyright: '',
        socialMediaTitle: '',
    });

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        });
    }, [values]);

    const handleCreateFooter = useCallback(async () => {
        const data = await dispatch(createFooterRequest({
            copyright: values.copyright,
            socialMediaTitle: values.socialMediaTitle,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Нижний колонтитул успешно создан');
    }, [values]);

    const handleUpdateFooter = useCallback(async () => {
        const data = await dispatch(updateFooterRequest({
            id: footer.id,
            copyright: values.copyright,
            socialMediaTitle: values.socialMediaTitle,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Нижний колонтитул успешно обновлен');
    }, [values, footer]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getFooterRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const newFooter = data.payload.footer;
            setValues({
                copyright: newFooter.copyright,
                socialMediaTitle: newFooter.socialMediaTitle,
            })
        })()
    }, []);

    return (
        <Wrapper
            statuses={{getFooterStatus, createFooterStatus, updateFooterStatus}}
            pageName='нижний колонтитул'
        >
            <TopBar
                pageName='нижний колонтитул'
                allowAdd={false}
            />
            <div className='footer'>
                <Single
                    drawData={drawData}
                    obj={footer}
                    changeValues={handleChangeValues}
                    values={values}
                />
                <button
                    className="btn btn-primary"
                    onClick={
                        !_.isEmpty(footer) ? handleUpdateFooter : handleCreateFooter
                    }
                >
                    {
                        !_.isEmpty(footer) ? 'Обнавить' : 'Создать'
                    }
                </button>
            </div>
            <div className="footer__social">
                <h1 className="footer__social__title">Социальные сети</h1>
                {
                    !_.isEmpty(footer) && !_.isEmpty(footer.social) ? (
                        <Table
                            tableHeader={tableHeader}
                            list={footer.social}
                            path='footer/social'
                        />
                    ) : null
                }
                <Link
                    className="btn btn-primary"
                    to='/footer/social'
                >
                    Создайте социальные сети
                </Link>
            </div>
        </Wrapper>
    );
}

export default Footer;
