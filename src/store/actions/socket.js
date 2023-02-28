import {io} from "socket.io-client";

let socket;
const {REACT_APP_API_URL} = process.env;

export const SOCKET_NEW_ORDER = 'SOCKET_NEW_ORDER';

export function socketInit(token) {
    return (dispatch) => {
        if (socket) {
            return;
        }

        socket = io(REACT_APP_API_URL, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        socket.on('connect', () => {
            console.log('connect');
        });

        socket.on('new-order', (data) => {
            dispatch({
                type: SOCKET_NEW_ORDER,
                payload: {data}
            });
        });
    }
}

export function socketDisconnect() {
    return () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }
}
