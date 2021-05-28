import React, { Component } from "react";
import loginImg from "../../login.svg";
import userApi from '../../api/UserApi';
class Login extends Component{
    constructor(props) {
        super(props);
        this.state={email:null,
                    password:null,
                    handle_login:null
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
                 
                 this.setState({
                  handle_login:res.code
                })    
                console.log(this.state.handle_login); 
              }
              
             
          );
          } catch (e) {
            console.log("failed ngu ngu gnug g",e);
          
          }

      }
     
      clearInput=()=>{
        this.setState({email:null,
            password:null,
            handle_login:null
            });
      }
      handleLogin =(e)=>{
            e.preventDefault();
          this.callAPI();
         // if(this.state.handle_login)

      }
      
      render(){
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
                    <button type="button" onClick={this.handleLogin} className="btn" >Login</button>
                  </div>

              </div>

          );
    }
}
export default Login;