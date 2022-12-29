import axios from "axios";
import Account from "./helpers/Account";

const { REACT_APP_API_URL } = process.env;
const api = axios.create({
    baseURL: REACT_APP_API_URL,
    headers: {
        Authorization: Account.getToken(),
        'Content-Type': 'application/json',
    }
});

class Api {
    //Categories
    static getAllCategoriesList(name) {
        return api.get(`/categories/get`, {params: {name}});
    }

    static addCategory(onUploadProgress, props) {
        return api.post(`/categories`, props, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateCategory(slugName, onUploadProgress, props) {
        return api.put(`/categories/${slugName}`, props, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteCategory(slugName) {
        return api.delete(`/categories/${slugName}`);
    }

    //Products
    static getAllProductsList(page, title) {
        return api.get(`/products/get`, {params: {page, title}});
    }

    static getProductsByCat(categorySlug, params) {
        return api.get(`/products/get/category/${categorySlug}`, params);
    }

    static addProduct(onUploadProgress, params) {
        return api.post(`/products`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateProduct(slugName, onUploadProgress, params) {
        return api.put(`/products/${slugName}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteProduct(slugName) {
        return api.delete(`/products/${slugName}`);
    }

    //News
    static getAllNewsList(page, title) {
        return api.get(`/news/get`, {params: {page, title}});
    }

    static addNews(onUploadProgress, params) {
        return api.post(`/news`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateNews(slugName, onUploadProgress, params) {
        return api.put(`/news/${slugName}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteNews(slugName) {
        return api.delete(`/news/${slugName}`);
    }

    //Offers
    static getAllOffersList(title) {
        return api.get(`/offers/get`, {params: {title}});
    }

    static addOffer(onUploadProgress, params) {
        return api.post(`/offers`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateOffer(slugName, onUploadProgress, params) {
        return api.put(`/offers/${slugName}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteOffer(slugName) {
        return api.delete(`/offers/${slugName}`);
    }

    //Slides
    static getAllSlidesList() {
        return api.get(`/slides/get`);
    }

    static addSlide(onUploadProgress, params) {
        return api.post(`/slides`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateSlide(id, onUploadProgress, params) {
        return api.put(`/slides/${id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteSlide(id) {
        return api.delete(`/slides/${id}`);
    }

    //Branches
    static getAllBranchesList() {
        return api.get(`/map/get`);
    }

    static addBranch(onUploadProgress, params) {
        return api.post(`/map`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateBranch(slugName, onUploadProgress, params) {
        return api.put(`/map/${slugName}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteBranch(slugName) {
        return api.delete(`/map/${slugName}`);
    }

    //Users
    static getAllUsersList(page, name) {
        return api.get(`/users/`, {params: {page, name}});
    }

    static deleteUserAccount(id) {
        return api.delete(`/users/${id}`);
    }

    //Admin
    static getAdmin() {
        return api.get(`/admin/current`);
    }

    static getAllAdminsList() {
        return api.get(`/admin/`);
    }

    static getSingleAdmin(id) {
        return api.get(`/admin/${id}`);
    }

    static registerAdmin(params) {
        return api.post(`/admin/register`, params);
    }

    static modifyAdminAccount(id, params) {
        return api.put(`/admin/${id}`, params);
    }

    static deleteAdminAccount(id) {
        return api.delete(`/admin/${id}`);
    }

    static modifyCurrentAccount(params) {
        return api.put(`/admin/current`, params);
    }

    static deleteCurrentAccount() {
        return api.delete(`/admin/current`);
    }

    static signIn({email, password}) {
        return api.post(`/admin/login`, {email, password});
    }

    static getKey(email) {
        return api.post(`/admin/forget-pass`, {email});
    }

    static changeAdminPass(params) {
        return api.post(`/admin/change-pass`, {...params});
    }
}

export default Api;
