import React from 'react';
import IndexLogin from "./Component/Login/main";
import MainLayout from "./Component/MainLayout/mainlayout";
const routes= [
    {
        path:'/',
        exact:true,
        main:()=><IndexLogin/>
    },
    {
        path:'/layout',
        exact:true,
        main:() => <MainLayout/>
    },
  
    

];
export default routes;