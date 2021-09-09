import React from 'react';
import IndexLogin from "./Component/Login/main";
import MainLayout from "./Component/MainLayout/mainlayout";
import MenuList from "./Component/Menu/menuindex";
import AddMenu from "./Component/Menu/addMenu";
import EditMenu from "./Component/Menu/editMenu";
import ListProduct from "./Component/Products/productindex";
import ListBrand from "./Component/Brands/index";
import AddBrand from "./Component/Brands/addBrand";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
const routes= [
    {
        path:'/',
        exact:true,
        main:()=><IndexLogin/>
    },
 
    {
        tittle:'Home',
        path:'/home',
        exact:true,
        icon:<AiIcons.AiFillHome/>,
        cName:'nav-text',
        main:() => <MainLayout/>
        //main:()=><IndexLogin/>
    },
    {
        tittle:'AddMenu',
        path:'/add-menu',
        exact:false,
        main:() => <AddMenu/>,
        
    },
    {
        tittle:'EditMenu',
        path:'/edit-menu/:id',
        exact:false,
        main:({match}) => <EditMenu match={match}/>,
        
    },
    {
        tittle:'ListMenu',
        path:'/list-menu',
        exact:false,
        icon:<IoIcons.IoIosPaper/>,
        main:() => <MenuList/>,
        cName:'nav-text'
    },
    {
        tittle:'ListProduct',
        path:'/list-product',
        exact:false,
        icon:<FaIcons.FaCartPlus/>,
        main:() => <ListProduct/>,
        cName:'nav-text'
    },
    {
        tittle:'ListBrand',
        path:'/list-brand',
        exact:false,
        icon:<IoIcons.IoIosPaper/>,
        main:() => <ListBrand/>,
        cName:'nav-text'
    },
    {
        tittle:'AddBrand',
        path:'/add-brand',
        exact:false,
        main:() => <AddBrand/>,
    },
    
  
    

];

export default routes;