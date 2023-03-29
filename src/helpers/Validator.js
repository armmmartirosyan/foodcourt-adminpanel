export default class Validator{
    static validString = (str, errMsg) => {
        const reg = /^(?=.*[а-яА-Яa-zA-Z]).+$/mg;
        return !reg.test(str) ? errMsg || "" : true;
    }
    static validEmail = (email, errMsg) => {
        const reg = /^([a-z\w\.-]{8,})@([a-z]{2,})\.([a-z]{2,6})$/i;
        return !reg.test(email) ? errMsg || "" : true;
    }
    static validPhoneNum = (phone, errMsg) => {
        const reg = /^\d{10,25}$/;
        return !reg.test(phone) ? errMsg || "" : true;
    }
    static validNumGreatOne = (num, errMsg) => {
        const reg = /^[1-9]\d*$/i;
        return !reg.test(num) ? errMsg || "" : true;
    }
    static validEverySymbol = (symbol, errMsg) => {
        const reg = /^.+$/;
        return !reg.test(symbol) ? errMsg || "" : true;
    }
}
