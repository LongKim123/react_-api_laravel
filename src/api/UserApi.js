import axiosClient from "./axiosClient";
class UserApi {
    getAll = (params) => {
    const url = '/list-user';
    return axiosClient.get(url, { params });
    };
    RegisterAPI = (username,email,password) => {
        const url = '/register';
        return axiosClient.post(url, { username,email,password });
        };
        LoginAPI = (email,password) => {
            const url = '/login';
            return axiosClient.post(url, {email,password });
            };
    }
    
    
    const userApi = new UserApi();
    export default userApi;