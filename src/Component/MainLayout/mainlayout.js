import React, { Component } from "react";
import {Prompt, Redirect,useHistory,Link} from 'react-router-dom';
import loginImg from "../../login.svg";
import userApi from '../../api/UserApi';
import Navbar from '../Partial/navbar';
class MainLayout extends Component{
    constructor (props){
        super(props);
        this.state={isLogin:null}
    }
    componentDidMount(){
        userApi.getAll().then(
            (res) =>{
              console.log(res.data); 
            }
        );
           
        

    }
    Logout=()=>{
        userApi.Logout().then(
            (res) =>{
              console.log(res.data); 
            }
        );
        localStorage.removeItem("user");
        this.setState({
            isLogin:1
        })
         
        
    }
    render(){
        if(localStorage.getItem('user') == null)
        {
         var {location} = this.props;
            return <Redirect to={
                {
                    pathname:'/',
                    state:{
                        from: location
                    }
                }
            }/>
        }
        else{
            return <>
            <Navbar Logout={this.Logout}/>
            
           
            </>
        }
        
        
    };

}

export default MainLayout;