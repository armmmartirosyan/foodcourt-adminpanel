export default class Validator{
    static validFName = (name) => {
        const reg = /^\w{2,}$/i;
        return !reg.test(name) ? "first name (at least 2 letters)" : true;
    }
    static validLName = (name) => {
        const reg = /^\w{2,}$/i;
        return !reg.test(name) ? "last name (at least 2 letters)" : true;
    }
    static validEmail = (email) => {
        const reg = /^(\w{8,})@([a-z]{2,})\.([a-z]{2,6})$/i;
        return !reg.test(email) ? "email" : true;
    }
    static validPass = (pass) => {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return !reg.test(pass) ? "password (at least 1 uppercase letter, 1 number and 8 symbols)" : true;
    }
    static validPhoneNum = (phone) => {
        const reg = /^\d{11,20}$/;
        return !reg.test(phone) ? "phone number (11-20 numbers)" : true;
    }
    static validPossibility = (possibility) => {
        const reg = /^junior|middle|senior$/;
        return !reg.test(possibility) ? "possibility (junior, middle or senior)" : true;
    }
    static validUUID = (uuid) => {
        const reg = /^.{30,}$/;
        return !reg.test(uuid) ? "uuid token" : true;
    }
    static validTitle = (title) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(title) ? "title (at least 3 letters)" : true;
    }
    static validName = (name) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(name) ? "name (at least 3 letters)" : true;
    }
    static validDesc = (desc) => {
        const reg = /^(?=.*[a-zA-Z]).{10,}$/mg;
        return !reg.test(desc) ? "description (at least 10 letters)" : true;
    }
    static validSlug = (slug) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(slug) ? "slug (at least 3 letters)" : true;
    }
    static validPrice = (price) => {
        const reg = /^[1-9]\d+$/i;
        return !reg.test(price) ? "price (minimum can be 10AMD)" : true;
    }
    static validGeometry = (point) => {
        const reg = /^(-?\d+(\.\d+)?)$/;
        return !reg.test(point) ? "point" : true;
    }
}
