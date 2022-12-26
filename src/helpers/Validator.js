export default class Validator{
    static validFName = (name) => {
        const reg = /^\w{2,}$/i;
        return !reg.test(name) ? "first name" : true;
    }
    static validLName = (name) => {
        const reg = /^\w{2,}$/i;
        return !reg.test(name) ? "last name" : true;
    }
    static validEmail = (email) => {
        const reg = /^(\w{8,})@([a-z]{2,})\.([a-z]{2,6})$/i;
        return !reg.test(email) ? "email" : true;
    }
    static validPass = (pass) => {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return !reg.test(pass) ? "password" : true;
    }
    static validPhoneNum = (phone) => {
        const reg = /^\d{11,20}$/;
        return !reg.test(phone) ? "phone number" : true;
    }
    static validPossibility = (possibility) => {
        const reg = /^junior|middle|senior$/;
        return !reg.test(possibility) ? "possibility" : true;
    }
    static validUUID = (uuid) => {
        const reg = /^.{30,}$/;
        return !reg.test(uuid) ? "uuid token" : true;
    }
    static validTitle = (title) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(title) ? "title" : true;
    }
    static validName = (name) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(name) ? "name" : true;
    }
    static validDesc = (desc) => {
        const reg = /^(?=.*[a-zA-Z]).{10,}$/mg;
        return !reg.test(desc) ? "description" : true;
    }
    static validSlug = (slug) => {
        const reg = /^(?=.*[a-zA-Z]).{3,}$/mg;
        return !reg.test(slug) ? "slug" : true;
    }
    static validPrice = (price) => {
        const reg = /^[1-9]\d+$/i;
        return !reg.test(price) ? "price" : true;
    }
    static validGeometry = (point) => {
        const reg = /^(-?\d+(\.\d+)?)$/;
        return !reg.test(point) ? "point" : true;
    }
}
