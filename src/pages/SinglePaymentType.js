import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "../components/TopBar";
import Single from "../components/Single";
import _ from "lodash";
import Wrapper from "../components/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";
import Validator from "../helpers/Validator";
import {
    addPaymentTypeRequest,
    deletePaymentTypeRequest,
    singlePaymentTypeRequest,
    updatePaymentTypeRequest
} from "../store/actions/paymentTypes";
import {errorConfig} from "../helpers/ErrorConfig";

function SinglePaymentType() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const statusGetSingle = useSelector(state => state.status.paymentTypesGetSingleStatus);
    const statusAdd = useSelector(state => state.status.paymentTypesAddStatus);
    const statusUpdate = useSelector(state => state.status.paymentTypesUpdateStatus);
    const statusDelete = useSelector(state => state.status.paymentTypesDeleteStatus);
    const admin = useSelector(state => state.admin.admin);
    const [paymentType, setPaymentType] = useState({});
    const [values, setValues] = useState({
        type: '',
        typeName: '',
        allowUse: false,
    });

    const drawData = [
        {
            path:['type'],
            label:'Способ оплаты',
        },
        {
            path:['typeName'],
            label:'Название типа платежа',
        },
        {
            path:['allowUse'],
            label:'Разрешить использование',
        },
    ];

    useEffect(() => {
        if(params.id){
            (async () => {
                const data = await dispatch(singlePaymentTypeRequest({id: params.id}));

                if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                    return;
                }
                const tempPaymentType = data?.payload?.singlePaymentType;

                setPaymentType({...tempPaymentType});
                setValues({
                    ...values,
                    ...tempPaymentType,
                    allowUse: tempPaymentType.allowUse === 't'
                });
            })()
        }
    }, [params.id]);

    const handleChangeValues = useCallback((val, key) => {
        setValues({
            ...values,
            [key]: val,
        });
    }, [values]);

    const handleAddPaymentType = useCallback(async () => {
        const validateValues = [
            Validator.validString(values.type, errorConfig.paymentType),
            Validator.validString(values.typeName, errorConfig.paymentTypeName),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(invalidVal);
            return;
        }

        const data = await dispatch(addPaymentTypeRequest({
            type: values.type,
            typeName: values.typeName,
            allowUse: values.allowUse,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Тип платежа добавлен');
        navigate('/payment-types');
    }, [values]);

    const handleUpdatePaymentType = useCallback(async () => {
        const validateValues = [
            values.type ? Validator.validString(values.type, errorConfig.paymentType) : true,
            values.typeName ? Validator.validString(values.typeName, errorConfig.paymentTypeName) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(invalidVal);
            return;
        }

        if (!values.type && !values.typeName) {
            toast.error("Заполните одно из полей");
            return;
        }

        const data = await dispatch(updatePaymentTypeRequest({
            id: paymentType.id,
            type: values.type || undefined,
            typeName: values.typeName || undefined,
            allowUse: values.allowUse,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Тип платежа обновлен');
        navigate('/payment-types');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deletePaymentTypeRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Тип платежа удален');
        navigate('/payment-types');
    }, []);

    return (
        <Wrapper
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
            pageName={`способ оплаты${paymentType.typeName ? ' - ' + paymentType.typeName : ''}`}
        >
            <TopBar
                pageName={`способ оплаты${paymentType.typeName ? ' - ' + paymentType.typeName : ''}`}
                allowAdd={false}
            />

            {
                statusGetSingle === 'success' ? (
                    <Single
                        drawData={drawData}
                        obj={paymentType}
                        changeValues={handleChangeValues}
                        values={values}
                    />
                ) : null
            }

            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Назад
                </button>
                {
                    !_.isEmpty(paymentType) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'админ'}
                            onClick={async (e) => {
                                await handleDelete(e, paymentType.id)
                            }}
                        >
                            Удалить
                        </button>
                    ) : null
                }
                <button
                    className="btn btn-primary"
                    disabled={admin && admin.role === 'админ'}
                    onClick={
                        !_.isEmpty(paymentType) ? handleUpdatePaymentType : handleAddPaymentType
                    }
                >
                    {
                        !_.isEmpty(paymentType) ? 'Обнавить' : 'Добавить'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SinglePaymentType;
