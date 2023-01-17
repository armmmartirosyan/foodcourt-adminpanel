import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {notReceivedOrdersListRequest} from "../store/actions/orders";
import OrderRow from "./OrderRow";
import EmptyPage from "./EmptyPage";
import {toast} from "react-toastify";
import Helper from "../helpers/Helper";

function Orders() {
    const dispatch = useDispatch();
    const notReceivedOrders = useSelector(state => state.orders.notReceivedOrders);
    const admin = useSelector(state => state.admin.admin);

    useEffect(() => {
        if (!_.isEmpty(admin)) {
            (async () => {
                const data = await dispatch(notReceivedOrdersListRequest({branchId: admin.branchId}));

                if (data.payload?.status === 'error' || data.payload?.status !== 'ok') {
                    toast.error(_.capitalize(Helper.clearAxiosError(data.payload.message)));
                }
            })()
        }
    }, [admin]);

    return (
        <div className="table-responsive">
            <h6 className='title'>Orders</h6>
            {
                !_.isEmpty(notReceivedOrders) ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">User Phone Number</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            notReceivedOrders.map(order => (
                                <OrderRow
                                    order={order}
                                    key={order.id}
                                />
                            ))
                        }
                        </tbody>
                    </table>
                ) : <EmptyPage/>
            }
        </div>
    );
}

export default Orders;


