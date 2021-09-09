import React,{ Component } from 'react';
import loginImg from "../../login.svg";
import userApi from '../../api/UserApi';
class Register extends Component{
    constructor(props) {
        super(props);
        this.state={
            username:null,
            email:null,
            password:null,
            handle_regis:null,
        }
        this.handleChange=this.handleChange.bind(this);
        //this.submit=this.submit.bind(this);
        this.handleRegis=this.handleRegis.bind(this);
       
      }
      componentDidMount(){
        console.log(this.state.handle_regis); 
      }
      handleChange(event){
          let name=event.target.name;
          let value=event.target.value;
         
          let data={};
          data[name]=value;
          this.setState(data);
       
        
      }
      handleRegis=()=>{
        if(this.state.handle_regis===201)
        {
            this.props.changeRegister();
        }
      }
    

      callAPI=()=>{
        try {
            userApi.RegisterAPI(this.state.username,this.state.email,this.state.password).then(
              (res) =>{
                 
                 this.setState({
                  handle_regis:res.code
                })    
                console.log(this.state.handle_regis); 
              }
              
             
          );
          } catch (e) {
            console.log("failed ngu ngu gnug g",e);
          
          }

      }
      btnRegister = (e)=>{
        e.preventDefault();
            this.callAPI();
            setTimeout(() => {
              this.handleRegis();
            }, 1500);           
      }
      render(){
          return(
              <div className="base-container">
                  <div className="header">Register</div>
                  <div className="content">
                      <div className="image">
                        <img src={loginImg}></img>
                      </div>
                      <div className="form">
                      <form onSubmit={this.submit}>
                          <div className="form-group">
                              <label htmlFor="username">UserName</label>
                              <input type="text" name="username"  onChange={this.handleChange}   placeholder="username"  />
                          </div>
                          <div className="form-group">
                              <label htmlFor="username">Email</label>
                              <input type="email" name="email"     onChange={this.handleChange} placeholder="email"  />
                          </div>
                          <div className="form-group">
                              <label htmlFor="username">Password</label>
                              <input type="password" name="password"   onChange={this.handleChange} placeholder="password"  />
                          </div>
                        </form>
                      </div>
                  </div>
                  <div className="footer">
                    <button type="button" className="btn-all" onClick={this.btnRegister} >Register</button>
                  </div>

              </div>

          );
    }
}
export default Register;