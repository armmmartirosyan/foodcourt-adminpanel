import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "../components/TopBar";
import Single from "../components/Single";
import _ from "lodash";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import {createAboutRequest, getAboutRequest, updateAboutRequest} from "../store/actions/about";

const drawData = [
    {
        path: ['title'],
        label: 'Заголовок',
        disabled: false,
    },
    {
        path: ['description'],
        label: 'Описание',
        disabled: false,
    },
];

function About() {
    const dispatch = useDispatch();
    const getAboutStatus = useSelector(state => state.status.aboutGetStatus);
    const createAboutStatus = useSelector(state => state.status.aboutCreateStatus);
    const updateAboutStatus = useSelector(state => state.status.aboutUpdateStatus);
    const about = useSelector(state => state.about.about);
    const [values, setValues] = useState({
        title: '',
        description: '',
    });

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        });
    }, [values]);

    const handleCreateAbout = useCallback(async () => {
        const data = await dispatch(createAboutRequest({
            title: values.title,
            description: values.description,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Создано успешно');
    }, [values]);

    const handleUpdateAbout = useCallback(async () => {
        const data = await dispatch(updateAboutRequest({
            id: about.id,
            title: values.title,
            description: values.description,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('успешно обновлен');
    }, [values, about]);

    useEffect(() => {
        (async () => {
            const data = await dispatch(getAboutRequest());

            if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                return;
            }

            const newFooter = data.payload.about;
            setValues({
                title: newFooter.title,
                description: newFooter.description,
            })
        })()
    }, []);

    return (
        <Wrapper
            statuses={{getAboutStatus, createAboutStatus, updateAboutStatus}}
            pageName='о нас'
        >
            <TopBar
                pageName='о нас'
                allowAdd={false}
            />
            <Single
                drawData={drawData}
                obj={about}
                changeValues={handleChangeValues}
                values={values}
            />
            <button
                className="btn btn-primary"
                onClick={
                    !_.isEmpty(about) ? handleUpdateAbout : handleCreateAbout
                }
            >
                {
                    !_.isEmpty(about) ? 'Обнавить' : 'Создать'
                }
            </button>
        </Wrapper>
    );
}

export default About;
