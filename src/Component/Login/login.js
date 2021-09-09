import React, { Component } from "react";
import loginImg from "../../login.svg";
import userApi from '../../api/UserApi';
import MainLayout from '../MainLayout/mainlayout';
import {Prompt,Route, Redirect} from 'react-router-dom';
class Login extends Component{
    constructor(props) {
        super(props);
        this.state={email:null,
                    password:null,
                    handlepage:null
                    }
      }
      handleChange=(event)=>{
        let name=event.target.name;
        let value=event.target.value;
       
        let data={};
        data[name]=value;
        this.setState(data);
     
      
    }
    
  
      callAPI=()=>{
        try {
            userApi.LoginAPI(this.state.email,this.state.password).then(
              (res) =>{
                console.log(res.headers);
                setTimeout(() => {
                    this.setState({
                        handlepage:res.code
                    });
                  }, 500);  
                 
                
                localStorage.setItem('user',JSON.stringify({
                    token:res.data.token
                    
                }));
                
              }
              
             
          );
          } catch (e) {
            console.log("failed ngu ngu gnug g",e);
          
          }
          console.log(this.state.handlepage);

      }

      handleLogin =(e)=>{
        e.preventDefault();
        this.callAPI();
       // this.clearInput();
        

      }
      
      render(){
      
        if(this.state.handlepage ===null)
        {
            return(
                <div className="base-container" ref={this.props.containerRef}>
                    <div className="header">Login</div>
                    <div className="content">
                        <div className="image">
                            <img src={loginImg}></img>
                        </div>
                        <div className="form">
                        <form>
                            <div className="form-group">
                                <label htmlFor="username">UserName</label>
                                <input type="text" name="email"  onChange={this.handleChange}   placeholder="username"  />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Password</label>
                                <input type="password" name="password"  onChange={this.handleChange}   placeholder="password"  />
                            </div>
                          </form>
                        </div>
                    </div>
                    <div className="footer">
                      <button type="button" onClick={this.handleLogin} className="btn-all" >Login</button>
                    </div>
  
                </div>
  
            );
  
        
        }
        else{
           
            return <Redirect to={
                {
                    pathname:'/home',
                   
                }
            }/>
            
        }
          
    }
}
export default Login;