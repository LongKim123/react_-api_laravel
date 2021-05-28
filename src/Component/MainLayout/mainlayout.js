import React, { Component } from "react";
import {Prompt, Redirect,useHistory} from 'react-router-dom';
class MainLayout extends Component{
    constructor (props){
        super(props);
        this.state={isLogin:null}
    }
    Logout=()=>{
        
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
            return <div><p>Vào đk r nè</p>
            <button className="btn" type="submit" onClick={this.Logout}>Đăng Xuất</button></div>
        }
        
        
    };

}

export default MainLayout;