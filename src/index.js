import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import reducer from './store/reducers/index';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-modal";

Modal.setAppElement(document.getElementsByTagName('body'));

export const store = configureStore({
    reducer: reducer,
    devTools: true,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

reportWebVitals();
