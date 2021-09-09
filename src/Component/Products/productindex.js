import React, { Component } from "react";
import {Prompt, Redirect,useHistory} from 'react-router-dom';
import MainMenu from '../MainLayout/mainlayout';
class ListProduct extends Component{
    render() {
        return (
           
            <>
             < MainMenu />
             <p>Trang Product</p>
             
            </>
        );
    }
}
export default ListProduct;