// import React, {useCallback, useEffect, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import _ from "lodash";
// import {modifyOrderRequest, notReceivedOrdersListRequest} from "../store/actions/orders";
// import OrderRow from "./OrderRow";
// import moment from "moment";
// import Modal from "react-modal";
// import OrderProductRow from "./OrderProductRow";
// import {toast} from "react-toastify";
// import EmptyPage from "./EmptyPage";
//
// function Orders() {
//     const dispatch = useDispatch();
//     const notReceivedOrders = useSelector(state => state.orders.notReceivedOrders);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [order, setOrder] = useState({});
//     const [totalPrice, setTotalPrice] = useState(0);
//     const admin = useSelector(state => state.admin.admin);
//
//     useEffect(() => {
//         if (!_.isEmpty(admin)) {
//             (async () => {
//                 await dispatch(notReceivedOrdersListRequest({branchId: admin.branchId}));
//             })()
//         }
//     }, [admin]);
//
//     useEffect(() => {
//         if (!_.isEmpty(order)) {
//             let price = 0;
//
//             order.orders.forEach((tempOrder) => {
//                 price += +tempOrder.quantity * +tempOrder.product.price
//             });
//
//             setTotalPrice(price);
//         }
//     }, [order]);
//
//     const openCloseModal = useCallback((order) => {
//         if (!_.isEmpty(order)) {
//             setOrder(order);
//         }
//
//         if (modalIsOpen) {
//             setOrder({});
//         }
//
//         setModalIsOpen(!modalIsOpen);
//     }, [modalIsOpen]);
//
//     const modifyOrder = useCallback(async (status, id) => {
//         const data = await dispatch(modifyOrderRequest({status, id}));
//
//         if (data.error) {
//             toast.error(data.error.message);
//             return;
//         }
//
//         await dispatch(notReceivedOrdersListRequest({branchId: admin.branchId}));
//
//         setOrder({});
//         setModalIsOpen(false);
//     }, [admin]);
//
//     return (
//         <div className="table-responsive">
//             <h6 className='title'>Orders</h6>
//             {
//                 !_.isEmpty(notReceivedOrders) ? (
//                     <table className="table">
//                         <thead>
//                         <tr>
//                             <th scope="col">ID</th>
//                             <th scope="col">User Phone Number</th>
//                             <th scope="col">Date</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {
//                             notReceivedOrders.map(order => (
//                                 <OrderRow
//                                     order={order}
//                                     key={order.id}
//                                     openCloseModal={openCloseModal}
//                                 />
//                             ))
//                         }
//                         </tbody>
//                     </table>
//                 ) : <EmptyPage/>
//             }
//             <Modal
//                 isOpen={modalIsOpen}
//                 className="modal"
//                 overlayClassName="overlay"
//                 onRequestClose={() => {
//                     openCloseModal()
//                 }}
//             >
//                 <div className="bg-light rounded h-100 p-4 modal-container">
//                     <h6 className="title">Order Products</h6>
//                     {
//                         !_.isEmpty(order) ? (
//                             <table className="table">
//                                 <thead>
//                                 <tr>
//                                     <th scope="col">ID</th>
//                                     <th scope="col">Image</th>
//                                     <th scope="col">Title</th>
//                                     <th scope="col">Quantity</th>
//                                     <th scope="col">Price</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {
//                                     order.orders.map(order => (
//                                         <OrderProductRow
//                                             order={order}
//                                             key={order.id}
//                                         />
//                                     ))
//                                 }
//                                 </tbody>
//                             </table>
//                         ) : null
//                     }
//                     {
//                         !_.isEmpty(order) ? (
//                             <>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {totalPrice}
//                                     </p>
//                                     <label>Total Price(AMD)</label>
//                                 </div>
//                                 {
//                                     order.message ? (
//                                         <div className="form-floating mb-3">
//                                             <p className='form-control'>
//                                                 {order.message}
//                                             </p>
//                                             <label>Message</label>
//                                         </div>
//                                     ) : null
//                                 }
//                                 {
//                                     order.address ? (
//                                         <div className="form-floating mb-3">
//                                             <p className='form-control'>
//                                                 {order.address}
//                                             </p>
//                                             <label>Address</label>
//                                         </div>
//                                     ) : null
//                                 }
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {order.user.firstName}
//                                     </p>
//                                     <label>User Name</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {order.user.phoneNum}
//                                     </p>
//                                     <label>User Phone Number</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {_.capitalize(order.receiveType.split(/(?=[A-Z])/).join(' '))}
//                                     </p>
//                                     <label>Receive Type</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {_.capitalize(order.status.split(/(?=[A-Z])/).join(' '))}
//                                     </p>
//                                     <label>Status</label>
//                                 </div>
//                                 <div className="form-floating mb-3">
//                                     <p className='form-control'>
//                                         {moment(order.createdAt).format('LLL')}
//                                     </p>
//                                     <label>Ordered At</label>
//                                 </div>
//                             </>
//                         ) : null
//                     }
//
//                     <div className='btn-container'>
//                         <button
//                             className="btn btn-outline-danger"
//                             onClick={() => {
//                                 openCloseModal()
//                             }}
//                         >
//                             Cancel
//                         </button>
//                         {
//                             order.status === 'pending' ? (
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={async () => {
//                                         await modifyOrder('inProcess', order.id)
//                                     }}
//                                 >
//                                     In Process
//                                 </button>
//                             ) : null
//                         }
//                         {
//                             order.status === 'inProcess' ? (
//                                 <button
//                                     className="btn btn-success"
//                                     onClick={async () => {
//                                         await modifyOrder('ready', order.id)
//                                     }}
//                                 >
//                                     Ready
//                                 </button>
//                             ) : null
//                         }
//                         {
//                             order.status === 'ready'
//                             && (order.receiveType === 'cashOnDelivery'
//                                 || order.receiveType === 'cardOnDelivery') ? (
//                                 <button
//                                     className="btn btn-warning"
//                                     onClick={async () => {
//                                         await modifyOrder('onTheWay', order.id)
//                                     }}
//                                 >
//                                     On The Way
//                                 </button>
//                             ) : null
//                         }
//                         {
//                             order.status === 'ready'
//                             || order.status === 'onTheWay' ? (
//                                 <button
//                                     className="btn btn-secondary"
//                                     onClick={async () => {
//                                         await modifyOrder('received', order.id)
//                                     }}
//                                 >
//                                     Received
//                                 </button>
//                             ) : null
//                         }
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     );
// }
//
// export default Orders;
