export default class Validator{
    static validString = (str) => {
        const reg = /^(?=.*[a-zA-Z]).+$/mg;
        return !reg.test(str) ? "Invalid value (at least 2 letters)" : true;
    }
    static validEmail = (email) => {
        const reg = /^(\w{8,})@([a-z]{2,})\.([a-z]{2,6})$/i;
        return !reg.test(email) ? "Invalid email" : true;
    }
    static validPhoneNum = (phone) => {
        const reg = /^\d{10,25}$/;
        return !reg.test(phone) ? "Invalid phone number (10-25 numbers)" : true;
    }
    static validNumGreatOne = (num) => {
        const reg = /^[1-9]\d*$/i;
        return !reg.test(num) ? "Invalid value (enter only number great 1)" : true;
    }
    static validEverySymbol = (symbol) => {
        const reg = /^.+$/;
        return !reg.test(symbol) ? "Invalid value" : true;
    }
}
