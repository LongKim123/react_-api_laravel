import axiosClient from "./axiosClient";
class UserApi {
    getAll = (params) => {
    const url = '/list-user';
    
    if(JSON.parse(localStorage.getItem('user'))!==null){
          const  token=JSON.parse(localStorage.getItem('user')).token;
            return axiosClient.post(url, { params},{
                headers: {
                    'token':token ,
                }} ) ;
            }
            else{
                return axiosClient.post(url, { params},{
                    headers: {
                        'token':'' ,
                    }} ) ;

            };
    }
    RegisterAPI = (username,email,password) => {
        const url = '/register';
        return axiosClient.post(url, { username,email,password });
    };

    LoginAPI = (email,password) => {
        const url = '/login';
        return axiosClient.post(url, {email,password });
    };
    Logout=(params)=>{
        const url = '/delete-token';
    
        if(JSON.parse(localStorage.getItem('user'))!==null){
              const  token=JSON.parse(localStorage.getItem('user')).token;
                return axiosClient.post(url, { params},{
                    headers: {
                        'token':token ,
                    }} ) ;
                }
                else{
                    return axiosClient.post(url, { params},{
                        headers: {
                            'token':'' ,
                        }} ) ;
    
                };

    }
}
    
    
    const userApi = new UserApi();
    export default userApi;