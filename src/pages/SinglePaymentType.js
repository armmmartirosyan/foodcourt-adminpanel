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
    });

    const drawData = [
        {
            path:['type'],
            label:'Payment type',
        },
        {
            path:['typeName'],
            label:'Payment type name',
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
                    ...tempPaymentType
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
            Validator.validString(values.type),
            Validator.validString(values.typeName),
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        const data = await dispatch(addPaymentTypeRequest({
            type: values.type,
            typeName: values.typeName,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Payment type added successfully');
        navigate('/payment-types');
    }, [values]);

    const handleUpdatePaymentType = useCallback(async () => {
        const validateValues = [
            values.type ? Validator.validString(values.type) : true,
            values.typeName ? Validator.validString(values.typeName) : true,
        ];

        const invalidVal = validateValues.find((v) => v!==true);

        if(invalidVal){
            toast.error(`Invalid ${invalidVal}`);
            return;
        }

        if (!values.type && !values.typeName) {
            toast.error("Fill one of fields.");
            return;
        }

        const data = await dispatch(updatePaymentTypeRequest({
            id: paymentType.id,
            type: values.type || undefined,
            typeName: values.typeName || undefined,
        }));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Payment type updated successfully');
        navigate('/payment-types');
    }, [values]);

    const handleDelete = useCallback(async (e, id) => {
        e.stopPropagation();
        const data = await dispatch(deletePaymentTypeRequest({id}));

        if (!_.isEmpty(data.payload) && (data.payload.status === 'error' || data.payload.status !== 'ok')) {
            toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
            return;
        }

        toast.success('Payment type deleted successfully.');
        navigate('/payment-types');
    }, []);

    return (
        <Wrapper
            statuses={{statusAdd, statusDelete, statusUpdate, statusGetSingle}}
            pageName={`payment type${paymentType.typeName ? ' - ' + paymentType.typeName : ''}`}
        >
            <TopBar
                pageName={`payment type${paymentType.typeName ? ' - ' + paymentType.typeName : ''}`}
                allowAdd={false}
            />

            <Single
                drawData={drawData}
                obj={paymentType}
                changeValues={handleChangeValues}
                values={values}
            />

            <div className='btn-container'>
                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Back
                </button>
                {
                    !_.isEmpty(paymentType) ? (
                        <button
                            className="btn btn-danger"
                            disabled={admin && admin.role === 'manager'}
                            onClick={async (e) => {
                                await handleDelete(e, paymentType.id)
                            }}
                        >
                            Delete
                        </button>
                    ) : null
                }
                <button
                    className="btn btn-primary"
                    disabled={admin && admin.role === 'manager'}
                    onClick={
                        !_.isEmpty(paymentType) ? handleUpdatePaymentType : handleAddPaymentType
                    }
                >
                    {
                        !_.isEmpty(paymentType) ? 'Update' : 'Add'
                    }
                </button>
            </div>
        </Wrapper>
    );
}

export default SinglePaymentType;
