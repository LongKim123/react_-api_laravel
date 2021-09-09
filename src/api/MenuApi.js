import axiosClient from "./axiosClient";
class MenuApi {
    getAll = (params) => {
    const url = '/list-menu';
    
    if(JSON.parse(localStorage.getItem('user'))!==null){
          const  token=JSON.parse(localStorage.getItem('user')).token;
            return axiosClient.post(url, { params},{
                headers: {
                    'token':token,
                }} ) ;
            }
            else{
                return axiosClient.post(url, { params},{
                    headers: {
                        'token':'' ,
                    }} ) ;

            };
    }
    DeleteMenu = (id) => {
        const url = '/delete-menu';
        
        if(JSON.parse(localStorage.getItem('user'))!==null){
              const  token=JSON.parse(localStorage.getItem('user')).token;
                return axiosClient.post(url, { id},{
                    headers: {
                        'token':token,
                    }} ) ;
                }
                else{
                    return axiosClient.post(url, { id},{
                        headers: {
                            'token':'' ,
                        }} ) ;
    
                };
        }
        getCate=(params)=>{
            const url='get-cate';
            return axiosClient.get(url, { params},{
               } ) ;
        }
        AddMenu=(namemenu,parent_id)=>{
            const url = '/add-menu';
    
            if(JSON.parse(localStorage.getItem('user'))!==null){
                  const  token=JSON.parse(localStorage.getItem('user')).token;
                    return axiosClient.post(url, {namemenu,parent_id},{
                        headers: {
                            'token':token,
                        }} ) ;
                    }
                    else{
                        return axiosClient.post(url, { },{
                            headers: {
                                'token':'' ,
                            }} ) ;
        
                    };
            
        }
        EditMenu=(id)=>{
            const url = '/get-cate-edit';
    
            if(JSON.parse(localStorage.getItem('user'))!==null){
                  const  token=JSON.parse(localStorage.getItem('user')).token;
                    return axiosClient.post(url, {id},{
                        headers: {
                            'token':token,
                        }} ) ;
                    }
                    else{
                        return axiosClient.post(url, { },{
                            headers: {
                                'token':'' ,
                            }} ) ;
        
                    };
            
        }
        Update=(id,namemenu,parent_id)=>{
            const url = '/edit-menu';
    
            if(JSON.parse(localStorage.getItem('user'))!==null){
                  const  token=JSON.parse(localStorage.getItem('user')).token;
                    return axiosClient.post(url, {id,namemenu,parent_id},{
                        headers: {
                            'token':token,
                        }} ) ;
                    }
                    else{
                        return axiosClient.post(url, { },{
                            headers: {
                                'token':'' ,
                            }} ) ;
        
                    };
            
        }
        
   
}
    
    
    const menuApi = new MenuApi();
    export default menuApi;