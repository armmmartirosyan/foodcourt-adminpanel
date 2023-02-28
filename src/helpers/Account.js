const {REACT_APP_ADMIN_TOKEN_KEY} = process.env;

export default class Account {
    static getToken = () => {
        return localStorage.getItem(REACT_APP_ADMIN_TOKEN_KEY) || sessionStorage.getItem(REACT_APP_ADMIN_TOKEN_KEY) || '';
    };

    static setToken = (token, isRemembered) => {
        if (isRemembered) {
            localStorage.setItem(REACT_APP_ADMIN_TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(REACT_APP_ADMIN_TOKEN_KEY, token);
        }
    };

    static deleteToken = () => {
        if (localStorage.getItem(REACT_APP_ADMIN_TOKEN_KEY)) {
            localStorage.removeItem(REACT_APP_ADMIN_TOKEN_KEY);
        } else if (sessionStorage.getItem(REACT_APP_ADMIN_TOKEN_KEY)) {
            sessionStorage.removeItem(REACT_APP_ADMIN_TOKEN_KEY);
        }
    };
}
