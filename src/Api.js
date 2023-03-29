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
    //OrdersPage
    static ordersStatistics(productId, year) {
        return api.get(`/orders?productId=${productId}&year=${year}`);
    }

    static notReceivedOrdersList(branchId) {
        return api.get(`/orders/not-received?branchId=${branchId}`);
    }

    static singleNotReceivedOrder(id) {
        return api.get(`/orders/not-received/${id}`);
    }

    static modifyOrder(status, id) {
        return api.put(`/orders/${id}`, {status});
    }

    //Products
    static getProductsList(page, title, category) {
        return api.get(`/products/get`, {params: {page, title, category}});
    }

    static getAllProductsList() {
        return api.get(`/products/get/all`);
    }

    static getSingleProduct(slugName) {
        return api.get(`/products/get/${slugName}`);
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

    static updateProduct(id, onUploadProgress, params) {
        return api.put(`/products/${id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteProduct(id) {
        return api.delete(`/products/${id}`);
    }

    //Categories
    static getAllCategoriesList(name) {
        return api.get(`/categories/get`, {params: {name}});
    }

    static singleCategoryList(slugName) {
        return api.get(`/categories/get/${slugName}`);
    }

    static addCategory(onUploadProgress, props) {
        return api.post(`/categories`, props, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateCategory(id, onUploadProgress, props) {
        return api.put(`/categories/${id}`, props, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteCategory(id) {
        return api.delete(`/categories/${id}`);
    }

    //Payment types
    static getAllPaymentTypes() {
        return api.get(`/payment-types`);
    }

    static singlePaymentType(id) {
        return api.get(`/payment-types/${id}`);
    }

    static addPaymentType(props) {
        return api.post(`/payment-types`, props);
    }

    static updatePaymentType(id, props) {
        return api.put(`/payment-types/${id}`, props);
    }

    static deletePaymentType(id) {
        return api.delete(`/payment-types/${id}`);
    }

    static allowBuy(allow) {
        return api.put(`/payment-types/allow-pay`, {allow});
    }

    //Offers
    static getAllOffersList(title, category) {
        return api.get(`/offers/get`, {params: {title, category}});
    }

    static getSingleOffer(slugName) {
        return api.get(`/offers/get/${slugName}`);
    }

    static addOffer(onUploadProgress, params) {
        return api.post(`/offers`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateOffer(id, onUploadProgress, params) {
        return api.put(`/offers/${id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteOffer(id) {
        return api.delete(`/offers/${id}`);
    }

    //Slides
    static getAllSlidesList() {
        return api.get(`/slides/get`);
    }

    static getSingleSlide(id) {
        return api.get(`/slides/get/${id}`);
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

    static getSingleBranch(id) {
        return api.get(`/map/get/${id}`);
    }

    static addBranch(onUploadProgress, params) {
        return api.post(`/map`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateBranch(id, onUploadProgress, params) {
        return api.put(`/map/${id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        });
    }

    static deleteBranch(id) {
        return api.delete(`/map/${id}`);
    }

    //Users
    static getAllUsersList(page, name) {
        return api.get(`/users/`, {params: {page, name}});
    }

    static getSingleUser(id) {
        return api.get(`/users/${id}`);
    }

    static changeUserStatus(id, status) {
        return api.post(`/users/${id}`, {status});
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

    static signIn(email, password) {
        return api.post(`/admin/login`, {email, password});
    }

    static getKey(email) {
        return api.post(`/admin/forget-pass`, {email});
    }

    static changeAdminPass(params) {
        return api.post(`/admin/change-pass`, {...params});
    }

    //Footer
    static getFooter() {
        return api.get(`/footer/get`);
    }

    static createFooter(params) {
        return api.post(`/footer`, params);
    }

    static updateFooter(id, params) {
        return api.put(`/footer/${id}`, params);
    }

    static getSingleFooterSocial(id) {
        return api.get(`/footer/social/get/${id}`);
    }

    static addFooterSocial(onUploadProgress, params) {
        return api.post(`/footer/social`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static updateFooterSocial(id, onUploadProgress, params) {
        return api.put(`/footer/social/${id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
    }

    static deleteFooterSocial(id) {
        return api.delete(`/footer/social/${id}`);
    }

    //Comment
    static getComments() {
        return api.get(`/comment`);
    }

    static getSingleComment(id) {
        return api.get(`/comment/${id}`);
    }

    static updateCommentStatus(id, status) {
        return api.put(`/comment/${id}`, {status});
    }

    //About
    static getAbout() {
        return api.get(`/about/get`);
    }

    static createAbout(params) {
        return api.post(`/about`, params);
    }

    static updateAbout(id, params) {
        return api.put(`/about/${id}`, params);
    }
}

export default Api;
