import {io} from "socket.io-client";
import newMessageAudio from '../../assets/audio/new-message.mp3';

let socket;
const {REACT_APP_API_URL} = process.env;
const audio = new Audio(newMessageAudio);

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
            try {
                console.log('audio');
                audio.play();
            } catch (e) {
                //
            }

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
